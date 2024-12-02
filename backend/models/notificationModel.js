import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner', 
        required: true,
    },
    status: {
        type: String,
        default: 'Pending', // Possible values: Pending, Accepted, Rejected
    }
});

export const Notification = mongoose.model('Notification', notificationSchema);
