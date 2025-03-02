import jwt from 'jsonwebtoken';

const generateAccessToken = (userId) => {
    try {
        return jwt.sign(
            { id: userId },
            process.env.SECRET_KEY_ACCESS_TOKEN,
            { expiresIn: '5h' }
        );
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Could not generate access token");
    }
};

export default generateAccessToken;
