import React from 'react'
import {Button} from 'flowbite-react'
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='min-h-screen dark:text-white text-3xl font-semibold text-center mt-10'>
      Home
      <div >
      <form className='flex border border-teal-500 rounded-md p-5 ml-80 mr-10 mt-60 size-fit'>
      <h1 className='dark:text-white text-2xl font-semibold text-center ml-20'>Give Your Honnest Feedback Here</h1>
      <Link to={'/feedback'}>
      <Button type='button' size='lg' gradientDuoTone='purpleToBlue' className='ml-40 text-center'>
         Feedbacks
        </Button> </Link>
      </form>
        
      </div>
      </div>
  )
}
