// Middleware pour vérifier le rôle par défaut

import Role from '../models/Role.js';

const isDefaultRole = async function(next) {
    if (!this.role) {
        const defaultRole = await Role.findOne({ role: 'user' });
        if (defaultRole) {
            this.role = defaultRole._id;
        }
    }
    next();
};
export default isDefaultRole;