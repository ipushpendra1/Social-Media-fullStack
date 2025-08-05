import app from "./src/app.js"
import connectDB from "./src/db/db.js"
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
    console.log("a user connected");


    socket.on("disconnect", () => {
        console.log("a user disconnected");
      });
  });

  







connectDB();

httpServer.listen(3000,()=>{
    console.log("server is running on port 3000");
    
})
