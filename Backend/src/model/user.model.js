import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    maxlength: 50,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  profileImg: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const UserDb = mongoose.model('User', userSchema);

export default UserDb;