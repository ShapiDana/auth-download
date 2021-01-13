import UserModel from '../models/user';

const _validateInputString = (string) => {
    return string && string.match(/[a-zA-Z]/gi).length === string.length;
}
export default class Validate {
    static inputName(req, res, next) {
        try {
            if (_validateInputString(req.body.name)) {
                next();
            } else {
                res.status(403).json({"error": "Forbidden input"});
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({"error": "Internal server error"});
        }
    }

    static inputUser(user) {
        if (!user || !user.name || !user.password) {
            return false;
        }

        Object.keys(user).forEach(key => {
            if (!_validateInputString(user[key])) {
                return false;
            }
        });
        return true;
    }
}