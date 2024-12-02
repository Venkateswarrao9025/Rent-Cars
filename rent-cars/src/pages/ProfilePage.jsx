import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { user } = useContext(UserContext);
    const [cars, setCars] = useState([]);
    const [isEditing, setIsEditing] = useState(null); // Tracks the car being edited
    const [editData, setEditData] = useState({ price: '', available: '' });

    useEffect(() => {
        if (user) {
            // Fetch user's cars
            axios
                .get(`http://localhost:5555/cars/user/${user._id}`)
                .then((response) => setCars(response.data))
                .catch((error) => console.error('Error fetching cars:', error));
        }
    }, [user]);

    const handleEditClick = (car) => {
        setIsEditing(car._id);
        setEditData({ price: car.price, available: car.available });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = (carId) => {
        axios
            .put(`http://localhost:5555/cars/${carId}`, editData)
            .then((response) => {
                // Update the car in the list
                setCars((prevCars) =>
                    prevCars.map((car) =>
                        car._id === carId ? { ...car, ...editData } : car
                    )
                );
                setIsEditing(null);
            })
            .catch((error) => console.error('Error updating car:', error));
    };

    const handleCancelClick = () => {
        setIsEditing(null);
        setEditData({ price: '', available: '' });
    };

    return (
        <div>
            <h1 className="text-center p-2">Profile Page</h1>
            <div className="mx-auto p-2" style={{ width: "50%" }}>
                {user ? (
                    <div>
                        <div>
                            <h3>Welcome, {user.fname} {user.lname}!</h3>
                            <p><strong>User ID:</strong> {user._id}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                            <Link to="/car/newcar" className="btn btn-primary me-3">
                                Register a New Car
                            </Link>
                            <Link to="/owner/notifications" className="btn btn-primary">
                                Notifications
                            </Link>
                        </div>
                        <div>
                            <br /><br />
                            <h3>Your Cars</h3>
                            {cars.length > 0 ? (
                                <ul className="list-group">
                                    {cars.map((car) => (
                                        <li
                                            key={car._id}
                                            className="list-group-item d-flex justify-content-between align-items-center mb-2"
                                        >
                                            <div>
                                                <p><strong>Brand:</strong> {car.brand}</p>
                                                <p><strong>Model:</strong> {car.model}</p>
                                                <p><strong>Year:</strong> {car.year}</p>
                                                <p><strong>Price:</strong> ${car.price}</p>
                                                <p><strong>Available:</strong> {car.available}</p>
                                            </div>
                                            {isEditing === car._id ? (
                                                <div>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={editData.price}
                                                        onChange={handleInputChange}
                                                        placeholder="Price"
                                                        className="form-control mb-2"
                                                    />
                                                    <select
                                                        name="available"
                                                        value={editData.available}
                                                        onChange={handleInputChange}
                                                        className="form-control mb-2"
                                                    >
                                                        <option value="">Select Availability</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="No">No</option>
                                                    </select>
                                                    <button
                                                        className="btn btn-success me-2"
                                                        onClick={() => handleSaveClick(car._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={handleCancelClick}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleEditClick(car)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                    <br /><br />
                                </ul>
                            ) : (
                                <p>You have no registered cars.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-center">User not logged in.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
