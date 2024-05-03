import { Request, Response } from 'express';
import {IUser, User} from '../schema/users/users.model';

const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).send({ error: 'Error getting users' });
    }
};

const updateUser = async (userId: string, profile: IUser) => {
    try {
        const user = await User.findById(userId).exec();

        user.email = profile.email;
        user.firstName = profile.firstName;
        user.lastName = profile.lastName;
        await user.save();
    } catch (error) {
        console.error('Unable to update user', error);
    }
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

export { getUsers, updateUser, deleteUser };
