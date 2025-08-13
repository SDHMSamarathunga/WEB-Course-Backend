import { response } from "express";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";
export async function createProduct(req, res) {

   if (!isAdmin(req)) {
       return res.status(403).json({ message: "Forbidden: You do not have permission to perform this action" });
   }

   const product = new Product(req.body);

   try {
       const response = await product.save();
       res.json({
           message: "Product created successfully",
           product: response
       });

   } catch (error) {
       console.error("Error creating product:", error);
       return res.status(500).json({ message: "Internal server error" });
   }
}

export async function getProducts(req, res) {
    try {
        if (isAdmin(req)) {
            const products = await Product.find();
            return res.json(products);
        } else {
            const products = await Product.find({isAvailable: true});
            return res.json(products);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteProduct(req, res) {

    if (!isAdmin(req)) {
      res.status(403).json({ message: "Forbidden: You do not have permission to perform this action" });
      return;

    }

    try {
        const productId = req.params.ProductId;

        await Product.deleteOne({

            productId: productId
        })

        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export async function updateProduct(req, res) {

    if (!isAdmin(req)) {
        return res.status(403).json({ message: "Forbidden: You do not have permission to perform this action" });
    }

    const data = req.body;
    const productId = req.params.ProductId;
    data.productId = productId; // Ensure productId is set in the data ( canot change Product id)

    try {
     
        await Product.updateOne(
            {
                 productId: productId 
            },
            data
        );
        res.json({ message: "Product updated successfully" });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export async function getProductInfo(req, res) {
    try{
        const productId = req.params.productId;
        const product = await Product.findOne({productId:productId})
        
        if(product == null){
            res.status(404).json({message: "Product Not Found"})
            return;
        }

        if(isAdmin(req,res)){
            res.json(product);

        }else{
            if(product.isAvailable){
                res.json(product);
            } else {
                res.status(403).json({message: "Forbidden: You do not have permission to view this product"});
            }
        }
    }catch(error){
        console.error("Error Fetching Product Info",error)
        res.status(500).json({message:"Faild to fetch Product"})
        return;
    }
    
}