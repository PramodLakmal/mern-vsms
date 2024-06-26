import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure  } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.email || !formData.password) {
      return setErrorMessage('Please fill in all fields.');
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
    <div className='mt-0'>
      <div className='flex max-w-500 mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left */}
        <div className='flex-1'>
        <span className="">
        <img src={"https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/Logo%20and%20Other%2Fportrait-mechanic-checking-car-parts.jpg?alt=media&token=67ef11ad-db19-418c-96ed-b9a489b7bfc6"} alt="Preview" style={{ maxWidth: '100%', maxHeight: '600px', width: '1500px', height: '1500px' }} className="object-cover" />
        </span>
      
        </div>
        {/* Right */}
        <div className='flex-1 p-4 max-w-xl mr-40 ml-40 mb-10'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <p className='font-bold text-2xl text-center mb-5'>Welcome Back to Sighe Automotive</p>
            <div>
              <Label value= 'Your email'/>
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'  onChange={handleChange}/>
            </div>
            <div>
              <Label value= 'Your password'/>
              <TextInput
                type='password'
                placeholder='***************'
                id='password' onChange={handleChange}/>
            </div>
            <div className='text-sm'>
              <Link to='/forgot-password' className='text-blue-500 hover:underline'>
                Forgot Password?
              </Link>
            </div>
            <Button gradientMonochrome="failure" type='submit'>
              Sign In
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>
              Don't Have an account?
            </span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
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
