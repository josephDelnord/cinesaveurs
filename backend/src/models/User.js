import mongoose from 'mongoose';
import Role from './Role.js';
import isDefaultRole from '../middlewares/isDefaultRole.js';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  confirmPassword: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    enum: ['actif', 'inactif'], 
    default: 'actif' 
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role',
    validate: {
      validator: async function(value) {
        const role = await Role.findById(value);
        return role !== null;
      },
      message: 'Le rôle spécifié n\'existe pas',
    },
  },

}, { timestamps: true });

// Appliquer le middleware isDefaultRole avant la sauvegarde
userSchema.pre('save', isDefaultRole);

// Méthodes utiles
userSchema.methods.isGuest = async function() {
  const role = await Role.findById(this.id_role);
  return role.role === 'guest';
};
userSchema.methods.isUser = async function() {
  const role = await Role.findById(this.id_role);
  return role.role === 'user';
};
userSchema.methods.isAdmin = async function() {
  const role = await Role.findById(this.id_role);
  return role.role === 'admin';
};

// Avant de sauvegarder, vérifier que les mots de passe correspondent
userSchema.pre('save', function (next) {
  if (this.isModified('mot_de_passe') && this.confirmPassword !== this.mot_de_passe) {
    next(new Error('Les mots de passe ne correspondent pas.'));
  } else {
    next();
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.mot_de_passe);
};

export default mongoose.model('User', userSchema);