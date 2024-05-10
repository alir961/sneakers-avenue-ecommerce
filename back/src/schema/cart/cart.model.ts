import {Schema, model, Types} from 'mongoose';

interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

interface ICart {
  userId: Types.ObjectId;
  items: CartItem[];
}

const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
});

const Cart = model<ICart>('Cart', CartSchema);

export type {ICart};
export {Cart};
