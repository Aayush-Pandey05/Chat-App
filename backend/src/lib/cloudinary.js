import {v2 as cloudinary} from "cloudinary"; // we will be using cloudinary to udate the profile pic
import {config} from "dotenv";

config() // we did this to be able to access the environment variables 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary;