import UserModel from '../models/user';

const _generateRandomString = () => {
    let str = '';

    while (!str){
        const len = Math.floor(Math.random() * 10) + 1;
        str = Math.random().toString(36).substr(2, len);
    }

    return str;
};

const _getRandomStringBasedOn = (name) => {
    const prefix = _generateRandomString();
    const sufix = _generateRandomString();

    return `${prefix}${name}${sufix}`;
};

class UserService {
    static Signup(name) {
        if (!name) {
            return null;
        }
        
        const user = {
            name,
            password: _getRandomStringBasedOn(name)
        };

        if (UserModel.create(user)) {
            return user.password;
        }
        return null;
    }


}

export default UserService;