import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get)=>({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () =>{
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isUserLoading: false});
        }
    },

    getMessages : async (userId) =>{
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        
        // Validate selected user
        if (!selectedUser?._id) {
            throw new Error("No user selected for sending message");
        }

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            
            // Check if response and response.data exist
            if (res?.data) {
                // Ensure messages is an array before spreading
                const currentMessages = Array.isArray(messages) ? messages : [];
                set({ messages: [...currentMessages, res.data] });
                return res.data;
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to send message";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },
    
    subscribeToMessages: () =>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage)=>{

            if(newMessage.senderId !== selectedUser._id) return; // this way other ppl eoul not be able to see the messages 

            set({
                messages: [...get().messages, newMessage],
            })
        })
    },

    unsubscribeFromMessage: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser : (selectedUser) => set({selectedUser}),
}))