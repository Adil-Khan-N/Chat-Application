import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
// import { getRecieverSocketId } from "../socket/socket.js";

export const sendMessage = async(req,res) =>{
    try {


        const {message} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user._id.toString();

        let conversation =  await Conversation.findOne({
            participants:{$all: [senderId,recieverId]},
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId,recieverId]
            })
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        // await conversation.save()
        // await newMessage.save()
        //this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()])

        //SOCKET HERE
        // const recieverSocketId = getRecieverSocketId(recieverId);
        // if(recieverSocketId){
        //     //io.to is used to send events to specific clients
        //     io.to(recieverSocketId).emit("newMessage",newMessage);
        // }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({error:"... Internal Server Error"})
    }
}
export const getMessage = async (req, res) => {
    try {
        const { id: userToChat } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChat] }
        }).populate("messages"); // Not referencing but actual messages

        // Check if conversation is found
        if (!conversation) {
            return res.status(200).json([]); // Exit here to prevent further execution
        }

        // Safe to access messages now
        const messages = conversation.messages;
        return res.status(200).json(messages); // Return messages

    } catch (error) {
        console.log("Error in getMessage controller", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
