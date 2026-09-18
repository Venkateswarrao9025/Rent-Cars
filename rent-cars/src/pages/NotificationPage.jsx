import api from "../services/api";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getSocket } from "../services/socket";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Notifications = () => {
    const { user, clearUnread } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await api.get(`/owner/notifications/${user._id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            alert("Error fetching notifications.");
        }
    };

    useEffect(() => {
        if (user && user._id) {
            fetchNotifications();
            clearUnread();
        }
    }, [user]);

    // Prepend bookings that arrive live while this page is open
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleBooking = (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            clearUnread();
        };

        socket.on('booking:new', handleBooking);
        return () => socket.off('booking:new', handleBooking);
    }, []);

    const handleResponse = async (id, status) => {
        try {
            await api.put(`/owner/notification/${id}`, { status });
            alert(`Booking ${status}.`);
            fetchNotifications(); // Refresh notifications after status update
        } catch (error) {
            console.error("Failed to update booking status:", error);
            alert("Failed to update booking status.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/owner/notification/${id}`);
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
