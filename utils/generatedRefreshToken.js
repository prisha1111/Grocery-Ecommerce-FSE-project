import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const generateRefreshToken = async (userId) => {
    try {
        const token = jwt.sign(
            { id: userId },
            process.env.SECRET_KEY_REFRESH_TOKEN,
            { expiresIn: '7d' }
        );

        await User.update(
            { refresh_token: token },
            { where: { id: userId } }
        );

        return token;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Could not generate refresh token");
    }
};

export default generateRefreshToken;
