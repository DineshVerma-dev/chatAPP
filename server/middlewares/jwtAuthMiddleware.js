import jwt from "jsonwebtoken";


export const jwtAuthMiddleware = (req, res, next) => {
    try {
        const gettoken = req.headers.authorization;


        if (!gettoken) {
            return res.status(401).json({ message: "Authorization header missing" });
        }


        const token = gettoken.split(" ")[1];


        if (!token) {
            return res.status(401).json({ message: "Token missing from Authorization header" });
        }


        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }


        req.user = decode.user;
        next();
    } catch (error) {
        console.error("Error in jwtmiddleware:", error);


        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }


        return res.status(500).json({ message: "Internal server error" });
    }

}