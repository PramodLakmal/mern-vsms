import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure  } from '../redux/user/userSlice';


export default function ForgotPassword() {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields.'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if(res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
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
                id='email'  onChange={handleChange}/>
            </div>
            
            <Button gradientMonochrome="failure" type='submit' disabled={loading}>
              {
                loading ? (
                          <><Spinner size='sm'/>
                          <span className='pl-3'>Loading...</span></>
                          ) : ('Send')}
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
}

