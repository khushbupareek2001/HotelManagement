import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Employee.css';

const EmployeeDetails = () => {
    const navigate = useNavigate();
    const navigateToAddEmployee = () => {
        navigate('/add-employee');
    };
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState('');
    const [showConfirmationButtons, setShowConfirmationButtons] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/employees');
                const sortedEmployees = response.data.sort((a, b) => b.employeeId - a.employeeId);
                setEmployees(sortedEmployees);
            } catch (error) {
                console.error('There was an error fetching the employees!', error);
            }
        };
        fetchEmployees();
    }, []);
    const handleInputChange = async (e, employeeId) => {
        const { name, value } = e.target;
        let validationError = '';
        switch (name) {
            case 'age':
                if (value < 18 || value > 60) {
                    validationError = 'Age must be between 18 and 60.';
                }
                break;
            case 'salary':
                if (value < 0) {
                    validationError = 'Salary must be a positive number.';
                }
                break;
            case 'phoneNumber':
                if (!/^[6-9]\d{9}$/.test(value)) {
                    validationError = 'Phone number must be 10 digits and a valid number.';
                }
                break;
            default:
                break;
        }
        if (validationError) {
            setError(validationError);
            return;
        } else {
            setError('');
        }
        setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
                employee.employeeId === employeeId ? { ...employee, [name]: value } : employee
            )
        );
        const updatedEmployee = employees.find(employee => employee.employeeId === employeeId);
        if (updatedEmployee) {
            const updatedEmployeeDetails = { ...updatedEmployee, [name]: value };
            try {
                await axios.put(`http://localhost:8080/api/employees/${employeeId}`, updatedEmployeeDetails);
            } catch (error) {
                console.error('There was an error updating the employee!', error);
            }
        }
    };
    const handleDeleteEmployee = (employeeId) => {
        setDeleteDialogMessage('Are you sure you want to delete this employee?');
        setShowConfirmationButtons(true);
        setDeleteEmployeeId(employeeId);
    };
    const confirmDeleteEmployee = async () => {
        if (deleteEmployeeId && showConfirmationButtons) {
            try {
                await axios.delete(`http://localhost:8080/api/employees/${deleteEmployeeId}`);
                setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.employeeId !== deleteEmployeeId));
                setDeleteEmployeeId(null);
                setDeleteDialogMessage('');
                setShowConfirmationButtons(false);
            } catch (error) {
                console.error('There was an error deleting the employee!', error);
            }
        }
    };
    
    return (
        <div className="employee-details-container">
            <h2>Employee Details</h2>
            <button onClick={navigateToAddEmployee}>Add Employee</button>
            {employees.length === 0 ? (
                <div className="no-employees">No Employee available !!!</div>
            ) : (
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Aadhar Number</th>
                            <th>Email Address</th>
                            <th>Age</th>
                            <th>Salary</th>
                            <th>Phone Number</th>
                            <th>Department</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.employeeId}>
                                <td>{employee.name}</td>
                                <td>{employee.gender}</td>
                                <td>{employee.aadharNumber}</td>
                                <td>{employee.emailAddress}</td>
                                <td>
                                    <input
                                        type="number"
                                        name="age"
                                        className='smaller-box'
                                        value={employee.age}
                                        onChange={(e) => handleInputChange(e, employee.employeeId)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="salary"
                                        className='smaller-box'
                                        value={employee.salary}
                                        onChange={(e) => handleInputChange(e, employee.employeeId)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={employee.phoneNumber}
                                        onChange={(e) => handleInputChange(e, employee.employeeId)}
                                    />
                                </td>
                                <td>
                                    <select
                                        name="department"
                                        value={employee.department}
                                        onChange={(e) => handleInputChange(e, employee.employeeId)}
                                    >
                                        <option value="House Keeping">House Keeping</option>
                                        <option value="Reception">Reception</option>
                                        <option value="Management">Management</option>
                                        <option value="Food Service">Food Service</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteEmployee(employee.employeeId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {deleteDialogMessage && (
                <div className="delete-dialog">
                    <p>{deleteDialogMessage}</p>
                    <div className="dialog-buttons">
                        {showConfirmationButtons ? (
                            <>
                                <button className="delete-button" onClick={confirmDeleteEmployee}>Yes</button>
                                <button className="dialog-button" onClick={() => { setDeleteDialogMessage(''); setDeleteEmployeeId(null); setShowConfirmationButtons(false); }}>No</button>
                            </>
                        ) : (
                            <button className="dialog-button" onClick={() => { setDeleteDialogMessage(''); setDeleteEmployeeId(null); }}>OK</button>
                        )}
                    </div>
                </div>
            )}
            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};
export default EmployeeDetails;