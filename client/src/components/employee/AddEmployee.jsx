import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storage } from '../../firebase'; // Ensure this is the correct import for Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function AddEmployee() {
  const [previewImage, setPreviewImage] = useState("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg");
  const [selectedImage, setSelectedImage] = useState(null);
  const [info, setInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");
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
    setErrorMessages("");

    try {
      let imageUrl = ""; // Initialize image URL as an empty string

      if (selectedImage) {
        const imageRef = ref(storage, `employee/${selectedImage.name}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const employeeInfo = {
        ...info,
        imageUrl // Add the image URL to your service data
      };

      // Assuming your API can handle JSON payload directly
      // Adjust headers and payload format as needed
      await axios.post("/api/employee", employeeInfo, {
        headers: { 'Content-Type': 'application/json' },
      });

      window.alert("Employee added successfully!");
      navigate('/dashboard?tab=EmployeeList');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = error.response.data.errors;
        setErrorMessages(errors); // Set validation errors
      } else {
        console.error("Error while creating employee:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInfo({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      nic: "",
      dob: "",
      gender: "",
      address: "",
    });
    setPreviewImage("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg");
    setSelectedImage(null);
  };

  return (
    <div className="flex ">
      <div className="min-h-screen flex">

      </div>
      <div className="ml-8 flex-1 pr-8">
        <div className="newContainer">
          <div className="top shadow-md py-2 px-4 my-4 flex">
            <h1 className="text-gray-600 font-bold text-lg flex-grow">Employee Registration</h1>
          </div>
          <div className="bottom shadow-md p-4 flex">
            <div className="right flex-2 px-4">

              <form onSubmit={handleSubmit} className="flex flex-wrap gap-8 justify-between">
                <div className="formInput w-full flex">
                  <div className="w-1/2 pr-2">
                    <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold">
                      First Name:
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={info.firstname}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold">
                      Last Name:
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={info.lastname}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </div>
                <div className="w-1/2 pr-2">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={info.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="formInput w-full flex">
                  <div className="w-1/2 pr-2">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold">
                      Phone Number:
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={info.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label htmlFor="nic" className="block text-gray-700 text-sm font-bold">
                      NIC:
                    </label>
                    <input
                      type="text"
                      id="nic"
                      name="nic"
                      value={info.nic}
                      onChange={handleChange}
                      placeholder="Enter NIC"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </div>
                <div className="formInput w-full flex">
                  <div className="w-1/2 pr-2">
                    <label htmlFor="dob" className="block text-gray-700 text-sm font-bold">
                      Date of Birth:
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={info.dob}
                      onChange={handleChange}
                      placeholder="Enter date of birth"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700 text-sm font-bold">Gender:</label>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        onChange={handleChange}
                        className="mr-1"
                      />
                      <label htmlFor="male" className="mr-4 block text-sm text-gray-500">Male</label>
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        onChange={handleChange}
                        className="mr-1"
                      />
                      <label htmlFor="female" className="ml-4 block text-sm text-gray-500">Female</label>
                    </div>
                  </div>
                </div>
                <div className="formInput w-full flex" style={{ marginBottom: '20px' }}>
                  <div className="w-1/2 pr-2">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold">
                      Address:
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={info.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold">
                      Upload Image:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="relative flex items-center justify-center h-14 w-full rounded-md bg-gray-40 font-semibold text-gray-400 text-sm cursor-pointer hover:bg-gray-100 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0 focus-within:ring-gray-500">
                        <input
                          id="image"
                          name="image"
                          type="file"
                          required
                          onChange={handleImageChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-6">
                  <button
                    type="submit"
                    className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline w-auto ${loading ? 'inline-block' : 'inline-block'}`}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Submit"}
                  </button>

                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-24"
                    type="button"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </form>
               {/* Display validation error messages */}
               {errorMessages.length > 0 && (
                <div className="text-red-500 mt-2">
                  {errorMessages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0">
              <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', width: '200px', height: '200px' }} className="rounded-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
