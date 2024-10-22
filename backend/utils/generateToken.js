import jwt from "jsonwebtoken";

const generateTokenAndsetToken = (userId, res) =>{
    const token = jwt.sign({userid:userId.toString()},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })

    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, //To prevent cross site scripting attacks
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development",
    })
}

export default generateTokenAndsetToken;