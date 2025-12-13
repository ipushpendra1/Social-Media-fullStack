import { Server } from "socket.io";
import cookie from "cookie"
import jwt from "jsonwebtoken";
import { createMessage } from "../dao/message.dao.js";

const users = {}

function setupSocket(server) { // http server

    const io = new Server(server, {})


    io.use((socket, next) => {
        const cookies = socket.request.headers.cookie
        const { token } = cookie.parse(cookies  || "")
        if (!token) {
            return next(new Error("Authentication error"))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error("Authentication error"))
        }
    })

    io.on("connection", (socket) => {

        users[ socket.user._id ] = socket.id
        console.log(users)
        
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });

        socket.on("message", async (msg) => {
            try {
                const { receiver /* mongodb id */, message } = msg
                
                if (!receiver || !message) {
                    socket.emit("error", { message: "Invalid message format" })
                    return
                }
                
                socket.to(users[ receiver ]).emit("message", message)
                await createMessage({
                    receiver,
                    sender:socket.user._id,
                    text:message
                })
            } catch (error) {
                console.error('Error handling socket message:', error)
                socket.emit("error", { message: "Failed to send message" })
            }
        })

        // Add more event listeners as needed
    });







}

export default setupSocket;