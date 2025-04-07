import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    console.log("User ID from Middleware:", req.user.userId); // Debugging

    const user = await User.findById(req.user.userId).select("-password");
    
    
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User Found:", user); // Debugging
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // ✅ Fix: Correct file path
    if (req.file) {
      user.avatar = `http://localhost:500/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ message: "Profile update failed", error: err.message });
  }
};
export const getUserList = async (req,res) =>{
 try{
  const { page=1, limit=10} = req.body;
  const skip = ((parseInt(page,10)-1) * parseInt(limit,10) )
  const criteria = {};
  if (req.body.search){
    let search = req.body.search;
    criteria.$or=[ {name:{$regex:search,$options:"i"}},{email:{$regex:search,$options:"i"}}]
  }
  const userList = await User.find(criteria).skip(skip).limit(limit)
  return res.status(200).json({success:true,userList, message:"user list"})
 }
 catch(error){
   throw error;
}
}
