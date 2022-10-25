import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY;

export function verifyToken(jwtToken) {
    try {
        return jwt.verify(jwtToken, JWT_KEY);
    } catch (e) {
        return null;
    }
}

