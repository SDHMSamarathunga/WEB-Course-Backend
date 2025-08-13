import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; //Authentication library


export function createUser(req,res){

    //Password Hashing
    const passwordHash = bcrypt.hashSync(req.body.password, 10);


    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash,
        
    }
    // Create a new user / save User
    const user = new User(userData)

    user.save().then(
        ()=> {
            res.json({
                message: "User created successfully"
                
            })
        }
    ).catch(
        ()=> {
            res.json({
                message: "User creation failed"
            })
        }
    )
}

//Login Function and Authentication
export function loginUser(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then(
        (user) => {
            if (user) {
                if (user == null) {
                    res.status(404).json({ message: "User not found" });
                } else {
                    // Compare the password with the hashed password
                    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
                    if( isPasswordCorrect) {
                        // Generate JWT token
                        const token = jwt.sign(
                            {
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                                isBlocked: user.isBlocked,
                                isEmailVerified: user.isEmailVerified,
                                image : user.image

                            },
                            "harsh-404" // Secret key for signing the token
                        );
                        res.json({
                            token: token,
                            message: "Login successful"
                    
                        });
                    } else {
                        res.status(403).json({ message: "Invalid password" });
                    }
                }
            }
        }
    )
    
}

export function isAdmin(req) {
    
    if (req.user == null) {
        return false;
    }
    if (req.user.role === "admin") {
        return true;
    }
     else {
        return false;
    }
}