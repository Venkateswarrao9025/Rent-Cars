import app from './index.js'
import { PORT, mongodbURL } from "./config.js";
import mongoose from "mongoose";

// app.listen(8080, () => console.log("listening on port 8080"))

mongoose
    .connect(mongodbURL)
    .then(() => {
        console.log('App connected to Database');
        app.listen(PORT, () => {
            console.log(`App listening to PORT ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    })