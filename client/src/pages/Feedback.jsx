import { Alert, Button, Label, Spinner, TextInput, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'mongoose';




export default function Feedback() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pubishError, setPublishError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/feedback/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();  
      if (!res.ok) {
        setPublishError(data.message);
      } 
      
      if (res.ok){
        setPublishError(null)
        navigate('/feedback/feedbackSuccess');
      }
        
    } catch (error) {
      setPublishError('Failed to publish feedback');
    }
  }  
  
  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left */}
        <div className='flex-1'>
        <Link
        to="/"
        className="font-bold dark:text-white text-4xl"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          SINGHE
        </span>
        AUTO
      </Link>
      <p className='text-sm mt-5'>
        Welcome to Singhe Auto. Please give a feedback about our services.
      </p>
        </div>

        {/* Right */}
        <div className='flex-1'>
          <div className='p-6 text-center'><h1 className='dark:text-white text-3xl font-semibold'>Give Your Honnest Feedback Here</h1></div>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <Label value= 'Your Name'/>
            <div> 
              <TextInput
                defaultValue={currentUser.fullName}
                id='currentUser' onChange={(e) => setFormData({...formData, currentUser: currentUser.username})}/>
            </div>

            <Label value= 'Your Feedback'/>
            <div> 
              <Textarea className='h-40'
                type='text'
                placeholder='Write your feedback here'
                id='feedback' onChange={(e)=> setFormData({...formData, feedback:e.target.value})}/>
            </div>
            
            <Button className='' gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                          <><Spinner size='sm'/>
                          <span className='pl-3'>Looding...</span></>
                          ) : ('Submit Feedback')}
            </Button>
            {pubishError && <Alert className='mt-5' color='failure'>{pubishError}</Alert>}
          </form>
        
        </div>

      </div>
    </div>
  );
}

