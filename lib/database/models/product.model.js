import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    title: {type: String, required: true, unique: true},
    imageUrl: {type: String, required: true},
    details: {type: String, required: true},
    origPrice: {type: Number, required: true},
    discountInPercent: {type: Number, required: true},
})

const Product = models.Product || model('Product', ProductSchema)

export default Product;