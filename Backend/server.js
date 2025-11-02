
import app from "./src/app.js"
import connectDB from "./src/db/db.js"
import { createServer } from "http";
import setupSocket from "./src/sockets/socket.js";


const httpServer = createServer(app);


setupSocket(httpServer);
connectDB()

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!\n`);
        console.log(`To fix this, you can:`);
        console.log(`1. Find and kill the process using port ${PORT}:`);
        console.log(`   Windows: netstat -ano | findstr :${PORT}`);
        console.log(`   Then: taskkill /PID <PID> /F`);
        console.log(`\n2. Or use a different port by setting PORT in your .env file`);
        process.exit(1);
    } else {
        throw err;
    }
})
