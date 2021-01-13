import UserModel from '../models/user'

export default class Authenticate {
    static AuthorizedUser(user) {
        return UserModel.find(user);
    }
}