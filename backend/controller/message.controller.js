import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

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

        //SOCKET HERE

        //this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()])

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const getMessage = async(req,res) => {
    try {
        const {id:userToChat} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,userToChat]}
        }).populate("messages") //nOT REFERENCING BUT ACTUAL MESSAGES

        if (!conversation) {
        res.status(200).json([]);
            
        }
        
        const messages = conversation.messages;
        res.status(200).json(messages);
        
    } catch (error) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}