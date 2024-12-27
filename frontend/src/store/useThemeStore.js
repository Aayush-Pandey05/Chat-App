import {create} from 'zustand';


export const useThemeStore = create((set)=>({
    theme: localStorage.getItem("chat-theme") || "coffee", // here we are setting the theme which is given in the local storage under the name of chat-theme and if there is no chat-theme we will give it coffee
    setTheme: (theme) =>{
        localStorage.setItem("chat-theme",theme); // this will create a section named chat-theme in the local storage and give it the value of theme 
        set({ theme });
    }
// this will help us to manipulate the theme according to our wish form the settings 
}))