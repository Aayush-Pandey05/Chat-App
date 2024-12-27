import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  // this is the controller for the signup i.e, when the user will send a post request for signup
  const { email, password, fullName } = req.body;
  try {
    // we should always use try catch block because it is a good practice and it will not break the code in case of any type of error

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All feilds are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 charecters" });
    }

    const user = await User.findOne({ email }); // now if the password is valid we will check if the email is already in use

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10); // now we are generating salt which will help us to hash the password
    // salt is basically a set of random charecters which is used to hash the password

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      // fullName: fullName,
      // email: email,
      // password: hashedPassword
      // now as the fullName and email part is the same we can write it as:-
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // if creating the user is a success
      //generating jwt token
      generateToken(newUser._id, res); // we are calling the function present in the utils.js and we are giving userId and res as input to it which will enable it to attach the jwt to the response
      await newUser.save(); // finally we will save the user to the database
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      //if the creation failed
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in the signup controller", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in the login controller", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in the logout controller", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateProfile = async (req, res) => {
  
    try {
        const { profilePic } = req.body;
        const userId = req.user._id; // we can access the user from the request because this function is only called once the user is verified by the function protectRoute

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // we are uploading the profilePic in the platform of cloudinary

        const updatedUser = await User.findByIdAndUpdate(userId,{ profilePic: uploadResponse.secure_url },{ new: true }); // we are uploading the profile pic in the database
        // to find out what new:true does hover your mouse over 'new'

        res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Error in update profile: ", error);
    res.status(500).json({message:"Internal server error"});
  }
};


export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}