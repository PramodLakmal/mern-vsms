
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Button } from 'flowbite-react';
import { useNavigate, useParams } from "react-router-dom";
import { FaImage } from 'react-icons/fa';
import { storage } from '../../firebase'; // Ensure this is the correct import for Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UpdateServices() {

  const { serviceId } = useParams(); // Get the service ID from URL params
  const [info, setInfo] = useState({
    name: "",
    type: "",
    vehiclename: "",
    price: "",
    imageUrl: "", // Added for the image
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState();
  const [fileInputClicked, setFileInputClicked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/service/${serviceId}`);
        setInfo({ ...response.data }); // reset image field
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch service details:", error);
        setErrorMessage("Failed to fetch service details. Please try again.");
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file)); // Update preview image
  }
  setFileInputClicked(true);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = info.imageUrl; // Initialize image URL as an empty string

    if (selectedImage) {
      const imageRef = ref(storage, `services/${selectedImage.name}`);
      const snapshot = await uploadBytes(imageRef, selectedImage);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const serviceData = {
      ...info,
      imageUrl // Add the image URL to your service data
    };


    const formData = new FormData();
    formData.append('name', info.name);
    formData.append('type', info.type);
    formData.append('vehiclename', info.vehiclename);
    formData.append('price', info.price);
    if (info.imageUrl) {
      formData.append('imageUrl', imageUrl);
    }

    try {
      await axios.patch(`/api/service/${serviceId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      }); // Update the service with image
      alert("Service updated successfully!");
      navigate('/dashboard?tab=DashServices');
      setLoading(false);
    } catch (error) {
      console.error("Failed to update service:", error);
      setErrorMessage("Failed to update service. Please try again.");
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen flex-1 relative z-0 overflow-y-auto focus:outline-none">
       <div className="py-6">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

            <div className="w-full mx-auto mt-10 max-w-lg ">
         <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-center">
         <h1 className="text-3xl font-bold text-blue-500 tracking-wide uppercase">
               Update service
          </h1>
        </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Service Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={info.name}
          onChange={handleChange}
          placeholder="Enter service name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>     
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Service Type:
        </label>
        <input
          type="text"
          id="type"
          name="type"
          value={info.type}
          onChange={handleChange}
          placeholder="Enter service type"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="vehiclename" className="block text-sm font-medium text-gray-700">
          Vehicle Name:
        </label>
        <input
          type="text"
          id="vehiclename"
          name="vehiclename"
          value={info.vehiclename}
          onChange={handleChange}
          placeholder="Enter vehicle name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price:
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={info.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
            Service Image
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="relative flex items-center justify-center h-14 w-full rounded-md bg-gray-50 font-semibold text-gray-400 text-sm cursor-pointer hover:bg-gray-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <div className="absolute left-0 inset-y-0 flex items-center pl-4 pr-2">
                <FaImage className="w-5 h-5 text-gray-400" /> // Add image icon here
              </div>
              <input
                id="image"
                name="image"
                type="file"
               
                onChange={handleFileChange}
                className="w-full cursor-pointer opacity-0"
             
              />
            </div>
          </div>
          </div>
              <center>  <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading} className="w-80 mt-4">
           {loading ? "Loading..." : "Save Changes"}
         </Button>
             </center>
             </form>
              {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
            </div>

            {(selectedImage || info.imageUrl) && (
              <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0" id="id1">
                <img src={selectedImage ? previewImage : info.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} className="rounded-lg object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}