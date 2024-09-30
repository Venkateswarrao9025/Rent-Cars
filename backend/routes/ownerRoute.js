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

export default router;