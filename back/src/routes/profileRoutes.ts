import {AuthenticatedRequest, authenticateMiddleware} from '../services/authentication';
import {Response, Router} from 'express';
import {User} from '../schema/users/users.model';
import {updateUser} from '../services/userController';

const router = Router();

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

        if (data.email) {
            await updateUser(userId, data);
            res.sendStatus(200);
        } else
            res.status(400).json({message: 'Missing Email in body'});
    } catch (error) {
        console.error('Error updating user', error);
        res.sendStatus(500);
    }
});

export {router as profileRouter};
