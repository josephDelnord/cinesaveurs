import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Status from "../models/Status.js";
import updateUserSchema from "../validation/schemas/userValidation.js"; // Assurez-vous que ce schéma de validation est défini

// Récupérer les informations d'un utilisateur (accessible uniquement par l'utilisateur lui-même ou un administrateur)
export const getUserInfo = async (req, res) => {
  const userId = req.params.userId; // L'ID de l'utilisateur passé dans l'URL

  try {
    // Récupérer l'utilisateur demandé
    const user = await User.findById(userId)
      .select("-password") // Ne pas retourner le mot de passe
      .populate("status", "status_name") // Populate le statut et récupérer le nom du statut
      .populate("role", "role_name"); // Populate le rôle et récupérer le nom du rôle

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Si l'utilisateur a un statut et un rôle définis, on récupère leur nom respectivement
    const statusName = user.status ? user.status.status_name : "Non défini";
    const roleName = user.role ? user.role.role_name : "Non défini";

    // Retourner les informations de l'utilisateur
    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      status: statusName, // Affichage du nom du statut
      role: roleName, // Affichage du nom du rôle
    });
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des informations de l'utilisateur:",
      err
    );
    return res
      .status(500)
      .json({
        message:
          "Erreur serveur lors de la récupération des informations de l'utilisateur.",
      });
  }
};

// Mettre à jour les informations d'un utilisateur
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, newPassword, confirmPassword, status, role } =
    req.body;

  // Valider les données avec Joi
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Données invalides", errors: error.details });
  }

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier et mettre à jour le statut (si fourni)
    if (status) {
      const validStatus = await Status.findById(status); // Chercher le statut par son ID
      if (!validStatus) {
        return res.status(400).json({ message: "Statut non valide" });
      }
      user.status = status; // Mettre à jour le statut avec l'ID valide
    }

    // Vérifier et mettre à jour le rôle (si fourni)
    if (role) {
      const validRole = await Role.findById(role); // Chercher le rôle par son ID
      if (!validRole) {
        return res.status(400).json({ message: "Rôle non valide" });
      }
      user.role = role; // Mettre à jour le rôle avec l'ID valide
    }

    // Mise à jour des informations de l'utilisateur (par exemple, le nom, l'email)
    if (name) user.name = name;
    if (email) user.email = email;

    // Si un nouveau mot de passe est fourni, vérifier et mettre à jour
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Mot de passe actuel incorrect." });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({
            message: "Les nouveaux mots de passe ne correspondent pas.",
          });
      }

      user.password = await bcrypt.hash(newPassword, 10); // Hachage du nouveau mot de passe
    }

    // Sauvegarder les modifications
    await user.save();

    // Si l'utilisateur a un statut et un rôle définis, on récupère leur nom respectivement
    const statusName = user.status ? user.status.status_name : "Non défini";
    const roleName = user.role ? user.role.role_name : "Non défini";

    // Retourner les nouvelles informations de l'utilisateur
    return res.status(200).json({
      message: "Utilisateur mis à jour avec succès.",
      id: user._id,
      name: user.name,
      email: user.email,
      status: statusName, // Nom du statut
      role: roleName, // Nom du rôle
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
    return res
      .status(500)
      .json({
        message: "Erreur serveur lors de la mise à jour de l'utilisateur.",
      });
  }
};

// Supprimer un utilisateur (accessible uniquement par un administrateur)
export const deleteUser = async (req, res) => {
  const userId = req.params.userId; // ID de l'utilisateur à supprimer

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer l'utilisateur
    await user.remove();

    // Retourner une réponse confirmant la suppression
    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur:", err);
    return res
      .status(500)
      .json({
        message: "Erreur serveur lors de la suppression de l'utilisateur",
      });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs avec leurs status et roles peuplés
    const users = await User.find()
      .select("-password") // Ne pas retourner les mots de passe des utilisateurs
      .populate("status", "status_name") // Peupler le statut (avec le champ 'status_name')
      .populate("role", "role_name"); // Peupler le rôle (avec le champ 'role_name')

    // Si aucun utilisateur n'est trouvé, retourner un tableau vide
    if (!users.length) {
      return res.status(200).json([]);
    }

    // Retourner la liste des utilisateurs avec leurs informations détaillées
    return res.status(200).json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la récupération des utilisateurs",
      });
  }
};

// Vérifier le statut de l'utilisateur (accessible uniquement par l'utilisateur lui-même ou un administrateur)
export const checkUserStatus = async (req, res) => {
  const userId = req.params.userId; // ID de l'utilisateur dont le statut est demandé

  try {
    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Retourner le statut de l'utilisateur
    res.status(200).json({ status: user.status });
  } catch (err) {
    console.error(
      "Erreur lors de la vérification du statut de l'utilisateur:",
      err
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Suspendre un utilisateur (accessible uniquement par un administrateur)
export const suspendUser = async (req, res) => {
  const userId = req.params.userId; // ID de l'utilisateur à suspendre

  try {
    // Trouver l'utilisateur à suspendre
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mettre à jour le statut de l'utilisateur à "suspendu"
    user.status = "suspended";
    await user.save();

    // Retourner une réponse de succès
    return res
      .status(200)
      .json({ message: "Utilisateur suspendu avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suspension de l'utilisateur:", err);
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la suspension de l'utilisateur",
      });
  }
};

// Activer un utilisateur (accessible uniquement par un administrateur)
export const activateUser = async (req, res) => {
  const userId = req.params.userId; // ID de l'utilisateur à activer

  try {
    // Trouver l'utilisateur à activer
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mettre à jour le statut de l'utilisateur à "actif"
    user.status = "active";
    await user.save();

    // Retourner une réponse de succès
    return res.status(200).json({ message: "Utilisateur activé avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'activation de l'utilisateur:", err);
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de l'activation de l'utilisateur",
      });
  }
};

// Bannir un utilisateur (accessible uniquement par un administrateur)
export const banUser = async (req, res) => {
  const userId = req.params.userId; // ID de l'utilisateur à bannir

  try {
    // Trouver l'utilisateur à bannir
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Mettre à jour le statut de l'utilisateur à "banni"
    user.status = "banned";
    await user.save();
    // Retourner une réponse de succès
    return res.status(200).json({ message: "Utilisateur banni avec succès" });
  } catch (err) {
    console.error("Erreur lors du bannissement de l'utilisateur:", err);
    res
      .status(500)
      .json({
        message: "Erreur serveur lors du bannissement de l'utilisateur",
      });
  }
};

// Récupérer un rôle par son ID
export const getRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }
    res.status(200).json(role);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du rôle", error });
  }
};
