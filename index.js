import express from 'express'; // Importing express module
import mongoose from 'mongoose'; // Importing mongoose for MongoDB connection
import bodyParser from 'body-parser'; // Importing body-parser module
import userRouter from './routers/userRouter.js'; // Importing userRouter
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for authentication
import productRouter from './routers/productRouter.js';
import dotenv from "dotenv"; // Importing dotenv for environment variables

dotenv.config(); // Load environment variables from .env file

let app = express(); // Creating an instance of express

app.use(bodyParser.json()); // Middleware to parse JSON bodies

//Create own middleware
app.use(
    (req, res, next) => {
        
        const value = req.header("Authorization"); 
        if(value != null){
            const token = value.replace("Bearer ",""); // Extracting token from Authorization header
            jwt.verify(
                token, 
                "harsh-404",
                (err, decoded) => {
                    if(decoded == null){
                        res.status(403).json({
                            message: "Unauthorized access, please login again"
                        })
                    } else{
                        req.user = decoded; // Attaching decoded user information to the request object
                        next(); // Proceed to the next middleware or route handler
                    }
                    
                }
            ) // Verifying the token
        }else{
              next();
        }    

    }
)

const connectionString = process.env.MONGO_URI;

// Connect to MongoDB using mongoose
mongoose.connect(connectionString).then(
    () => {
          console.log("MongoDB is connected..");
  }).catch(
    () => {
    console.log("MongoDB connection failed");
});



//Create User Router
app.use("/users", userRouter);
app.use("/products", productRouter); // Use productRouter for /products endpoint



app.put('/',        
    (req , res) => {
    res.json({
        message: "This is put request"
    });
    console.log("PUT request received");
});

app.delete('/', 
    (req , res) => {
   res.json({
       message: "This is delete request"
   });
    console.log("DELETE request received"); 
});


app.listen(5000,
    (req , res) => {
        console.log("Server is Started.. ");
    }
);