import mongoose from 'mongoose';
import Role from './Role.js';
import isDefaultRole from '../middlewares/isDefaultRole.js';

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
  date_created: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['actif', 'inactif'], 
    default: 'actif' 
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role',
    required: true,
    validate: {
      validator: async function(value) {
        const role = await Role.findById(value);
        return role !== null;
      },
      message: 'Le rôle spécifié n\'existe pas',
    },
  },

});

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

export default mongoose.model('User', userSchema);