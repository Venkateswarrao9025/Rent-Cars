import React, { createContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { connectSocket, disconnectSocket } from '../services/socket';

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
    // Initialize state with data from localStorage (if available)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef(null);

    // Effect to save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Live booking notifications: connect once an owner is logged in, tear down on logout
    useEffect(() => {
        if (!user) {
            disconnectSocket();
            socketRef.current = null;
            return;
        }

        const socket = connectSocket();
        socketRef.current = socket;

        const handleBooking = (notification) => {
            setUnreadCount((count) => count + 1);
            toast.info(`New booking request for ${notification.car?.brand} ${notification.car?.model}`);
        };

        socket?.on('booking:new', handleBooking);

        return () => {
            socket?.off('booking:new', handleBooking);
        };
    }, [user]);

    // Call after a successful login/registration to store the owner and their JWT together
    const login = (owner, token) => {
        localStorage.setItem('token', token);
        setUser(owner);
    };

    // Clears both the owner and the JWT
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setUnreadCount(0);
    };

    const clearUnread = () => setUnreadCount(0);

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, unreadCount, clearUnread }}>
            {children}
        </UserContext.Provider>
    );
};
