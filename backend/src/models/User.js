import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  rôle: { type: String, enum: ['guest', 'utilisateur', 'administrateur'], default: 'utilisateur' },
});

export default mongoose.model('User', userSchema);