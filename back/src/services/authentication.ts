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
    // Only the id: a JWT is readable by anyone holding it, so it must not carry the password hash
    return sign({user: {_id: String(user._id)}}, accessTokenSecret, {expiresIn: '3600s'});
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
        
        const user = await User.findOne({ _id: payload.user._id }).select('-password').exec();
        if (!user) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
}

/** Rejects requests on a `:userId` resource that belongs to someone else. */
function ownResourceMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.params.userId ?? req.body?.userId;
    if (userId && String(req.user._id) !== String(userId))
        return res.sendStatus(403);
    next();
}

function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user.isAdmin)
        return res.sendStatus(403);
    next();
}

export {AuthenticatedRequest, generateAccessToken, authenticateMiddleware, ownResourceMiddleware, adminMiddleware};
