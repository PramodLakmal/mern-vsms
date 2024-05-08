import React, { useState } from 'react';
import axios from 'axios';
import { storage } from '../../firebase'; // Ensure this is the correct import for Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddEmergencyServices() {
    const [formData, setFormData] = useState({
        servicetype: 'Mechanical Repair',
        othertype: '',
        cusname: '',
        phone: '',
        date: new Date().toISOString().split('T')[0], // Default to today's date in YYYY-MM-DD
        area: '',
        status: '',
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const [progress, setProgress] = useState(0);
    const [filePreviews, setFilePreviews] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(files); // Update images state with selected files

            const filesArray = files.map(file => URL.createObjectURL(file));
            setFilePreviews(filesArray); // Update file previews for display

            // Cleanup function to revoke URLs to free up resources
            return () => filesArray.forEach(file => URL.revokeObjectURL(file));
        }
    };
    const handleUpload = async () => {
        setLoading(true);
        let uploadUrls = [];
        try {
            const uploadPromises = images.map((image) => {
                const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
                return uploadBytes(imageRef, image)
                    .then(() => getDownloadURL(imageRef)); // Upload the file and get the URL
            });
            uploadUrls = await Promise.all(uploadPromises); // Wait for all uploads to complete
            setUrls(uploadUrls); // Save URLs to state
            setProgress(100); // Update progress to 100% when all uploads are complete
            console.log("All images uploaded:", uploadUrls);
            alert("All images uploaded");
        } catch (err) {
            console.error("Error uploading images:", err);
            setErrorMessage("Failed to upload images");
        } finally {
            setLoading(false);
            return uploadUrls; // Return URLs for use in form submission
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageUrls = await handleUpload(); // Ensure images are uploaded before submitting form
        const dataWithUrls = { ...formData, images: imageUrls }; // Append the uploaded image URLs to formData

        try {
            const response = await axios.post("/api/emergencies", dataWithUrls, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("Response:", response);
            alert("Service added successfully!");
        } catch (error) {
            console.error("Failed to add service:", error);
            if (error.response && error.response.data) {
                console.log("Error data:", error.response.data);
                setErrorMessage(`Failed to add service: ${error.response.data.message || error.response.statusText}`);
            } else {
                setErrorMessage("Failed to add service. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-center bg-gray-200 w-full">
                <div className="w-full lg:w-2/3 flex flex-col p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl mx-auto">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Add Emergency Service</h2>
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
                                            <option value="Mechanical Repair">Mechanical Repair</option>
                                            <option value="Tire Replacement">Tire Replacement</option>
                                            <option value="Battery Services">Battery Services</option>
                                            <option value="other">other</option>
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
                                            required
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
                                                required
                                                accept="image/*"
                                                multiple onChange={handleImageChange}
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
                                            required
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
                                            required
                                            type="date"
                                            id="date"
                                            name="date"
                                            value={formData.date}
                                            readOnly
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    {/* Breakdown Area */}
                                    <div className="flex flex-col mb-6">
                                        <label htmlFor="area" className="mb-2 font-semibold text-gray-700">Breakdown Area:</label>
                                        <input
                                            required
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
                                                    disabled={true}  // Disable the Accept button
                                                    className="form-radio h-5 w-5 text-indigo-600"
                                                />
                                                <span className="ml-2">Accept</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="deny"
                                                    checked={formData.status === 'deny'}
                                                    onChange={handleChange}
                                                    disabled={true}  // Disable the Deny button
                                                    className="form-radio h-5 w-5 text-indigo-600"
                                                />
                                                <span className="ml-2">Deny</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-center mt-6">
                                <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    {loading ? 'Adding...' : 'Add Service'}
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
