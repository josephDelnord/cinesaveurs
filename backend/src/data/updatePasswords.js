import bcrypt from 'bcryptjs';
import User from '../models/User.js';  // Assurez-vous que ce modèle est correctement importé

export const updatePasswords = async () => {
	try {
		// Récupérer tous les utilisateurs dans la base de données
		const users = await User.find();

		// Parcourir tous les utilisateurs et mettre à jour les mots de passe
		for (const user of users) {
			// Si le mot de passe n'est pas déjà haché
			if (!user.password.startsWith('$2a')) {  // bcrypt hashed passwords start with "$2a$"
				console.log(`Mise à jour du mot de passe pour l'utilisateur: ${user.email}`);

				// Hacher le mot de passe
				const hashedPassword = await bcrypt.hash(user.password, 10);

				// Mettre à jour l'utilisateur avec le mot de passe haché
				user.password = hashedPassword;
				await user.save();
			}
		}

		console.log('Mise à jour des mots de passe terminée.');
	} catch (error) {
		console.error('Erreur lors de la mise à jour des mots de passe:', error);
	}
};