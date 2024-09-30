import express from "express";
import mongoose from "mongoose";
import { PORT, mongodbURL } from "./config.js";
import { Owner } from "./models/ownerModel.js";
import ownerRoute from "./routes/ownerRoute.js";
import cors from 'cors';

const app = express();

app.use(express.json())

app.use(cors());

app.get('/', (req, res) => {
    // return res.status(200).send('Hello World!')
    res.sendStatus(200);
});

app.use('/owner', ownerRoute)

// mongoose
//     .connect(mongodbURL)
//     .then(() => {
//         console.log('App connected to Database');
//         app.listen(PORT, () => {
//             console.log(`App listening to PORT ${PORT}`);
//         })
//     })
//     .catch((error) => {
//         console.log(error);
//     })

export default app;