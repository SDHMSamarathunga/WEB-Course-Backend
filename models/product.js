import mongoose from "mongoose";
const productSchema = new mongoose.Schema({

    productId : {
        type: String,
        required: true,
        unique: true
    },

    name : {
        type: String,
        required: true
    },

    altName : {
        type: [String],
        default: []
    },

    labellePrice : {
        type: Number,
        required: true
    },

    price : {
        type: Number,
        required: true
    },

    image : {
        type: String,
        default: ["/default-productjpg"]
    },

    description : {
        type: String,
        required: true
    },

    stock : {
        type: Number,
        required: true,
        default: 0
    },

    isAvailable : {
        type: Boolean,
        default: true
    },

    category : {
        type: String,
        required: "cosmetics"
    }

});
const Product = mongoose.model("Product", productSchema);
export default Product;
