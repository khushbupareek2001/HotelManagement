import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Employee.css';

const AddEmployee = () => {
    const navigate = useNavigate();
    const navigateToMainScreen = () => {
        navigate('/');
    };

    const [name, setName] = useState('');
    const [age, setAge] = useState('18');
    const [gender, setGender] = useState('');
    const [salary, setSalary] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [department, setDepartment] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formValid = true;
        let validationErrors = {};
        if (!gender) {
            validationErrors.gender = 'Please select gender';
            formValid = false;
        }
        if (phoneNumber.length !== 10) {
            validationErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
            formValid = false;
        }
        setErrors(validationErrors);
        if (formValid) {
            const employee = {
                name, age, gender, salary, phoneNumber, aadharNumber, emailAddress, department
            };
            try {
                await axios.post('http://localhost:8080/api/employees', employee);
                alert('Employee added successfully.');
                navigateToMainScreen();
            } catch (error) {
                alert('Failed to add employee.');
            }
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]*$/.test(value) && value.trimStart() === value) {
            setName(value);
            setErrors(prev => ({ ...prev, name: '' }));
        } else {
            setErrors(prev => ({ ...prev, name: 'Full name should only contain letters.' }));
        }
    };
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value === '' || /^[6-9]/.test(value)) {
            setPhoneNumber(value);
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
        } else {
            setErrors(prev => ({ ...prev, phoneNumber: 'Phone number should be a valid number.' }));
        }
    };
    const handleSalaryChange = (e) => {
        const value = e.target.value;
        if (value >= 0) {
            setSalary(value);
            setErrors(prev => ({ ...prev, salary: '' }));
        } else {
            setErrors(prev => ({ ...prev, salary: 'Salary should be a positive number.' }));
        }
    };
    const handleAadharChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value === '' || value.length <= 12) {
            setAadharNumber(value);
            setErrors(prev => ({ ...prev, aadharNumber: '' }));
            if (value.length === 12 && /^[0-9]{12}$/.test(value)) {
                setErrors(prev => ({ ...prev, aadharNumber: '' }));
            } else if (value.length === 12) {
                setErrors(prev => ({ ...prev, aadharNumber: 'Aadhar number should contain exactly 12 digits.' }));
            }
        }
    };
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmailAddress(value);
        if (!value || !/^[^\s@]+@[^\s@]+\.(com|in|org)$/.test(value)) {
            setErrors(prev => ({ ...prev, emailAddress: 'Email should be a valid email address ending with .com, .in, or .org.' }));
        } else {
            setErrors(prev => ({ ...prev, emailAddress: '' }));
        }
    };

    return (
        <div className='form-body'>
            <div className="add-employee-container">
                <div className="form-card">
                    <h2>Add New Employee</h2>
                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>Personal Information</legend>
                            <div className='form-inside'>
                                <label>
                                    Full Name:
                                    <input type="text" value={name} maxLength={30} minLength={2} onChange={handleNameChange} required />
                                    {errors.name && <p className='error-text'>{errors.name}</p>}
                                </label>
                                <div className="input-group">
                                    <label>
                                        Age:
                                        <input type="number" min={18} max={60} value={age} onChange={(e) => setAge(e.target.value)} required />
                                        {errors.age && <p className='error-text'>{errors.age}</p>}
                                    </label>
                                    <label>
                                        Gender:
                                        <div className='gender-options'>
                                            <input type="radio" checked={gender === 'MALE'} value="MALE" onChange={(e) => { setGender(e.target.value); setErrors(prev => ({ ...prev, gender: '' })); }} required /> Male
                                            <input type="radio" checked={gender === 'FEMALE'} value="FEMALE" onChange={(e) => { setGender(e.target.value); setErrors(prev => ({ ...prev, gender: '' })); }} required /> Female
                                            <input type="radio" checked={gender === 'OTHER'} value="OTHER" onChange={(e) => { setGender(e.target.value); setErrors(prev => ({ ...prev, gender: '' })); }} required /> Other
                                        </div>
                                        {errors.gender && <p className='error-text'>{errors.gender}</p>}
                                    </label>
                                </div>
                                <label>
                                    Phone Number:
                                    <input type="text" value={phoneNumber} maxLength={10} onChange={handlePhoneNumberChange} required />
                                    {errors.phoneNumber && <p className='error-text'>{errors.phoneNumber}</p>}
                                </label>
                                <label>
                                    Aadhar Number:
                                    <input type="text" value={aadharNumber} onChange={handleAadharChange} required />
                                    {errors.aadharNumber && <p className='error-text'>{errors.aadharNumber}</p>}
                                </label>
                                <label>
                                    Email Address:
                                    <input type="email" value={emailAddress} onChange={handleEmailChange} required />
                                    {errors.emailAddress && <p className='error-text'>{errors.emailAddress}</p>}
                                </label>
                                <div className="input-group">
                                    <label>
                                        Salary:
                                        <input type="number" min={100} max={100000} value={salary} onChange={handleSalaryChange} required />
                                        {errors.salary && <p className='error-text'>{errors.salary}</p>}
                                    </label>
                                    <label>
                                        Department:
                                        <select name="department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                                            <option value="">Select</option>
                                            <option value="House Keeping">House Keeping</option>
                                            <option value="Reception">Reception</option>
                                            <option value="Management">Management</option>
                                            <option value="Food Service">Food Service</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default AddEmployee;