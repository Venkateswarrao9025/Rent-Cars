import express from 'express';
import multer from 'multer';
import path from 'path';
import { Car } from '../models/carModel.js'; 

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save the file
    },
    filename: (req, file, cb) => {
        // Using original name and add timestamp to avoid name clashes
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Combine name with extension
    }
});

const upload = multer({ storage: storage });

router.post('/newcar', upload.single('image'), async (req, res) => {
    try {
        const newCar = {
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            type: req.body.type,
            price: req.body.price,
            mileage: req.body.mileage,
            engineSize: req.body.engineSize,
            fuelConsumption: req.body.fuelConsumption,
            description: req.body.description,
            image: req.file.path, 
            owner: req.body.owner
        };

        const car = await Car.create(newCar);
        res.status(201).json({ message: "Car registered successfully", car });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;