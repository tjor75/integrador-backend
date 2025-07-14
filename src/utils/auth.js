import jwt from "jsonwebtoken";

const getCurrentUser = async (req) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const user = await jwt.verify(token, process.env.JWT_SECRET);
            return user;
        } catch (err) {
            return null;
        }
    }
};

export { getCurrentUser };