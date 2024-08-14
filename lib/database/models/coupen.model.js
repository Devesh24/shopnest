import { Schema, model, models } from "mongoose";

const CoupenSchema = new Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, required: true },
    discount: { type: Number, required: true },
});

const Coupen = models.Coupen || model('Coupen', CoupenSchema);

export default Coupen;