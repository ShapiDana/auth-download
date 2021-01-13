import { Router, Request, Response } from 'express';
import { REGISTER_ROUTE } from '../config/routes';

const baseRouter = Router();

baseRouter.get('/', (req, res, next) => {
    res.redirect(REGISTER_ROUTE);
});

export default baseRouter;
