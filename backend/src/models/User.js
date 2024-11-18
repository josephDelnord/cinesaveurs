import mongoose from 'mongoose';
import Role from './Role.js';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    select: false, // Cela empêche confirmPassword d'être sauvegardé dans la bdd
  },
  status: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif',
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
}, { timestamps: true });

// Middleware pour appliquer un rôle par défaut (user) avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.role) {
    const role = await Role.findOne({ role: 'user' });
    if (role) {
      this.role = role._id;
    } else {
      next(new Error('Le rôle "user" n\'existe pas dans la base de données.'));
    }
  }

  // Vérification que les mots de passe correspondent avant de les hacher
  if (this.isModified('password')) {
    if (this.password !== this.confirmPassword) {
      return next(new Error('Les mots de passe ne correspondent pas.'));
    }

    // Hacher le mot de passe uniquement (ne pas hacher confirmPassword)
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Ne pas sauvegarder confirmPassword dans la base de données
  this.confirmPassword = undefined;

  next();
});

export default mongoose.model('User', userSchema);
