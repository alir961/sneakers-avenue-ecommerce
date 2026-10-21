import { Request, Response } from 'express';
import {IUser, User} from '../schema/users/users.model';

// Errors propagate so the route can answer 500 instead of a false 200.
const updateUser = async (userId: string, profile: IUser) => {
    const user = await User.findById(userId).exec();

    if (!user)
        throw new Error('User not found');
    user.email = profile.email;
    user.firstName = typeof profile.firstName === 'string' ? profile.firstName : '';
    user.lastName = typeof profile.lastName === 'string' ? profile.lastName : '';
    await user.save();
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(`User ${deletedUser._id} has been deleted`);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ error: 'Error deleting user' });
    }
};

export { updateUser, deleteUser };
