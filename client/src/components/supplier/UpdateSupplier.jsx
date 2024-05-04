import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'flowbite-react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../../firebase'; // Ensure this is the correct import path for Firebase storage
import DashSidebar from '../../components/DashSidebar'; // Import DashSidebar component
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UpdateSupplier() {
  const { supplierId } = useParams(); // Get the supplier ID from the URL
  const [supplier, setSupplier] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nic: "",
    dob: "",
    gender: "",
    address: "",
    imageUrl: "",
    itemName: "",
    itemCode: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState();
  const [fileInputClicked, setFileInputClicked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/supplier/${supplierId}`);

        const { firstName, lastName, email, nic, dob, gender, address,itemCode,itemName, imageUrl } = response.data;
        const dateOfBirth = dob.split('T')[0]; // Extract only the date part
        // Check if imageUrl exists and set it accordingly
        const supplierImageUrl = imageUrl ? imageUrl : ""; // Default to empty string if imageUrl is null
        setSupplier({ firstName, lastName, email, nic, dob: dateOfBirth, gender, address, itemName, itemCode, imageUrl: supplierImageUrl });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch supplier details:", error);
        setErrorMessage("Failed to fetch supplier details. Please try again.");
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [supplierId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Update preview image
      setSupplier(prevSupplier => ({ ...prevSupplier, imageName: file.name })); // Set file name in supplier state
    }
    setFileInputClicked(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = supplier.imageUrl; // Keep the original image URL if not changed

    if (selectedImage) {
      const imageRef = ref(storage, `supplier/${selectedImage.name}`);
      const snapshot = await uploadBytes(imageRef, selectedImage);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const supplierInfo = { ...supplier, imageUrl };

    try {
      await axios.patch(`/api/supplier/${supplierId}`, supplierInfo, {
        headers: {
          'Content-Type': 'application/json',
        },
      }); // Update the supplier
      alert("Supplier updated successfully!");
      navigate('/dashboard?tab=SupplierList'); // Adjust the redirect path as needed
      setLoading(false);
    } catch (error) {
      console.error("Failed to update supplier:", error);
      setErrorMessage("Failed to update supplier. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-200">
      <div className="min-h-screen flex">
        <DashSidebar />
      </div>
      <div className="ml-8 flex-1 pr-8">
        <div className="newContainer">
          <div className="top shadow-md py-2 px-4 my-4 flex">
            <h1 className="text-gray-600 font-bold text-lg flex-grow">Edit Supplier</h1>
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
                      value={supplier.firstName}
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
                      value={supplier.lastName}
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
                    value={supplier.email}
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
                      value={supplier.nic}
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
                      value={supplier.dob}
                      onChange={handleChange}
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
                        checked={supplier.gender === "male"}
                        className="mr-1"
                      />
                      <label htmlFor="male" className="mr-4 block text-sm text-gray-500">Male</label>
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        onChange={handleChange}
                        checked={supplier.gender === "female"}
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
                      value={supplier.address}
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
                          onChange={handleFileChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
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
                      value={supplier.itemName}
                      onChange={handleChange}
                      placeholder="Enter item name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </div>
                <div className="formInput w-full flex">
                  <div className="w-1/2 pr-2">
                    <label htmlFor="itemCode" className="block text-gray-700 text-sm font-bold">
                      Item Code:
                    </label>
                    <input
                      type="text"
                      id="itemCode"
                      name="itemCode"
                      value={supplier.itemCode}
                      onChange={handleChange}
                      placeholder="Enter item code"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-center space-x-6">
                  <Button
                    type='submit'
                    disabled={loading}
                    color="red" // Set the color prop to "red" to change the button color to red
                    className={`text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline w-${loading ? 'auto' : 'auto'} ${loading ? 'inline-block' : 'inline-block'}`}
                  >
                    {loading ? "Loading..." : "Save Changes"}
                  </Button>
                </div>
              </form>
              {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
            </div>
            {!fileInputClicked ? (
              <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0" id="id1">
                <img src={supplier.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', width: '200px', height: '200px' }} className="rounded-full object-cover" />
              </div>
            ) : (
              <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0" id="id2">
                <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', width: '200px', height: '200px' }} className="rounded-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button } from 'flowbite-react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { storage } from '../../firebase'; // Ensure this is the correct import path for Firebase storage
// import DashSidebar from '../../components/DashSidebar'; // Import DashSidebar component
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// export default function UpdateSupplier() {
//   const { supplierId } = useParams(); // Get the supplier ID from the URL
//   const [supplier, setSupplier] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     nic: "",
//     dob: "",
//     gender: "",
//     address: "",
//     imageUrl: "",
//     itemName: "",
//     itemCode: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();
//   const [previewImage, setPreviewImage] = useState();
//   const [fileInputClicked, setFileInputClicked] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     const fetchSupplier = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`/api/supplier/${supplierId}`);

//         const { firstName, lastName, email, nic, dob, gender, address, itemName, itemCode, imageUrl } = response.data;
//         const dateOfBirth = dob.split('T')[0]; // Extract only the date part
//         // Check if imageUrl exists and set it accordingly
//         const supplierImageUrl = imageUrl ? imageUrl : ""; // Default to empty string if imageUrl is null
//         setSupplier({ firstName, lastName, email, nic, dob: dateOfBirth, gender, address, itemName, itemCode, imageUrl: supplierImageUrl });

//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch supplier details:", error);
//         setErrorMessage("Failed to fetch supplier details. Please try again.");
//         setLoading(false);
//       }
//     };
//     fetchSupplier();
//   }, [supplierId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSupplier(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       setSelectedImage(file);
//       setPreviewImage(URL.createObjectURL(file)); // Update preview image
//       setFileInputClicked(true);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     let imageUrl = supplier.imageUrl; // Keep the original image URL if not changed

//     if (selectedImage) {
//       const imageRef = ref(storage, `supplier/${selectedImage.name}`);
//       const snapshot = await uploadBytes(imageRef, selectedImage);
//       imageUrl = await getDownloadURL(snapshot.ref);
//     }

//     const supplierInfo = { ...supplier, imageUrl };

//     try {
//       await axios.patch(`/api/supplier/${supplierId}`, supplierInfo, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }); // Update the supplier
//       alert("Supplier updated successfully!");
//       navigate('/dashboard?tab=SupplierList'); // Adjust the redirect path as needed
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to update supplier:", error);
//       setErrorMessage("Failed to update supplier. Please try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex bg-gray-200">
//       <div className="min-h-screen flex">
//         <DashSidebar />
//       </div>
//       <div className="ml-8 flex-1 pr-8">
//         <div className="newContainer">
//           <div className="top shadow-md py-2 px-4 my-4 flex">
//             <h1 className="text-gray-600 font-bold text-lg flex-grow">Edit Supplier</h1>
//           </div>
//           <div className="bottom shadow-md p-4 flex">
//             <div className="right flex-2 px-4">
//               <form onSubmit={handleSubmit} className="flex flex-wrap gap-8 justify-between">
//                 <div className="formInput w-full flex">
//                   <div className="w-1/2 pr-2">
//                     <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold">
//                       First Name:
//                     </label>
//                     <input
//                       type="text"
//                       id="firstName"
//                       name="firstName"
//                       value={supplier.firstName}
//                       onChange={handleChange}
//                       placeholder="Enter first name"
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                   <div className="w-1/2 pl-2">
//                     <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold">
//                       Last Name:
//                     </label>
//                     <input
//                       type="text"
//                       id="lastName"
//                       name="lastName"
//                       value={supplier.lastName}
//                       onChange={handleChange}
//                       placeholder="Enter last name"
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="w-1/2 pr-2">
//                   <label htmlFor="email" className="block text-gray-700 text-sm font-bold">
//                     Email:
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={supplier.email}
//                     onChange={handleChange}
//                     placeholder="Enter email"
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     required
//                   />
//                 </div>
//                 <div className="formInput w-full flex">
//                   <div className="w-1/2 pr-2">
//                     <label htmlFor="nic" className="block text-gray-700 text-sm font-bold">
//                       NIC:
//                     </label>
//                     <input
//                       type="text"
//                       id="nic"
//                       name="nic"
//                       value={supplier.nic}
//                       onChange={handleChange}
//                       placeholder="Enter NIC"
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                   <div className="w-1/2 pl-2">
//                     <label htmlFor="dob" className="block text-gray-700 text-sm font-bold">
//                       Date of Birth:
//                     </label>
//                     <input
//                       type="date"
//                       id="dob"
//                       name="dob"
//                       value={supplier.dob}
//                       onChange={handleChange}
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="formInput w-full flex">
//                   <div className="w-1/2 pr-2">
//                     <label className="block text-gray-700 text-sm font-bold">Gender:</label>
//                     <div className="flex items-center">
//                       <input
//                         type="radio"
//                         id="male"
//                         name="gender"
//                         value="male"
//                         onChange={handleChange}
//                         checked={supplier.gender === "male"}
//                         className="mr-1"
//                       />
//                       <label htmlFor="male" className="mr-4 block text-sm text-gray-500">Male</label>
//                       <input
//                         type="radio"
//                         id="female"
//                         name="gender"
//                         value="female"
//                         onChange={handleChange}
//                         checked={supplier.gender === "female"}
//                         className="mr-1"
//                       />
//                       <label htmlFor="female" className="ml-4 block text-sm text-gray-500">Female</label>
//                     </div>
//                   </div>
//                   <div className="w-1/2 pl-2">
//                     <label htmlFor="address" className="block text-gray-700 text-sm font-bold">
//                       Address:
//                     </label>
//                     <input
//                       type="text"
//                       id="address"
//                       name="address"
//                       value={supplier.address}
//                       onChange={handleChange}
//                       placeholder="Enter address"
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="formInput w-full flex">
//                   <div className="w-1/2 pr-2">
//                     <label htmlFor="image" className="block text-gray-700 text-sm font-bold">
//                       Upload Image:
//                     </label>
//                     <div className="mt-1 sm:mt-0 sm:col-span-2">
//                       <div className="relative flex items-center justify-center h-14 w-full rounded-md bg-gray-40 font-semibold text-gray-400 text-sm cursor-pointer hover:bg-gray-100 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0 focus-within:ring-gray-500">
//                         <input
//                           id="image"
//                           name="image"
//                           type="file"
//                           onChange={handleFileChange}
//                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="w-1/2 pl-2">
//                     <label htmlFor="itemName" className="block text-gray-700 text-sm font-bold">
//                       Item Name:
//                     </label>
//                     <input
//                       type="text"
//                       id="itemName"
//                       name="itemName"
//                       value={supplier.itemName}
//                       onChange={handleChange}
//                       placeholder="Enter item name"
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="formInput w-full flex">
//                   <div className="w-1/2 pr-2">
//                     <label htmlFor="itemCode" className="block text-gray-700 text-sm font-bold">
//                       Item Code:
//                     </label>
//                     <input
//                       type="text"
//                       id="itemCode"
//                       name="itemCode"
//                       value={supplier.itemCode}
//                       onChange={handleChange}
//                       placeholder="Enter item code"
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-center space-x-6">
//                   <Button
//                     type='submit'
//                     disabled={loading}
//                     color="red" // Set the color prop to "red" to change the button color to red
//                     className={`text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline w-${loading ? 'auto' : 'auto'} ${loading ? 'inline-block' : 'inline-block'}`}
//                   >
//                     {loading ? "Loading..." : "Save Changes"}
//                   </Button>
//                 </div>
//               </form>
//               {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
//             </div>
//             {!fileInputClicked ? (
//               <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0" id="id1">
//                 <img src={supplier.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', width: '200px', height: '200px' }} className="rounded-full object-cover" />
//               </div>
//             ) : (
//               <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0" id="id2">
//                 <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', width: '200px', height: '200px' }} className="rounded-full object-cover" />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

