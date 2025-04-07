const adminMiddleware = (req, res, next) => {
    // Check if the user is an admin
   if (req.user.role.toLowerCase() !== "admin")  {
      return res.status(403).json({ error: "Access denied, admin only" });
    }
    
    next(); // Allow access if user is admin
  };
  
  export default adminMiddleware;
  