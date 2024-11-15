import mongoose from 'mongoose';

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
    ref: 'Role' 
  },
});

export default mongoose.model('User', userSchema);