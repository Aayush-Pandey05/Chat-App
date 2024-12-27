import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id; // we will get this because of protectRoute middleware
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        // this will find the users except for the user that is logged in( like we can see contacts of others but not ourselfs ) 
        // {$ne: loggedInUserId}:- here $ne stands for not equals to
        // select("-password"):- this will get us all the parameters of the users except for the password 
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({message:"Internal server error"});
    }
} // this is controller function to get all the contacts in the sidebar

export const getMessages = async (req,res)=>{

    try {
        const {id: userToChatId } = req.params // this way we can grab the route parameter from the request
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[ // this is how we implement or condition
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        })

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in the getMessages controller: ", error.message);
        res.status(500).json({message:"Internal server error"});
    }
} // this will get the messages between me and anyone

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!receiverId || !senderId) {
            return res.status(400).json({ 
                message: "Sender and receiver information is required" 
            });
        }

        let imageURL;
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageURL = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ 
                    message: "Failed to upload image" 
                });
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });

        await newMessage.save();

        // Real time message sending and receiving:- 
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage); // we are sending the message in real time with the event newMessage and only to the receiverId
        }

        return res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        return res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
}