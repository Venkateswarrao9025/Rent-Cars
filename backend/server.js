import http from 'http';
import app from './index.js'
import { PORT, mongodbURL } from "./config.js";
import mongoose from "mongoose";
import { initSocket } from "./socket.js";

const httpServer = http.createServer(app);
initSocket(httpServer);

mongoose
    .connect(mongodbURL)
    .then(() => {
        console.log('App connected to Database');
        httpServer.listen(PORT, () => {
            console.log(`App listening to PORT ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    })
