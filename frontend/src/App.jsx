import React, { useEffect } from 'react'
import Navbar from './Components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import {Toaster} from "react-hot-toast"; // we will be using this to style the notifications..... basically alerts but better

import { Loader } from 'lucide-react' // this react package is used for icons

const App = () => {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore() // useAuthStore is created with zustand because it makes it easier for us to manage the states of various components
  // this helps us to avoid the use of multiple useStates

  console.log("online users:- ",{onlineUsers});

  const {theme} = useThemeStore(); // this will help us to change the theme of the entire application

  useEffect(()=>{ // we will check if the user is logged in or not and animate the loading screen accordingly
    checkAuth();
  },[checkAuth]);

  console.log({ authUser });

  if(isCheckingAuth && !authUser){
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader className= "size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}> {/* this is how we can set the theme for all of the application and it will change as the state of the theme cahnges */}
      <Navbar/>
      <Routes>
        <Route
          path = "/"
          element = {authUser? <HomePage/>: <Navigate to='/login'/>}
        />
        <Route
          path = "/login"
          element = {!authUser? <LoginPage/>: <Navigate to="/"/>}
        />
        <Route
          path = "/profile"
          element = {authUser? <ProfilePage/>: <Navigate to='/login'/>}
        />
        <Route
          path = "/settings"
          element = {<SettingsPage/>}
        />
        <Route
          path = "/signup"
          element = {!authUser? <SignupPage/>: <Navigate to="/"/>}
        />
      </Routes>

      <Toaster /> {/* its necessary to put this in to the root component of our peoject if we want to use the react-hot-toast */}
    </div>
  )
}

export default App