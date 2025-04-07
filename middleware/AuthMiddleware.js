import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔹 Token Received:", token);
    console.log("🔹 Decoded Token:", decoded);

    // Ensure the token contains userId and role
    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ error: "Invalid token, missing userId or role" });
    }
  const user = {
  userId:decoded.userId,
  role:decoded.role
  }
    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Access denied, admin only" });
  }
  next();
};

export { authMiddleware, adminMiddleware };
