import { TestScheduler } from 'jest';
import UserModel from '../models/user';

const _addUserToDB = UserModel.__get__('_addUserToDB');

describe('UserModel tests', () => {
    test('Adding new user correctly', () => {
        expect(_addUserToDB({name: 'Dana', password: 'hfdDanazdfp4'})).toBe(true);
    });
});