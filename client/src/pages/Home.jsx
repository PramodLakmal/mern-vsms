import React from 'react'
import {Button} from 'flowbite-react'
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
    <div
      className="h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/home%2Fhero-bg.jpg?alt=media&token=361eb655-5d3d-4caf-b093-ea85503457e2")`,
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-1/2 p-10">
          <h1 className="text-4xl font-bold text-white mb-4">
          Auto Maintenance & Repair Service
          </h1>
          <p className="text-lg text-white mb-8">
            Get the best car service experience with our expert technicians and state-of-the-art equipment.
          </p>
          <button className="px-6 py-2 text-white bg-indigo-600 rounded-md shadow-md">
            Show Services
          </button>
        </div>
        <div className="w-1/2">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/home%2Fhero-banner.png?alt=media&token=5cb20325-2653-41e3-a61e-776cd0390bae"
            alt="Car Service Center"
            className="h-full w-full object-cover"
          />
        </div>
      </div>      
    </div>
    <div >
      <form className='flex border border-teal-500 rounded-md p-5 ml-auto mr-auto mt-10 mb-10 size-fit'>
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
