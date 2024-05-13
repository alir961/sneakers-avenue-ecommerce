import {Schema, model} from 'mongoose';

interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    isAdmin: { 
        type: Boolean,
        default: false,
        required: false,
    },
});

const User = model<IUser>('User', UserSchema);

export type {IUser};
export {User};
