import jwt from "jsonwebtoken";

export const jwtAuthMiddleware = (req, res, next) => {
    try {
        // Get the Authorization header
        const gettoken = req.headers.authorization;

        if (!gettoken) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        // Extract the token (remove "Bearer")
        const token = gettoken.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token missing from Authorization header" });
        }

        // Verify the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decode);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Attach the decoded user info to the request
        req.user = decode.user; // Decoded payload from the token
        console.log("User object attached to request:", req.user);
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Error in jwtmiddleware:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};
