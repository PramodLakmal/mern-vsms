import React from 'react'
import { useSelector } from 'react-redux';


export default function About() {
  const { theme } = useSelector(state => state.theme);
  return (
    <div className='min-h-screen text-center py-12 relative' style={{ backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/Logo%20and%20Other%2Fsideways-woman-working-car-service.jpg?alt=media&token=78d24795-8da5-4a2a-b4ff-816be5131ff4')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="absolute inset-0 bg-slate-900 opacity-70"></div>
      <div className="relative">
    <div className="flex justify-center items-center flex-col mb-10">
    
              <img src="https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/Logo%20and%20Other%2FSighe%20Auto%20dark.png?alt=media&token=b477e968-c373-42dd-ae91-51d9551c406e" alt="logo" />
            
      <h1 className="text-4xl font-bold text-center mb-4 text-white mt-5">About Us</h1>
    </div>
    <div className='max-w-2xl mx-auto'>
      <p className='text-white text-lg font-semibold text-center mb-6'>
        Singhe Automotive Company Private Limited is proud to introduce a comprehensive Vehicle Service Management System designed to streamline operations and enhance customer satisfaction. This innovative system integrates various functions to optimize service delivery, improve employee efficiency, and ensure seamless management of essential aspects of the automotive service center.
      </p>
      <p className='text-white text-lg font-semibold text-center mb-6'>
        The Customer & Feedback Management feature enables customers to easily schedule appointments, provide feedback on services received, and track their vehicle maintenance history. This promotes customer engagement and loyalty by offering a personalized experience tailored to their needs.
      </p>
      <p className='text-white text-lg font-semibold text-center mb-6'>
        The Employee Management function facilitates efficient scheduling, task assignment, and performance tracking of service technicians and staff, ensuring optimal resource utilization and enhancing overall service quality.
      </p>
      <p className='text-white text-lg font-semibold text-center mb-6'>
        Service & Emergency Service Management allows for the seamless handling of routine maintenance services as well as emergency assistance requests, ensuring timely responses to breakdowns or accidents, enhancing customer safety and satisfaction.
      </p>
      <p className='text-white text-lg font-semibold text-center mb-6'>
        The Appointment & Notice Management feature enables customers to schedule service appointments conveniently, receive notifications for upcoming appointments, and stay informed about service center updates and promotions.
      </p>
      <p className='text-white text-lg font-semibold text-center mb-6'>
        Supplier Management streamlines the procurement process by managing supplier information, orders, and inventory levels, ensuring timely availability of parts and supplies for efficient service operations.
      </p>
      <p className='text-white text-lg font-semibold text-center mb-6'>
        Inventory Management optimizes stock levels, tracks inventory movement, and minimizes wastage, ensuring that the service center operates smoothly and cost-effectively.
      </p>
      <p className='text-white text-lg font-semibold text-center mb-6'>
        Payment Management simplifies billing processes, tracks payments, and provides secure payment options for customers, enhancing convenience and transparency in financial transactions.
      </p>
      <p className='text-white text-lg font-semibold text-center mb-10'>
        Finance Management enables accurate tracking of income and expenses, reconciliation of bank transactions, and generation of financial reports for informed decision-making, ensuring financial stability and profitability for Singhe Automotive Pvt. Ltd.
      </p>
    </div>
    </div>
  </div>
    
  )
}
