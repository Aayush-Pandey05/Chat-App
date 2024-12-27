import {create} from "zustand"; // zustand is our global state manager 
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

export const useAuthStore = create((set, get) =>({
    authUser: null, // initially the user would not be logged in
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,


    isCheckingAuth: true, // this is for the loading 

    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get("/auth/check"); // now this will send the get reques to the backend and we are not using fetch api
            // this basically checks if the user is logged in or not 

            set({ authUser: res.data }); // now this is the use of zustand i.e, it sets the state adn manages it 
            get().connectSocket();

        } catch (error) {
            console.log("Error in checkAuth: ",error);
            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) =>{
        set({isSigningUp: true});

        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message); // now this will grab the error message that we are giving fro the backend 
        }
        finally{
            set({isSigningUp: false});
        }
    },

    login: async (data) =>{
        set({isLoggingIn: true})

        try {
            const res = await axiosInstance.post("/auth/login", data); // here data will contain email and password
            set({authUser: res.data});
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);// now this will grab the error message that we are giving fro the backend 
        }
        finally{
            set({isLoggingIn: false});
        }
    },

    logout: async ()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data)=>{
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile: ",error);
            toast.error(error.response.data.message);
        }
        finally{
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: () =>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return; // if the user is not authenticated or it is already connected then we don't need to create another connection

        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id, // we are passing this as query because we need it in socket.js in backend
            }
        });
        socket.connect();

        socket.on("getOnlineUsers", (userIds)=>{ //socket.on is used for listening real time events
            set({onlineUsers: userIds});
        })

        set({ socket: socket});
    },

    disconnectSocket: () =>{
        if(get().socket?.connected) get().socket.disconnect(); // we will only try to disconnect if the user is connected 

    },
    
}))