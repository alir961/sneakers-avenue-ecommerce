import {AuthenticatedRequest, authenticateMiddleware} from '../services/authentication';
import {Response, Router} from 'express';
import {User} from '../schema/users/users.model';
import {Cart} from '../schema/cart/cart.model';
import {updateUser} from '../services/userController';

const router = Router();
const EMAIL_REGEX: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

router.get('/api/me', authenticateMiddleware, (req: AuthenticatedRequest, res: Response) => {
    return res.send(req.user);
});

router.get('/api/me/status', authenticateMiddleware, (req: AuthenticatedRequest, res: Response) => {
    return res.send(req.user.isAdmin);
});

router.delete('/api/me', authenticateMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id).exec();

        if (user) {
            await Cart.deleteMany({userId: user._id}).exec();
            await user.deleteOne();
        }
        res.sendStatus(200);
    } catch (e) {
        console.warn('Error while deleting account', e);
        res.sendStatus(500);
    }
});

router.put('/api/profile', authenticateMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const data = req.body;

        if (!data.email) { return res.status(400).json({ message: 'Missing email in request body' }); }

        if (typeof data.email !== 'string' || !EMAIL_REGEX.test(data.email)) { return res.status(400).json({ message: 'Invalid email format' }); }

        const owner = await User.findOne({email: data.email, _id: {$ne: userId}}).exec();
        if (owner) { return res.status(409).json({ message: 'Email is already used' }); }

        await updateUser(userId, data);
        return res.sendStatus(200);
    } catch (error) {
        console.error('Error updating user', error);
        res.sendStatus(500);
    }
});

export {router as profileRouter};
