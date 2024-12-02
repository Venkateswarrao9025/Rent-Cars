import express from "express";
import ownerRoute from "./routes/ownerRoute.js";
import carRoute from "./routes/carRoute.js";
import cors from 'cors';
import path from "path";
import { Car } from './models/carModel.js'; 


const __dirname = path.dirname(new URL(import.meta.url).pathname);
console.log(__dirname);


const app = express();

app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.static('uploads'));

// app.use(cors({
//     origin: 'http://localhost:5173', // Replace with your frontend's URL
//     methods: ['GET', 'POST', 'DELETE'], // Add other methods if necessary
//     allowedHeaders: ['Content-Type'],
//   }));

// app.use('/uploads', (req, res, next) => {
//     console.log(`Requesting image: ${req.url}`);
//     next();
//   });

// app.use('/uploads', (req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (can be restricted to your frontend origin)
//     next();
//   });

app.get('/', (req, res) => {
    // return res.status(200).send('Hello World!')
    res.sendStatus(200);
});

app.use('/owner', ownerRoute);
app.use('/car', carRoute);

app.get("/car/image/:id", async(req, res) => {
    const {id} = req.params;
    try {
        const car = await Car.findById(id);
        const imPath = path.join('uploads', car.image);
        console.log(imPath);
        
        // res.sendFile(imPath);
        res.sendFile(car.image, { root: 'F:/SE-Project/backend/uploads/' });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/cars/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cars = await Car.find({ owner: userId });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars' });
    }
});

app.put('/cars/:carId', async (req, res) => {
    const { carId } = req.params;
    const { price, available } = req.body;
    console.log('Request body:', req.body);
    try {
        const updatedCar = await Car.findByIdAndUpdate(
            carId,
            { price, available },
            { new: true }
        );
        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ message: 'Error updating car' });
    }
});

export default app;