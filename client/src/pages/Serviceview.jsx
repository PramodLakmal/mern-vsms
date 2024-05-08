import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

function Serviceview() {
    const [services, setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('api/service');
                setServices(response.data);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        };
        fetchServices();
    }, []);

    const filteredServices = searchQuery
        ? services.filter(service =>
            service.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : services;

    return (



        <div className="p-5 bg-gray-100 min-h-screen">

            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
                <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to our Services</h1>
                <p className='text-gray-500 text-xs sm:text-sm'>
                    Here you'll find a variety of services available in our service center.
                </p>

            </div>
            <div className="relative w-full max-w-md mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Search Services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-slate-300 focus:border-blue-500 rounded-full w-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out shadow"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 mx-auto max-w-6xl">
    {filteredServices.map((service) => (
        <div key={service._id} className="bg-white rounded-lg shadow transition duration-300 ease-in-out hover:shadow-xl hover:scale-105 transform p-4 cursor-pointer">
            <img src={service.imageUrl || 'https://via.placeholder.com/150'} alt={service.name} className="w-full object-cover rounded-lg mb-4 h-64" />
            <h5 className="text-3xl text-gray-800 mb-4">{service.name}</h5>
            <div className="text-xl text-gray-500 leading-relaxed">{`Service Type: ${service.type}`}</div>
            <div className="text-xl text-gray-500 leading-relaxed">{`Vehicle Name: ${service.vehiclename}`}</div>
            <div className="text-xl text-red-700 leading-relaxed">{`Price: Rs.${service.price}`}</div>
        </div>
    ))}
</div>


        </div>
    );
}

export default Serviceview;
