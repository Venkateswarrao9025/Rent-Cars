import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const RegisterOwner = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const handleRegister = (event) => {

        event.preventDefault();
        let hasError = false;
        const newErrors = {};

        if (!fname) {
            hasError = true;
            newErrors.fname = "First name is required";
        }

        if (!lname) {
            hasError = true;
            newErrors.lname = "Last name is required";
        }

        if (!email) {
            hasError = true;
            newErrors.email = "Email is required";
        }

        if (!phone) {
            hasError = true;
            newErrors.phone = "Phone number is required";
        }

        if (!password) {
            hasError = true;
            newErrors.password = "Password is required";
        }

        setErrors(newErrors); 

        if (!hasError) {

            const data = {
                fname,
                lname,
                email,
                phone,
                password
            }
            console.log(data);

            setLoading(true);
            axios
                .post('http://localhost:5555/owner', data)
                .then(() => {
                    setLoading(false);
                    navigate('/owner');
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    alert('Error')
                })
        }
    }

    return (
        <div>
            <h1 className='mb-10 text-center p-2'>Register</h1>
            {loading ? <Loader /> : ''}
            <div className='mx-auto p-2' style={{ width: "50%" }}>
                <label className='form-label'>Fname</label>
                <input
                    type="text"
                    className='form-control mb-3'
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                />
                {errors.fname && <p className="text-danger">{errors.fname}</p>}
                <label className='form-label'>Lname</label>
                <input
                    type="text"
                    value={lname}
                    className='form-control mb-3'
                    onChange={(e) => setLname(e.target.value)}
                />
                {errors.lname && <p className="text-danger">{errors.lname}</p>}
                <label className='form-label'>Email</label>
                <input
                    type="text"
                    value={email}
                    className='form-control mb-3'
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
                <label className='form-label'>Phone</label>
                <input
                    type="text"
                    value={phone}
                    className='form-control mb-3'
                    onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <p className="text-danger">{errors.phone}</p>}
                <label className='form-label'>Password</label>
                <input
                    type="password"
                    value={password}
                    className='form-control mb-3'
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-danger">{errors.password}</p>}
                <button className='btn btn-primary btn-lg' onClick={handleRegister}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default RegisterOwner;