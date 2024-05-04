import React, { useState } from 'react';
import axios from "axios";
import { Button } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import { FaImage } from 'react-icons/fa';
import { storage } from '../../firebase'; // Ensure this is the correct import for Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddServices() {
  
  const [previewImage, setPreviewImage] = useState("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg");
  const [selectedImage, setSelectedImage] = useState(null);
  const [info, setInfo] = useState({
    name: "",
    type: "",
    vehiclename: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const updateForm = (value) => {
    setInfo(prev => {
      return { ...prev, ...value };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      console.error('Invalid file type. Please select an image.');
      alert('Invalid file type. Please select an image.');
      setPreviewImage("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg");
      event.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      let imageUrl = ""; // Initialize image URL as an empty string

      if (selectedImage) {
        const imageRef = ref(storage, `services/${selectedImage.name}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const serviceData = {
        ...info,
        imageUrl // Add the image URL to your service data
      };

      // Assuming your API can handle JSON payload directly
      // Adjust headers and payload format as needed
      await axios.post("/api/service", serviceData, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert("Service added successfully!");
      navigate('/dashboard?tab=DashServices');
    } catch (error) {
      console.error("Failed to add service:", error);
      setErrorMessage("Failed to add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
      <>
       <main className="min-h-screen flex-1 relative z-0 overflow-y-auto focus:outline-none">
       <div className="py-6">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

            <div className="w-full mx-auto mt-10 max-w-lg ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-center">
         <h1 className="text-3xl font-bold text-blue-500 tracking-wide uppercase">
                    Add service
          </h1>
        </div>
         <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Service Name:
        </label>
        <input
          required
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
          required
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
           required
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
          required
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
                required
                accept="image/*"
                onChange={handleImageChange}
                className="w-full cursor-pointer opacity-0"
              />
            </div>
          </div>
          </div>
            <div className="flex justify-center mt-4">
              <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading} className="w-80">
                {loading ? "Loading..." : "Add Service"}
              </Button>
            </div>
          </form>
          {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </div>
        <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0">
              <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} className="rounded-lg object-cover" />
            </div>
      </div>
    </div>
  </div>
  
</main>
</>
  );
}