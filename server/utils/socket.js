import { Server } from "socket.io";

const userSocketMap = {};

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: [process.env.FRONTEND_URL],
            methods: ["GET", "POST"],
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected to the server", socket.id);

        const userId = socket.handshake.query.userId;
        if (userId) userSocketMap[userId] = socket.id;

        // Emit online users to all clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
            if (userId) {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export { io };