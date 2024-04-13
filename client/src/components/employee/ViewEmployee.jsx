import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashSidebar from '../../components/DashSidebar'; // Import DashSidebar component
import { useParams } from 'react-router-dom'; // Import useParams
import { storage } from '../../firebase'; // Import Firebase storage
import { ref, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions

export default function ViewEmployee() {
    const { employeeId } = useParams(); // Get the employee ID from the URL

    const [employee, setEmployee] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        nic: '',
        dob: '',
        gender: '',
        address: '',
        imageUrl: '',
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/employee/${employeeId}`); 
                const { firstname, lastname, email, phone, nic, dob, gender, address, imageUrl } = response.data;
                setEmployee({ firstname, lastname, email, phone, nic, dob, gender, address, imageUrl });

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch employee details:', error);
                setErrorMessage('Failed to fetch employee details. Please try again.');
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [employeeId]);

    useEffect(() => {
        const fetchImageUrl = async () => {
            if (employee.imageUrl) {
                try {
                    const imageUrl = await getDownloadURL(ref(storage, employee.imageUrl));
                    setEmployee((prevEmployee) => ({ ...prevEmployee, imageUrl }));
                } catch (error) {
                    console.error('Failed to fetch employee image:', error);
                }
            }
        };

        fetchImageUrl();
    }, [employee.imageUrl]);

    return (
        <div className="flex bg-gray-200">
            <div className="min-h-screen flex">
                <DashSidebar />
            </div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4 flex">
                        <h1 className="text-gray-600 font-bold text-lg flex-grow">View Profile</h1>
                    </div>
                    <div className="flex justify-center mb-4">
                        <img
                            src={employee.imageUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '300px', width: '200px', height: '200px' }}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="bottom shadow-md p-4 ">
                        <form className="flex flex-wrap gap-4 ">
                            <div className="formInput w-full flex justify-center ">
                                <div className="w-1/4 pr-2">
                                    <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold">
                                        First Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        value={employee.firstname}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="w-1/4 pl-2">
                                    <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold">
                                        Last Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        value={employee.lastname}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>
                            <div className="formInput w-full flex justify-center">
                                <div className="w-1/4 pr-2">
                                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold">
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={employee.email}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="w-1/4 pl-2">
                                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold">
                                        Phone Number:
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={employee.phone}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>
                            <div className="formInput w-full flex justify-center">
                                <div className="w-1/4 pr-2">
                                    <label htmlFor="nic" className="block text-gray-700 text-sm font-bold">
                                        NIC:
                                    </label>
                                    <input
                                        type="text"
                                        id="nic"
                                        name="nic"
                                        value={employee.nic}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="w-1/4 pl-2">
                                    <label htmlFor="dob" className="block text-gray-700 text-sm font-bold">
                                        Date of Birth:
                                    </label>
                                    <input
                                        type="text"
                                        id="dob"
                                        name="dob"
                                        value={new Date(employee.dob).toLocaleDateString()}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>
                            <div className="formInput w-full flex justify-center">
                                <div className="w-1/4 pr-2">
                                    <label htmlFor="gender" className="block text-gray-700 text-sm font-bold">
                                        Gender:
                                    </label>
                                    <input
                                        type="text"
                                        id="gender"
                                        name="gender"
                                        value={employee.gender}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="w-1/4 pl-2">
                                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold">
                                        Address:
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={employee.address}
                                        readOnly
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>
                        </form>
                        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
