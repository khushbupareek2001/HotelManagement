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
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [editedEmployeeDetails, setEditedEmployeeDetails] = useState({});

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
    const handleEditClick = (employeeId) => {
        setEditingEmployeeId(employeeId);
        const employee = employees.find((employee) => employee.employeeId === employeeId);
        if (employee) {
            setEditedEmployeeDetails(employee);
        }
    };
    const handleSaveClick = async (employeeId) => {
        if (editedEmployeeDetails.age < 0) {
            alert('Age must be a positive number.');
            return;
        } else if (editedEmployeeDetails.age < 18 || editedEmployeeDetails.age > 60) {
            alert('Age must be between 18 and 60.');
            return;
        } else if (editedEmployeeDetails.salary < 0) {
            alert('Salary must be a positive number.');
            return;
        } else if (editedEmployeeDetails.salary < 100 || editedEmployeeDetails.salary > 100000) {
            alert('Salary must be between 100 and 100000.');
            return;
        }
        else {
            setError('');
        }

        try {
            await axios.put(`http://localhost:8080/api/employees/${employeeId}`, editedEmployeeDetails);
            setEmployees((prevEmployees) => prevEmployees.map((employee) =>
                employee.employeeId === employeeId ? { ...employee, ...editedEmployeeDetails } : employee
            ));
            setEditingEmployeeId(null);
            setEditedEmployeeDetails({});
        } catch (error) {
            console.error('There was an error updating the employee!', error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployeeDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
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
                            <th>Phone Number</th>
                            <th>Email Address</th>
                            <th>Age</th>
                            <th>Salary</th>
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
                                <td>{employee.phoneNumber}</td>
                                <td>{employee.emailAddress}</td>
                                <td>
                                    {editingEmployeeId === employee.employeeId ? (
                                        <input
                                            type="number"
                                            name="age"
                                            min={18} max={60}
                                            className='age-smaller-box'
                                            value={editedEmployeeDetails.age}
                                            onChange={handleInputChange}
                                        />) : (
                                        employee.age
                                    )}
                                </td>
                                <td>
                                    {editingEmployeeId === employee.employeeId ? (
                                        <input
                                            type="number"
                                            name="salary"
                                            className='more-smaller-box'
                                            value={editedEmployeeDetails.salary}
                                            onChange={handleInputChange}
                                        />) : (
                                        employee.salary
                                    )}
                                </td>
                                <td>
                                    {editingEmployeeId === employee.employeeId ? (
                                        <select
                                            name="department"
                                            value={editedEmployeeDetails.department}
                                            onChange={handleInputChange}
                                        >
                                            <option value="House Keeping">House Keeping</option>
                                            <option value="Reception">Reception</option>
                                            <option value="Management">Management</option>
                                            <option value="Food Service">Food Service</option>
                                        </select>) : (
                                        employee.department
                                    )}
                                </td>
                                <td>
                                    {editingEmployeeId === employee.employeeId ? (
                                        <button onClick={() => handleSaveClick(employee.employeeId)} className='save-button'>Save</button>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(employee.employeeId)} className='edit-button'>Edit</button>
                                        </>
                                    )}
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