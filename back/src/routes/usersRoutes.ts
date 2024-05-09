import {Request, Response, Router} from 'express';
import {login, register} from '../services/userAuth';
import {AuthenticatedRequest, authenticateMiddleware} from '../services/authentication';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/api/auth/register', [], async (req: Request, res: Response) => {
    if (req.body?.email && req.body?.password) {
        const {email, password} = req.body;

        try {
            const user = await register({email, password});

            res.status(201)
                .json(user);
        } catch (e) {
            res.status(403)
                .json({message: `Email is already used or Invalid credentials: ${process.env.PASSWORD_CONDITIONS}`});
        }
    } else {
        res.status(400)
            .json({message: 'Invalid email or password'});
    }
});

router.post('/api/auth/login', [], async (req: Request, res: Response) => {
    if (req.body?.email && req.body?.password) {
        const {email, password} = req.body;

        try {
            const jwt = await login({email, password});
            res.status(200)
                .json({token: jwt});
        } catch (e) {
            res.status(403)
                .json({message: 'Invalid credentials, the account must surely not exist'});
        }
    } else {
        res.status(400)
            .json({message: 'Invalid email or password'});
    }
});

router.post('/api/auth/logout', authenticateMiddleware, (req: AuthenticatedRequest, res: Response) => {
    return res.send('Logged out!');
});

export {router as basicAuthRouter};
