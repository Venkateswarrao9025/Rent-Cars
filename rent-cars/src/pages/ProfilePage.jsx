import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

const Profile = () => { 
    const { user } = useContext(UserContext);

    return (
        <div>
            <h1 className='text-center p-2'>Profile Page</h1>
            <div className='mx-auto p-2' style={{ width: "50%" }}>
                {user ? (
                    <div>
                        <h3>Welcome, {user.fname} {user.lname}!</h3>
                        <p><strong>User ID:</strong> {user._id}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <Link to="/car/newcar" className="btn btn-primary">
                            Register a New Car
                        </Link>
                    </div>
                ) : (
                    <p className='text-center'>User not logged in.</p>
                )}
            </div>
        </div>
    )
}

export default Profile;