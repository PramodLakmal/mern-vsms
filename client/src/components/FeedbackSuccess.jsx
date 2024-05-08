import React from 'react'
import { Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiHome } from 'react-icons/hi'

export default function FeedbackSuccess() {
  return (
    <div className='min-h-screen'>
        <div className=' text-center font-bold text-5xl mx-auto mt-20 '>Feedback Success!!!</div>
        <div className='text-center mt-5'>
          <p className='text-lg font-medium'>Thank you for your Honest feedback</p>
          <Link
            to="/">
            <Button type='button' size={'xl'} gradientDuoTone='pinkToOrange' className=' ml-auto mr-auto mt-20 font-bold'>
            <HiHome className="mr-2 h-5 w-5" />
                    Back to Home
            </Button>
        </Link>
    </div>
    </div>
    
  )
}

