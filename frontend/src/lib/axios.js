import axios from "axios"; // we will be using axios in place of fetch api because it makes things a lot easier

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true, // this will send the cookies in every single request which will carry our jwt
    timeout: 30000,
})

