import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        // Log the cookies to check for token presence
        // console.log("Cookies: ", req.cookies);

        // Check if the token exists
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded Token: ", decoded);
        } catch (err) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // Ensure userid is a valid string before converting to ObjectId
        if (!decoded.userid || typeof decoded.userid !== "string") {
            return res.status(401).json({ error: "Unauthorized: Invalid user ID" });
        }

        // Check if userid is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(decoded.userid)) {
            return res.status(401).json({ error: "Unauthorized: Invalid user ID" });
        }

        // Convert userid to ObjectId
        const userid = new mongoose.Types.ObjectId(decoded.userid);
        
        // Fetch user by ID
        const user = await User.findById(userid).select("-password");

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach user to request object
        req.user = user;

        // Call next middleware
        next();

    } catch (error) {
        console.error("Error in Protect Middleware:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default protectRoute;
