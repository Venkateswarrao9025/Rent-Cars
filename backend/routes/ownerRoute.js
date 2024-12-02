import express from "express";
import { Owner } from '../models/ownerModel.js';
import { Car } from '../models/carModel.js';
import { Notification } from '../models/notificationModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const owners = await Owner.find({});
        return res.status(200).json(owners);
    } catch (error) {
        console.log(error.message);
        console.log('error fetching');
        res.status(500).send({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        console.log('Post owner');

        const newOwner = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        }
        console.log(newOwner);

        const owner = await Owner.create(newOwner);
        res.status(201).json({ message: "Registration successful. Please Login", owner });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
});

router.get('/login', async (req, res) => {
    try {
        res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
        console.log('error fetching');
        res.status(500).send({ message: error.message })
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const owner = await Owner.findOne({ email });
        console.log(owner);

        if (!owner) {
            console.log("Invalid Email");
            return res.status(404).json({ message: "Invalid email" });
        }

        if (owner.password !== password) {
            console.log("Invalid password")
            return res.status(401).json({ message: "Invalid password" });
        }

        return res.status(200).json({ message: "Login successful", owner });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.post('/requestBooking', async (req, res) => {
    const { carId, message } = req.body;

    try {
        const car = await Car.findById(carId).populate('owner');

        if (!car) {
            return res.status(404).json({ message: "Car not found." });
        }

        const notification = await Notification.create({
            car: carId,
            owner: car.owner,
        });

        res.status(201).json({
            message: "Booking request sent.", 
            ownerDetails: {
                name: `${car.owner.fname} ${car.owner.lname}`,
                phone: car.owner.phone,
                email: car.owner.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create booking request." });
    }
});

// Fetch notifications for a specific owner
router.get('/notifications/:ownerId', async (req, res) => {
    const { ownerId } = req.params;

    try {
        const notifications = await Notification.find({ owner: ownerId }).populate('car');
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch notifications." });
    }
});

// Update notification status (Accept/Reject)
router.put('/notification/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const notification = await Notification.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        res.json({ message: "Notification status updated.", notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update notification." });
    }
});

// Delete notification
router.delete('/notification/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Notification.findByIdAndDelete(id);
        res.json({ message: "Notification deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete notification." });
    }
});


export default router;