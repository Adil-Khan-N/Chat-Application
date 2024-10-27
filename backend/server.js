//"type":"module", in package.json for using import

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connecttoMongo from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";

dotenv.config();
// const app = express();
const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    //root route http://localhost:5000
    res.send("HEllo World")
})

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/users",userRoutes)

server.listen(PORT,()=>{
    connecttoMongo();
    console.log(`Server is running at port ${PORT}`)
}
)