import express from 'express';   
import { createProduct, deleteProduct, getProductInfo, getProducts, updateProduct } from '../controllers/productController.js';

//API Endpoints
const productRouter = express.Router();
productRouter.post("/", createProduct); // createProduct
productRouter.get("/", getProducts); // Assuming you have a getProducts function in your controller
productRouter.get("/:ProductId", getProductInfo); // getProduct
productRouter.delete("/:ProductId", deleteProduct); // deleteProduct
productRouter.put("/:ProductId", updateProduct); // updateProduct

export default productRouter;
