import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    role: { 
        type: String, 
        enum: ['guest', 'user', 'admin'], 
        default: 'user' },
});
export default mongoose.model('Role', userSchema);