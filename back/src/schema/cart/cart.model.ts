import {Schema, model, Types} from 'mongoose';

interface CartItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ICart {
  userId: Types.ObjectId;
  items: CartItem[];
}

const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String, required: false },
});

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
});

const Cart = model<ICart>('Cart', CartSchema);

export type {ICart};
export {Cart};
