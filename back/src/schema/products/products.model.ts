import {Schema, model} from 'mongoose';

interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
});

const Product = model<IProduct>('Product', ProductSchema);

export type {IProduct};
export {Product};
