import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';


const ResetPassword = () => {
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post('/api/auth/reset-password', { resetToken, newPassword });
            setMessage(response.data);
            if(response.status === 200) {
                alert('Password Reset Successfully');
                navigate('/sign-in');
              }
        } catch (error) {
            setErrorMessage('Password reset failed. Please try again.');
        }
    };


  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            
            <div>
             <div className='mb-6'><Label value= 'Enter Your New Password here' className='text-lg'/></div> 
             <div className='mb-6'>
                <TextInput type="text" placeholder="Enter reset token" value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
                <div className='mb-6 mt-6'><TextInput
                type='password'
                placeholder='Enter new password'
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/></div>
              <div className='mb-6'><TextInput
                type='password'
                placeholder='Confirm new password'
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/></div>  
            </div>
            </div>
            
            <Button gradientMonochrome="failure" type='submit'>
              Change Password
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

export default ResetPassword;
