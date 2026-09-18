import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Car } from '../models/carModel.js';
import { cloudinaryConfig } from '../config.js';
import { requireAuth } from '../middleware/auth.js';
import { parseSearchQuery } from '../services/aiSearch.js';

const router = express.Router();

const cloudinaryEnabled = Boolean(
    cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret
);

let storage;

if (cloudinaryEnabled) {
    cloudinary.config(cloudinaryConfig);
    storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'rent-cars',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
    });
} else {
    console.warn('Cloudinary is not configured — falling back to local disk storage for uploads.');
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });
}

const upload = multer({ storage });

router.post('/newcar', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const imagePath = cloudinaryEnabled ? req.file.path : req.file.filename;

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
            image: imagePath,
            owner: req.owner.id,
        };

        const car = await Car.create(newCar);
        res.status(201).json({ message: "Car registered successfully", car });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

const buildCarQuery = ({ make, price, from, to }) => {
    const query = {};
    if (make) query.brand = make;
    if (price) query.price = { $lte: price };
    if (from || to) query.mileage = { $gte: from || 0, $lte: to || 999999999 };
    return query;
};

// GET /api/cars
router.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find(buildCarQuery(req.query));
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /car/search/ai — turns a free-text query into the same filter shape as GET /cars
router.post("/search/ai", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "A search query string is required." });
  }

  try {
    const filters = await parseSearchQuery(query);
    const cars = await Car.find(buildCarQuery(filters));
    res.status(200).json({ filters, cars });
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
});

export default router;
