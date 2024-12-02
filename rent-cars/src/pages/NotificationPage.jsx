import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Notifications = () => {
    const { user } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:5555/owner/notifications/${user._id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            alert("Error fetching notifications.");
        }
    };

    useEffect(() => {
        if (user && user._id) {
            fetchNotifications();
        }
    }, [user]);

    const handleResponse = async (id, status) => {
        try {
            await axios.put(`http://localhost:5555/owner/notification/${id}`, { status });
            alert(`Booking ${status}.`);
            fetchNotifications(); // Refresh notifications after status update
        } catch (error) {
            console.error("Failed to update booking status:", error);
            alert("Failed to update booking status.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5555/owner/notification/${id}`);
            alert("Notification deleted.");
            fetchNotifications(); // Refresh notifications after deletion
        } catch (error) {
            console.error("Failed to delete notification:", error);
            alert("Failed to delete notification.");
        }
    };

    return (
        <div className="container">
            <br />
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications available.</p>
            ) : (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification._id}>
                            <br />
                            <p>
                                Booking request for: {notification.car.brand} {notification.car.model}
                            </p>
                            <p>Status: {notification.status}</p>
                            <button
                                className="btn btn-success mx-1"
                                onClick={() => handleResponse(notification._id, "Accepted")}
                            >
                                Accept
                            </button>
                            <button
                                className="btn btn-danger mx-1"
                                onClick={() => handleResponse(notification._id, "Rejected")}
                            >
                                Reject
                            </button>
                            <button
                                className="btn btn-secondary mx-1"
                                onClick={() => handleDelete(notification._id)}
                            >
                                Delete
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
