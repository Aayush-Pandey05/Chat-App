import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"; // this will help us to grab the token from the cookie 
import cors from 'cors';
import { app , server} from "./lib/socket.js";
import path from "path"; 



dotenv.config()

const __dirname = path.resolve();

app.use(express.json()); // this is necessary to extract the json from the request body
app.use(cookieParser()); // this will allow us to parse the cookie and extract the token from it 
app.use(cors({
    origin: "http://localhost:5173", // this is necessary because we are sending request from the frontend server to the backend server 
    credentials: true // using this the cookies and authorization headers would be sent in the request 
}))

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(process.env.PORT,()=>{
    console.log("Server is running on port 5001");
    connectDB()
});