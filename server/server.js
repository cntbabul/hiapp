import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import { dbConnection } from "./database/db.js";
import { initSocket } from "./utils/socket.js";
import http from "http";
import { Server } from "socket.io";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = http.createServer(app);
initSocket(server);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  dbConnection();
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV}`);
});
export default server;