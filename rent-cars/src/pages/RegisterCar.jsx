import React, { useState, useContext } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from '../context/UserContext';

const RegisterCar = () => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [mileage, setMileage] = useState('');
    const [engineSize, setEngineSize] = useState('');
    const [fuelConsumption, setFuelConsumption] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const handleImageChange = (event) => {
        setImage(event.target.files[0]); // Set the selected file
    };

    const handleRegister = (event) => {
        event.preventDefault();
        let hasError = false;
        const newErrors = {};

        // Validation checks
        if (!brand) {
            hasError = true;
            newErrors.brand = "Brand is required";
        }
        if (!model) {
            hasError = true;
            newErrors.model = "Model is required";
        }
        if (!year) {
            hasError = true;
            newErrors.year = "Year is required";
        }
        if (!price) {
            hasError = true;
            newErrors.price = "Price is required";
        }
        if (!mileage) {
            hasError = true;
            newErrors.mileage = "Mileage is required";
        }
        if (!engineSize) {
            hasError = true;
            newErrors.engineSize = "Engine size is required";
        }
        if (!fuelConsumption) {
            hasError = true;
            newErrors.fuelConsumption = "Fuel consumption is required";
        }
        if (!image) {
            hasError = true;
            newErrors.image = "Image is required";
        }

        setErrors(newErrors);

        if (!hasError) {
            const formData = new FormData();
            formData.append('brand', brand);
            formData.append('model', model);
            formData.append('year', year);
            formData.append('type', type);
            formData.append('price', price);
            formData.append('mileage', mileage);
            formData.append('engineSize', engineSize);
            formData.append('fuelConsumption', fuelConsumption);
            formData.append('description', description);
            formData.append('image', image);
            formData.append('owner', user._id)

            setLoading(true);
            axios
                .post('http://localhost:5555/car/newcar', formData)
                .then(() => {
                    setLoading(false);
                    navigate('/car/profile', { state: { message: 'Car registered successfully!' } });
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    alert('Error registering car');
                });
        }
    };

    return (
        <div>
            <h1 className='mb-10 text-center p-2'>Register Car</h1>
            {loading ? <Loader /> : ''}
            {user ? (
                <div className='mx-auto p-2' style={{ width: "50%" }}>
                    <label className='form-label'>Brand</label>
                    <input
                        type="text"
                        value={brand}
                        className='form-control mb-3'
                        onChange={(e) => setBrand(e.target.value)}
                    />
                    {errors.brand && <p className="text-danger">{errors.brand}</p>}

                    <label className='form-label'>Model</label>
                    <input
                        type="text"
                        value={model}
                        className='form-control mb-3'
                        onChange={(e) => setModel(e.target.value)}
                    />
                    {errors.model && <p className="text-danger">{errors.model}</p>}

                    <label className='form-label'>Year</label>
                    <input
                        type="number"
                        value={year}
                        className='form-control mb-3'
                        onChange={(e) => setYear(e.target.value)}
                    />
                    {errors.year && <p className="text-danger">{errors.year}</p>}

                    <label className='form-label'>Type</label>
                    <select
                        value={type}
                        className='form-control mb-3'
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Select Type</option>
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                    </select>

                    <label className='form-label'>Price</label>
                    <input
                        type="number"
                        value={price}
                        className='form-control mb-3'
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {errors.price && <p className="text-danger">{errors.price}</p>}

                    <label className='form-label'>Mileage</label>
                    <input
                        type="number"
                        value={mileage}
                        className='form-control mb-3'
                        onChange={(e) => setMileage(e.target.value)}
                    />
                    {errors.mileage && <p className="text-danger">{errors.mileage}</p>}

                    <label className='form-label'>Engine Size</label>
                    <input
                        type="number"
                        value={engineSize}
                        className='form-control mb-3'
                        onChange={(e) => setEngineSize(e.target.value)}
                    />
                    {errors.engineSize && <p className="text-danger">{errors.engineSize}</p>}

                    <label className='form-label'>Fuel Consumption</label>
                    <input
                        type="number"
                        value={fuelConsumption}
                        className='form-control mb-3'
                        onChange={(e) => setFuelConsumption(e.target.value)}
                    />
                    {errors.fuelConsumption && <p className="text-danger">{errors.fuelConsumption}</p>}

                    <label className='form-label'>Description</label>
                    <textarea
                        value={description}
                        className='form-control mb-3'
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label className='form-label'>Image</label>
                    <input
                        type="file"
                        className='form-control mb-3'
                        onChange={handleImageChange}
                    />
                    {errors.image && <p className="text-danger">{errors.image}</p>}

                    <button className='btn btn-primary btn-lg' onClick={handleRegister}>
                        Register Car
                    </button>
                    <br /> <br />
                </div>
            ) : (
                <p className='text-center p-2'>User not logged in.</p>
            )}
        </div>
    );
};

export default RegisterCar;
