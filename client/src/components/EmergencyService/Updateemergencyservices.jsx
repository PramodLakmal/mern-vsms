import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from '../../firebase'; // Ensure this is the correct import for Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateEmergencyServices() {
    const { emergencyId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        servicetype: 'Mechanical',
        othertype: '',
        cusname: '',
        phone: '',
        date: '',
        area: '',
        status: 'pending',
        images: []
    });
    const [images, setImages] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchEmergencyDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/emergencies/${emergencyId}`);
                const data = response.data;

                const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';

                setFormData(prevFormData => ({
                    ...prevFormData,
                    servicetype: data.servicetype || 'Mechanical',
                    othertype: data.othertype || '',
                    cusname: data.cusname || '',
                    phone: data.phone || '',
                    date: formattedDate, // Use the formatted date
                    area: data.area || '',
                    status: data.status || 'Pending',
                    images: data.images || []
                }));

                // Update file previews with image URLs
                setFilePreviews(data.images || []);

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch emergency service details:", error);
                setErrorMessage("Failed to fetch emergency service. Please try again.");
                setLoading(false);
            }
        };

        fetchEmergencyDetails();
    }, [emergencyId]);

    useEffect(() => {
        // This will revoke the object URL to avoid memory leaks
        return () => {
            filePreviews.forEach(URL.revokeObjectURL);
        };
    }, [filePreviews]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setImages(files);

        // Revoke the current file previews to avoid memory leaks
        filePreviews.forEach(URL.revokeObjectURL);

        const newFilePreviews = files.map(file => URL.createObjectURL(file));
        setFilePreviews(newFilePreviews);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");

        let imageUrls = [];

        if (images.length > 0) {
            const uploadPromises = images.map(async (imageFile) => {
                const imageRef = ref(storage, `services/${imageFile.name}`);
                const snapshot = await uploadBytes(imageRef, imageFile);
                return await getDownloadURL(snapshot.ref);
            });

            try {
                imageUrls = await Promise.all(uploadPromises);
            } catch (error) {
                console.error("Failed to upload images:", error);
                setErrorMessage("Failed to upload images. Please try again.");
                setLoading(false);
                return;
            }
        }

        const dataToSend = {
            ...formData,
            images: imageUrls.length > 0 ? imageUrls : formData.images
        };

        try {
            await axios.patch(`/api/emergencies/${emergencyId}`, dataToSend);
            navigate('/dashboard?tab=Dashemergency');
        } catch (error) {
            console.error("Failed to update emergency service:", error);
            setErrorMessage("Failed to update. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="flex justify-center bg-gray-200 w-full">
                <div className="w-full lg:w-2/3 flex flex-col p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl mx-auto">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8"> update  Emergency Service</h2>
                        <form onSubmit={handleSubmit} className="flex flex-wrap justify-center">
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 w-full">
                                <div className="pr-5">
                                    {/* Service Type */}
                                    <div className="flex flex-col mb-6">
                                        <label htmlFor="servicetype" className="mb-2 font-semibold text-gray-700">Service Type:</label>
                                        <select
                                            id="servicetype"
                                            name="servicetype"
                                            value={formData.servicetype}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="Mechanical">Mechanical Repair</option>
                                            <option value="Tire">Tire Replacement</option>
                                            <option value="Battery">Battery Services</option>
                                        </select>
                                    </div>
                                    {/* Additional Type */}
                                    <div className="flex flex-col mb-8">
                                        <label htmlFor="othertype" className="mb-2 font-semibold text-gray-700">Additional Type:</label>
                                        <input
                                            type="text"
                                            id="othertype"
                                            name="othertype"
                                            value={formData.othertype}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    {/* Customer Name */}
                                    <div className="flex flex-col mb-6">
                                        <label htmlFor="cusname" className="mb-2 font-semibold text-gray-700">Customer Name:</label>
                                        <input
                                            type="text"
                                            id="cusname"
                                            name="cusname"
                                            value={formData.cusname}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center justify-center bg-grey-lighter mb-6">
                                        <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-purple-500 hover:text-white">
                                            <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.88 2.88A3 3 0 0014 2H6a3 3 0 00-3 3v10a3 3 0 003 3h8a3 3 0 003-3V6a3 3 0 00-.88-2.12zM14 4a1 1 0 011 1v.38l-4 4-3-3-4 4V7a1 1 0 011-1h6V4h2zm-3 5l3-3v2a1 1 0 001 1h2l-4 4-2-2zm4 7H6a1 1 0 01-1-1v-1l4-4 3 3 4-4v5a1 1 0 01-1 1z" /></svg>
                                            <span className="mt-2 text-base leading-normal">Select images</span>
                                            <input
                                                id="images"
                                                name="images"
                                                type="file"
                                               
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="w-full cursor-pointer opacity-0"
                                            />
                                        </label>
                                    </div>
                                    <div className="flex flex-wrap mb-6">
                                        {filePreviews.map((src, index) => (
                                            <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-32 h-32 m-1 rounded-md shadow" />
                                        ))}
                                    </div>
                                </div>
                                <div className="pl-5">
                                    {/* Customer Telephone */}
                                    <div className="flex flex-col mb-6">
                                        <label htmlFor="phone" className="mb-2 font-semibold text-gray-700">Customer Telephone:</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    {/* Date */}
                                    <div className="flex flex-col mb-6">
                                        <label htmlFor="date" className="mb-2 font-semibold text-gray-700">Date:</label>
                                        <input
                                            type="date"
                                            id="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    {/* Breakdown Area */}
                                    <div className="flex flex-col mb-6">
                                        <label htmlFor="area" className="mb-2 font-semibold text-gray-700">Breakdown Area:</label>
                                        <input
                                            type="text"
                                            id="area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    {/* Emergency Service Status */}
                                    <div className="flex flex-col mb-10 mt-9">
                                        <label className="mb-6 font-semibold text-gray-700">Emergency Service Status:</label>
                                        <div className="flex flex-row justify-start space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="pending"
                                                    checked={formData.status === 'pending'}
                                                    onChange={handleChange}
                                                    className="form-radio h-5 w-5 text-indigo-600"
                                                />
                                                <span className="ml-2">Pending</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="accept"
                                                    checked={formData.status === 'accept'}
                                                    onChange={handleChange}
                                                    className="form-radio h-5 w-5 text-indigo-600"
                                                />
                                                <span className="ml-2">Accept</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="reject"
                                                    checked={formData.status === 'reject'}
                                                    onChange={handleChange}
                                                    className="form-radio h-5 w-5 text-indigo-600"
                                                />
                                                <span className="ml-2">reject</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-center mt-6">
                                <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    {loading ? 'Adding...' : 'update Service'}
                                </button>
                            </div>
                            {errorMessage && <p className="text-red-500 text-xs italic mt-4">{errorMessage}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}