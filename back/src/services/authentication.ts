import {IUser, User} from '../schema/users/users.model';
import {JwtPayload, sign, verify} from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

interface UserPayload {
  user: IUser;
}

interface AuthenticatedRequest extends Request {
  user: IUser;
}

function generateAccessToken(user: IUser): string {
    return sign({user: user}, accessTokenSecret, {expiresIn: '3600s'});
}

function authenticateMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const header = req.headers['authorization'];
    const token = header?.split(' ')[1];

    if (!header?.startsWith('Bearer ') || !token)
        return res.sendStatus(401);

    verify(token, accessTokenSecret, async (hasError, payload) => {
        const isUser = (jwt: string | JwtPayload | undefined): jwt is UserPayload => {
            return !!(jwt as UserPayload);
        };

        if (hasError || !isUser(payload))
            return res.sendStatus(401);
        
        const user = await User.findOne({ _id: payload.user._id }).exec();
        if (!user) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
}

export {AuthenticatedRequest, generateAccessToken, authenticateMiddleware};
