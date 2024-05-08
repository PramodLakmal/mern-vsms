  import React, { useEffect, useState } from 'react';
  import axios from 'axios'; 
  import { useNavigate } from 'react-router-dom';
  import { getStorage, ref, getDownloadURL } from 'firebase/storage';
  import { FaSearch } from 'react-icons/fa';
  
    function DashServices() {
           const [searchQuery, setSearchQuery] = useState('');
           const [services, setServices] = useState([]);
           const navigate = useNavigate();

      useEffect(() => {
        const fetchServices = async () => {
          try {
              const response = await axios.get('api/service');
              const servicesWithImageUrls = await Promise.all(response.data.map(async (service) => {
                  return { ...service };
              }));
              setServices(servicesWithImageUrls);
          } catch (error) {
              console.error("Failed to fetch services:", error);
          }
      };
         fetchServices();
     }, []); 

    const deleteService = async (serviceId) => {
         try {
      // Assuming your backend endpoint to delete a service looks something like 'api/service/:id'
              await axios.delete(`/api/service/${serviceId}`);
         // Filter out the deleted service from the services state
           const updatedServices = services.filter(service => service._id !== serviceId);
           setServices(updatedServices);
           alert('Service deleted successfully');
            } catch (error) {
              console.error("Failed to delete service:", error);
              alert('Failed to delete service');
           }
         };
         const handleEdit = (serviceId) => {
         navigate(`/update-service/${serviceId}`); // Use the serviceId to navigate
    };

       const storage = getStorage();
       const fetchImageUrl = async (imagePath) => {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath;
        }
        const fullPath = `images/${imagePath}`;
        console.log("Attempting to fetch image from:", fullPath);
        try {
          const imageRef = ref(storage, fullPath);
          const url = await getDownloadURL(imageRef);
          return url;
        } catch (error) {
          console.error(`Error fetching image URL for ${fullPath}:`, error);
          return 'https://via.placeholder.com/150';
        }
      };
   
      const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return (
    <div className='ml-8 flexx-1 pr-10'>
      <div className='flex flex-col w-full max-w-8xl'>
        <h1 className="text-3xl font-bold text-blue-500 tracking-wide uppercase mb-4 text-center">
          View Services
        </h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-full w-full pr-10 pl-4 text-gray-700"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500 cursor-pointer" />
        </div>
        {services.length > 0 ? (
          <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>Date Updated</th>
                  <th scope='col' className='py-3 px-6'>Service ID</th>
                  <th scope='col' className='py-3 px-6'>Service Image</th>
                  <th scope='col' className='py-3 px-6'>Service Name</th>
                  <th scope='col' className='py-3 px-6'>Service Type</th>
                  <th scope='col' className='py-3 px-6'>Vehicle Name</th>
                  <th scope='col' className='py-3 px-6'>Price</th>
                  <th scope='col' className='py-3 px-6'>Delete</th>
                  <th scope='col' className='py-3 px-6'>Edit</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                    <td className='py-4 px-6'>{new Date(service.updatedAt).toLocaleDateString()}</td>
                    <td className='py-4 px-6'>{service._id}</td>
                    <td className='py-4 px-6'>
                      <img src={service.imageUrl || 'https://via.placeholder.com/150'} alt='Service' className='w-12 h-12 rounded-full' />
                    </td>
                    <td className='py-4 px-6'>{service.name}</td>
                    <td className='py-4 px-6'>{service.type}</td>
                    <td className='py-4 px-6'>{service.vehiclename}</td>
                    <td className='py-4 px-6'>{service.price}</td>
                    <td className='py-4 px-6'>
                      <button onClick={() => deleteService(service._id)} className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>Delete</button>
                    </td>
                    <td className='py-4 px-6'>
                      <button onClick={() => handleEdit(service._id)} className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-700 p-3'>
            No services found.
          </div>
        )}
      </div>
    </div>
  );
}

export default DashServices;