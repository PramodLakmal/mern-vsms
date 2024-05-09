import React, { useState } from 'react';
import axios from "axios";
import { Button } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function AddSupplier() {
  const [previewImage, setPreviewImage] = useState("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg");
  const [selectedImage, setSelectedImage] = useState(null);
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nic: "",
    dob: "",
    gender: "",
    address: "",
    itemName: "",
    itemCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg");
      alert('Invalid file type. Please select an image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      let imageUrl = "";

      if (selectedImage) {
        const imageRef = ref(storage, `Supplier/${selectedImage.name}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const supplierInfo = {
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        nic: info.nic,
        dob: info.dob,
        gender: info.gender,
        address: info.address,
        itemName: info.itemName,
        itemCode: info.itemCode,
        imageUrl: imageUrl
      };

      const response = await axios.post("/api/supplier", supplierInfo, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        window.alert("Supplier added successfully!");
        navigate('/dashboard?tab=SupplierList');
      } else {
        throw new Error("Failed to add supplier. Unexpected response from server.");
      }
    } catch (error) {
      console.error("Failed to add supplier:", error);
      setErrorMessage("Failed to add supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInfo({
      firstName: "",
      lastName: "",
      email: "",
      nic: "",
      dob: "",
      gender: "",
      address: "",
      itemName: "",
      itemCode: "",
    });
    setPreviewImage("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg");
    setSelectedImage(null);
  };

  return (
    <div className="flex bg-gray-200">
      <div className="min-h-screen flex"></div>
      <div className="ml-8 flex-1 pr-8">
        <div className="newContainer">
          <div className="top shadow-md py-2 px-4 my-4 flex">
            <h1 className="text-gray-600 font-bold text-lg flex-grow">Supplier Registration</h1>
          </div>
          <div className="bottom shadow-md p-4 flex">
            <div className="right flex-2 px-4">
              <form onSubmit={handleSubmit} className="flex flex-wrap gap-8 justify-between">
                <div className="formInput w-full flex">
                  <div className="w-1/2 pr-2">
                    <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold">
                      First Name:
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={info.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold">
                      Last Name:
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={info.lastName}
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
                  <div className="w-1/2 pl-2">
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
                </div>
                <div className="formInput w-full flex">
                  <div className="w-1/2 pr-2">
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
                  <div className="w-1/2 pl-2">
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
                </div>
                <div className="formInput w-full flex">
                  <div className="w-1/2 pr-2">
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
                  <div className="w-1/2 pl-2">
                    <label htmlFor="itemName" className="block text-gray-700 text-sm font-bold">
                      Item Name:
                    </label>
                    <input
                      type="text"
                      id="itemName"
                      name="itemName"
                      value={info.itemName}
                      onChange={handleChange}
                      placeholder="Enter item name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </div>
                <div className="w-1/2 pr-2">
                  <label htmlFor="itemCode" className="block text-gray-700 text-sm font-bold">
                    Item Code:
                  </label>
                  <input
                    type="text"
                    id="itemCode"
                    name="itemCode"
                    value={info.itemCode}
                    onChange={handleChange}
                    placeholder="Enter item code"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex justify-center space-x-6">
                  <Button
                    type='submit'
                    color="red"
                    className={`text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline w-${loading ? 'auto' : 'auto'} ${loading ? 'inline-block' : 'inline-block'}`}
                  >
                    {loading ? "Loading..." : "Submit"}
                  </Button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline w-24"
                    type="button"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </form>
              {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
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
