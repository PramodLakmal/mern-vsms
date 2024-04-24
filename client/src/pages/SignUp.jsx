import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'


export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill in all fields') 
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left */}
        <div className='flex-1'>
        <span className="px-2 py-1">
        <img src="https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/Logo%20and%20Other%2FSighe%20Auto.png?alt=media&token=95f727f5-dfdf-4d56-be9e-b4eabd8cf42d" alt="logo" />
        </span>
      <p className='text-sm mt-5'>
        Welcome to Singhe Auto. Please sign up to continue.
      </p>
        </div>
        {/* Right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

          <div>
              <Label value= 'Your Full Name'/>
              <TextInput
                type='text'
                placeholder='Full Name'
                id='fullName' onChange={handleChange}/>
            </div>
    
            <div>
              <Label value= 'Your username'/>
              <TextInput
                type='text'
                placeholder='Username'
                id='username' onChange={handleChange}/>
            </div>
            <div>
              <Label value= 'Your email'/>
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'  onChange={handleChange}/>
            </div>
            <div>
              <Label value= 'Your Phone Number'/>
              <TextInput
                type='phone'
                placeholder='07xxxxxxxx'
                id='phoneNumber' onChange={handleChange}/>
            </div>
            <div>
              <Label value= 'Your Address'/>
              <TextInput
                type='text'
                placeholder='Address'
                id='address' onChange={handleChange}/>
            </div>
            
            <div>
              <Label value= 'Your password'/>
              <TextInput
                type='password'
                placeholder='Password'
                id='password' onChange={handleChange}/>
            </div>
            <Button gradientMonochrome="failure" type='submit' disabled={loading}>
              {
                loading ? (
                          <><Spinner size='sm'/>
                          <span className='pl-3'>Looding...</span></>
                          ) : 'Sign up'}
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5 mb-10'>
            <span>
              Have an account?
            </span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign in
            </Link>
          </div>
          {
            errorMessage && 
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          }
        </div>

      </div>
    </div>
  )
}
