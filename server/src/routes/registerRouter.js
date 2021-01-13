import { Router, Request, Response } from 'express';
import * as cors from './cors';
import bodyParser from 'body-parser';
import UserService from '../services/user';
import Validate from '../services/validate';
import { readFileSync } from 'fs';

const registerRouter = Router();
registerRouter.use(bodyParser.json());

registerRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, Validate.inputName, (req, res, next) => {
    const userPassword = UserService.Signup(req.body.name);

    res.setHeader('Content-Type', 'application/json');

    if (userPassword) {
        res.status(200).json(userPassword);
    } else {
        res.status(500).json({"error": "Server could not generate password"});
    }
});

export default registerRouter;
