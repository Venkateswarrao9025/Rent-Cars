import express from "express";
import ownerRoute from "./routes/ownerRoute.js";
import carRoute from "./routes/carRoute.js";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import { Car } from './models/carModel.js';
import { requireAuth } from './middleware/auth.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();

app.use(express.json());

// FRONTEND_URL restricts CORS to the deployed frontend in production; unset in dev allows any origin.
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : {}));
app.use(express.static('uploads'));

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
        
        res.sendFile(car.image, { root: path.join(__dirname, 'uploads') });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/cars/user/:userId', requireAuth, async (req, res) => {
    const { userId } = req.params;

    if (req.owner.id !== userId) {
        return res.status(403).json({ message: 'Not authorized to view these cars.' });
    }

    try {
        const cars = await Car.find({ owner: userId });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars' });
    }
});

app.put('/cars/:carId', requireAuth, async (req, res) => {
    const { carId } = req.params;
    const { price, available } = req.body;
    try {
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        if (car.owner.toString() !== req.owner.id) {
            return res.status(403).json({ message: 'Not authorized to update this car.' });
        }

        car.price = price;
        car.available = available;
        await car.save();

        res.json(car);
    } catch (error) {
        res.status(500).json({ message: 'Error updating car' });
    }
});

export default app;