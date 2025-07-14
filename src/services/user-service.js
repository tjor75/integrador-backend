import jwt from "jsonwebtoken";
import * as userRepository from '../repositories/user-repository.js';
import { JWTSecretKey, JWTOptions } from '../configs/jwt-config.js';

const loginAsync = async (username, password) => {
    const user = await userRepository.getUserPasswordByUsernameAsync(username);
    let returnToken = null;
    
    if (user !== null && password === user.password)
        returnToken = jwt.sign({
            id:         user.id,
            username:   user.username,
            firstName:  user.firstName,
            lastName:   user.lastName
        }, JWTSecretKey, JWTOptions);

    return returnToken;
};

const registerAsync = async (firstName, lastName, username, password) => {
    const result = await userRepository.registerAsync(firstName, lastName, username, password);
    return result;
};

export { loginAsync, registerAsync };