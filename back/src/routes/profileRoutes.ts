import {AuthenticatedRequest, authenticateMiddleware} from '../services/authentication';
import {Response, Router} from 'express';
import {User} from '../schema/users/users.model';
import {updateUser} from '../services/userController';

const router = Router();
const EMAIL_REGEX: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

router.get('/api/me', authenticateMiddleware, (req: AuthenticatedRequest, res: Response) => {
    return res.send(req.user);
});

router.delete('/api/me', authenticateMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id).exec();

        if (user)
            await user.deleteOne();
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

        if (!EMAIL_REGEX.test(data.email)) { return res.status(400).json({ message: 'Invalid email format' }); }

        await updateUser(userId, data);
        return res.sendStatus(200);
    } catch (error) {
        console.error('Error updating user', error);
        res.sendStatus(500);
    }
});

export {router as profileRouter};
