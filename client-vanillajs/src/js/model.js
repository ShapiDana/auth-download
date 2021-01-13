import * as model from './model.js';
import { AJAX } from './helpers.js';
import * as consts from './config';


export const state = {
    name: '',
    password: '',
    page: consts.REGISTER_PAGE
};

export const registerName = async (username) => {
    try {
        if (!_validateName(username)) {
            return "Error: Invalid input. Name must contain english letters only."
        }

        state.name = username;

        const password = await AJAX(`${consts.REST_API_URL}/register`, {name: username});

        return password;

    } catch(err) {
        console.error(`model.registerName --> ${err}`);
        return err.toString();
    }
};

export const downloadImage = async (user) => {
    try {
        const downloadBlocked = _validateDownloadCredentials(user);
        if (downloadBlocked) {
            return downloadBlocked;
        }
        state.name = user.name;
        state.password = user.password;
    
        const url = new URL(`${consts.HTTP_API_URL}/download`);
        const params = user;
        url.search = new URLSearchParams(params).toString();

        const binary = await AJAX(url);
        console.log(binary);
    
        return binary;
    } catch(err) {
        console.log(err);
        return err.toString();
    }
}

const _validateDownloadCredentials = (user) => {
    if (!user) {
        return "Error: Invalid input."
    }
    if (!user.name) {
        return "Error: Invalid input. Empty name field."
    }
    if (!user.password) {
        return "Error: Invalid input. Empty password field."
    }
    if (!_validateName(user.name)) {
        return "Error: Invalid input. Name must contain english letters only."
    }
    if (!_validatePassword(user.password)) {
        return "Error: Invalid input. Password must contain english letters and digits only."
    }

    return null;
}

const _validateName = (nameStr) => {
    return nameStr && (nameStr.match(/[a-zA-z]/g).length === nameStr.length);
};

const _validatePassword = (passwordStr) => {
    return passwordStr && (passwordStr.match(/[a-zA-z0-9]/g).length === passwordStr.length);
};