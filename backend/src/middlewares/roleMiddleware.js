// Middleware pour vérifier si l'utilisateur est un admin
const isAdmin = (req, res, next) => {
  const userRole = req.userRole; // Le rôle de l'utilisateur est ajouté par le middleware d'authentification

  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Accès interdit, vous devez être un administrateur.' });
  }

  next();
};

// Middleware pour vérifier si l'utilisateur est un utilisateur (user)
const isUser = (req, res, next) => {
  const userRole = req.userRole; // Le rôle de l'utilisateur est ajouté par le middleware d'authentification

  if (userRole !== 'user') {
    return res.status(403).json({ message: 'Accès interdit, vous devez être un utilisateur.' });
  }

  next(); 
};

// Middleware pour vérifier si l'utilisateur est un administrateur ou l'utilisateur lui-même
const isAdminOrSelf = async (req, res, next) => {
  const userId = req.params.userId; // ID de l'utilisateur à vérifier (paramètre de la route)
  const loggedInUserId = req.userId; // ID de l'utilisateur connecté via le token JWT
  const userRole = req.userRole;     // Récupéré dans le middleware de protection du JWT

  // Vérifier si l'utilisateur connecté est un administrateur
  if (userRole === 'admin') {
    return next(); // Si l'utilisateur est un admin, il peut accéder à l'info de n'importe quel utilisateur
  }

  // Vérifier si l'utilisateur est l'utilisateur lui-même
  if (userId === loggedInUserId) {
    return next(); // Si l'ID de l'utilisateur connecté correspond à l'ID de l'utilisateur demandé, on continue
  }

  // Si l'utilisateur n'est ni l'admin, ni l'utilisateur concerné
  return res.status(403).json({ message: 'Accès interdit. Vous devez être un administrateur ou l\'utilisateur concerné.' });
};

export { isAdmin, isUser, isAdminOrSelf };
