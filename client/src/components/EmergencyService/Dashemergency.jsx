import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


export default function DashEmergency() {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const response = await axios.get('/api/emergencies');
                setEmergencies(response.data.reverse());
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch emergencies:', err);
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchEmergencies();
    }, []);

    const deleteEmergency = async (id) => {
        try {
            await axios.delete(`/api/emergencies/${id}`);
            const newEmergencies = emergencies.filter(emergency => emergency._id !== id);
            setEmergencies(newEmergencies);
            alert('Deleted Emergency service successfully');
        } catch (err) {
            console.error('Failed to delete the emergency:', err);
            alert('Failed to delete the emergency');
        }
    };
    const handleEdit = (emergencyId) => {
        navigate(`/Updateemergencyservices/${emergencyId}`); // Use the serviceId to navigate
   };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const generateEmergencyReport = () => {
        try {
            const doc = new jsPDF(); // Initialize jsPDF
            doc.setFontSize(12);
            doc.text('Emergency Service Report', 10, 10);

            // Add table header row
            const headerCols = [
                'Empergency ID', 'Service Type', 'Other Type', 'Customer Name', 'Phone', 'Date',
                'Area', 'Status'
            ];
            const headerRowHeight = 5;
            const headerYPos = 15;

            const tableBody = emergencies.map(emergency => ([
                emergency._id, emergency.servicetype, emergency.othertype, emergency.cusname,
                emergency.phone, new Date(emergency.date).toLocaleDateString('en-US'), emergency.area, emergency.status
            ]));
            doc.autoTable({
                startY: headerYPos,
                head: [headerCols],
                body: tableBody,
            });

            // Calculate the end Y position of the table manually
            const endY = headerYPos + doc.previousAutoTable.finalY;

            // Add additional report information (optional)
            const additionalInfoYPos = endY + 5;
            doc.text('Report generated on:', 10, additionalInfoYPos);
            doc.text(new Date().toLocaleDateString(), 50, additionalInfoYPos);

            // Save or download the report
            doc.save('emergency_report.pdf');
        } catch (error) {
            console.error('Error generating emergency report:', error);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-blue-500 tracking-wide uppercase mb-4 text-center">View Emergency Services</h1>
            <div className="flex justify-end items-center mb-4">
                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                onClick={generateEmergencyReport}
                            >
                                Generate Emergency Report
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => navigate('/dashboard?tab=Addemergencyservices')}
                            >
                                Add New Emergency
                            </button>
                  </div>

            <table className="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            E_Service ID
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Service Type
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            other Type
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Customer Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Phone
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Area
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Images
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Delete
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Edit
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {emergencies.map((emergency) => (
                        <tr key={emergency._id}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {emergency._id}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {emergency.servicetype}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {emergency.othertype}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {emergency.cusname}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {emergency.phone}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {new Date(emergency.date).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {emergency.area}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex">
                                {emergency.images && emergency.images.slice(0, 3).map((image, index) => (
                                    <img key={index} src={image} alt="Emergency" className="w-20 h-20 mr-2" />
                                ))}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {emergency.status}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <button
                                    onClick={() => deleteEmergency(emergency._id)}
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                                 onClick={() => handleEdit(emergency._id)}
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                               Edit
                            </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
