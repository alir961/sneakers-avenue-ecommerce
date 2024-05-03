import { Request, Response } from 'express';
import {User} from '../schema/users/users.model';

const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).send({ error: 'Error getting users' });
    }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body, 
            {new: true},
        );

        if (!updatedUser) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ error: 'Error updating user' });
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
