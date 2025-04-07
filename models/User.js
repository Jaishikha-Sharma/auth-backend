// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email: { type: String, unique: true },
  password: {
    type:String,
    required:true
  },
  avatar: { type: String, default: null },
  phone:{
    type:String,
    required:true
  },
  isAdmin: { type: Boolean, default: false }, 
  role:{
    type:String,
    default:"user"
  }
});

const User = mongoose.model('User', userSchema);
export default User;
