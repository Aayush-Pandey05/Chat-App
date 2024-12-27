import jwt from "jsonwebtoken"


export const generateToken = (userId, res) => {


    const token = jwt.sign({userId}, process.env.SECRET, {expiresIn: "7d"}); // here while creating the token we passed in the userId as payload because it will help to segregate which token belongs to which user 

    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, // this 7 days expressed in millisecs
        httpOnly: true, // prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development" // it will be accessed in the http(not secure only untill process.env.NODE_ENV !== "development")
    })// we are sending the jwt to the browser using cookie

    return token;
    
}