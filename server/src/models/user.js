import { response } from 'express';
import fs from 'fs';
import path from 'path';

const jsonFilePath = path.join(__dirname, '../db/users.json');

const _addUserToDB = (user) => {
    return new Promise((resolve, reject) => {
        const errorLocation = 'UserModel._addUserToDB:';
        try {
            fs.readFile(jsonFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.log(`${errorLocation} ${err}`);
                    return false;
                } else {
                    let dataSet = JSON.parse(data);
            
                    if (!dataSet) {
                        return false;
                    }
            
                    // if "users" array does not exist - create it before moving on
                    if (!dataSet.users) {
                        dataSet.users = [];
                    }
            
                    if (!dataSet.users.find(savedUser => savedUser.name === user.name && savedUser.password === user.password)) {
                        dataSet.users.push(user);
                        const json = JSON.stringify(dataSet);
                        fs.writeFile(jsonFilePath, json, 'utf8', (err) => {
                            if (err) {
                                console.error(err);
                                return false;
                            } else {
                                return true;
                            }
                        });
                    }
            
                    return true;
                }
            });
        } catch(err) {
            console.log(`${errorLocation} ${err}`);
            return false;
        }

        return true;
    });
};
// const _isUserInDB = (user) => {
//     fs.promises.readFile(jsonFilePath, 'utf8')
//     .then((result) => {
//         let dataSet = JSON.parse(result);
//         console.log(dataSet.users);
//         if (!dataSet || !dataSet.users) {
//             return null;
//         }
//         const found = dataSet.users.find(savedUser => savedUser.name === user.name && savedUser.password === user.password);
//         console.log(found);
//         return dataSet.users.find(savedUser => savedUser.name === user.name && savedUser.password === user.password);
//     })
//     .catch((error) => {
//         console.log(`'UserModel._findUserInDB:' ${error}`);
//         return null;
//     });
// }

// const _isUserInDB = (user) => {
//     return new Promise((resolve, rejevt) => {
//         const errorLocation = 'UserModel._findUserInDB:';
//         try {
//             fs.readFile(jsonFilePath, 'utf8', (err, data) => {
//                 if (err) {
//                     console.log(`${errorLocation} ${err}`);
//                     return null;
//                 } else {
//                     const dataSet = JSON.parse(data);
//                     if (!dataSet || !dataSet.users) {
//                         resolve(null);
//                     }
//                     resolve(dataSet.users.find(savedUser => savedUser.name === user.name && savedUser.password === user.password) === true);
//                 }
//             });

            
//         } catch(err) {
//             console.log(`${errorLocation} ${err}`);
//             return null;
//         }
//     });
// };

const _isUserInDB = async (user) => {
    const errorLocation = 'UserModel._findUserInDB:';
    try {
        console.log('before read');
        const dataSet = fs.readFileSync(jsonFilePath, 'utf8');
        console.log('after read');
        const data = JSON.parse(dataSet);
        console.log('*********');
        console.log(data);
        if (!data || !data.users) {
            return false;
        }
        return (await data.users.find(savedUser => savedUser.name === user.name && savedUser.password === user.password)) === true;
    } catch(err) {
        console.log(`${errorLocation} ${err}`);
        return false;
    }
};

export default class UserModel {
    static async create(user) {
        // check for a valid user before saving to db
        if (user.password.includes(user.name)) {
            // add name and password to db
            return await _addUserToDB(user);
        } else {
            return false;
        }
    }

    static async find(user) {
        const isFound = await _isUserInDB(user);
        console.log(`isFound: ${isFound}`);
        return isFound;
    }
}