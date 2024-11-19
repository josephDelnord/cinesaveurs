import mongoose from 'mongoose';
const roleSchema = new mongoose.Schema({
    role: { 
        type: String, 
        required: true,
        unique: true,
        enum: ['guest', 'user', 'admin'], 
        default: 'user'
        },
}, { timestamps: true });

// Méthode statique pour obtenir tous les rôles possibles
roleSchema.statics.getRoles = function() {
    return this.schema.path('role').enumValues;
};

// Constantes pour les rôles (optionnel mais utile)
export const ROLES = {
    GUEST: 'guest',
    USER: 'user',
    ADMIN: 'admin',
};

const Role = mongoose.model('Role', roleSchema);
export default Role;
