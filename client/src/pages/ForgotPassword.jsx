import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';


  const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setErrorMessage(null);
        const response = await axios.post('/api/auth/forgot-password', { email }); // Make an API request using axios
        setMessage(response.data);
      } catch (error) {
        setMessage(error.response.data.message);
      }
    };

    // Rest of the code...

 


  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            
            <div>
             <div className='mb-6'><Label value= 'Enter Your Email to send password reset link' className='text-lg'/></div> 
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            
            <Button gradientMonochrome="failure" type='submit'>
              Send
            </Button>
          </form>
          {
            errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>

      </div>
    </div>
  );

};

export default ForgotPassword;