import express from "express";
import { Owner } from '../models/ownerModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const owners = await Owner.find({});
        return res.status(200).json(owners);
    } catch (error) {
        console.log(error.message);
        console.log('error fetching'); 
        res.status(500).send({message: error.message})
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
        res.status(500).send({message: error.message})
    }
});

router.get('/login', async (req, res) => {
    try {
        res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
        console.log('error fetching'); 
        res.status(500).send({message: error.message})
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

        if ( owner.password !== password) {
            console.log("Invalid password")
            return res.status(401).json({ message: "Invalid password" });
        }

        return res.status(200).json({ message: "Login successful", owner });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;