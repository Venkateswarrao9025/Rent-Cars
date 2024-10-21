import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const {setUser} = useContext(UserContext);

    const successMessage = location.state?.message || '';

    const handleLogin = (event) => {

        event.preventDefault();
        let hasError = false;
        const newErrors = {};


        if (!email) {
            hasError = true;
            newErrors.email = "Email is required";
        }


        if (!password) {
            hasError = true;
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        if (!hasError) {

            const data = {
                email,
                password
            }
            console.log(data);

            setLoading(true);
            axios
                .post('http://localhost:5555/owner/login', data)
                .then((response) => {
                    setLoading(false);
                    const user = response.data.owner; 
                    setUser(user);
                    navigate('/owner/profile');
                })
                .catch((error) => {
                    setLoading(false);
                    if (error.response && error.response.data) {
                        setError(error.response.data.message);
                    } else {
                        setError('An unexpected error occurred. Please try again.');
                    }
                });
        }
    }

    return (
        <div>
            <h1 className='mb-10 text-center p-2'>Login</h1>
            {loading ? <Loader /> : ''}
            {successMessage && <p style={{ color: 'green', textAlign: 'center' }} className='mx-auto p-2'>{successMessage}</p>}
            {/* Display error message if any */}
            {error && <p style={{ color: 'red', textAlign: 'center' }} className='mx-auto p-2'>{error}</p>}
            <div className='mx-auto p-2' style={{ width: "50%" }}>

                <label className='form-label'>Email</label>
                <input
                    type="email"
                    value={email}
                    className='form-control mb-3'
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}

                <label className='form-label'>Password</label>
                <input
                    type="password"
                    value={password}
                    className='form-control mb-3'
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-danger">{errors.password}</p>}

                <button className='btn btn-primary btn-lg' onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    )
}

export default Login;