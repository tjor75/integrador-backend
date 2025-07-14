import "dotenv/config";

const JWTSecretKey = process.env.JWT_SECRET_KEY;
const JWTOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1h"
};

export { JWTSecretKey, JWTOptions };