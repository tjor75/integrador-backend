import jwt from "jsonwebtoken";
import * as userRepository from '../repositories/user-repository.js';
import { JWTSecretKey, JWTOptions } from '../configs/jwt-config.js';

const loginAsync = async (username, password) => {
    const user = await userRepository.getUserPasswordByUsernameAsync(username);
    let returnToken = null;
    
    if (user !== null && password === user.password)
        returnToken = jwt.sign({ id: user.id }, JWTSecretKey, JWTOptions);

    return returnToken;
};

const registerAsync = async (firstName, lastName, username, password) => {
    const id = await userRepository.createAsync(firstName, lastName, username, password);
    return id;
};

const getCurrentUserAsync = async (req) => {
    const authHeader = req.headers.authorization;
    let user = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            user = await jwt.verify(token, JWTSecretKey);
        } catch (err) {
            console.error(err);
            user = null;
        }
    }

    return user;
};

export { loginAsync, registerAsync, getCurrentUserAsync };