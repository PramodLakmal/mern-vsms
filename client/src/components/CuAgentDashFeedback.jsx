import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';


export default function CuAgentDashFeedback() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  console.log(userFeedbacks);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`/api/feedback/getfeedbacks?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserFeedbacks(data.feedbacks);
        }
      } catch (error) {
        console.log('Failed to fetch feedbacks');
      }
    }
    if (currentUser.isCustomerServiceAgent) {
      fetchFeedbacks();
    }
  }, [currentUser._id]);
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isCustomerServiceAgent && (
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell className='text-center'>Date</Table.HeadCell>
            <Table.HeadCell className='text-center'>Customer Username</Table.HeadCell>
            <Table.HeadCell className='text-center'>Feedback</Table.HeadCell>
          </Table.Head>
          
            {userFeedbacks.map((feedback) => (
              <Table.Body className='divide-y'>
              <Table.Row key={feedback._id}  className='bg-white dark:border-gray-700 dark:bg-gray-800'>
              <Table.Cell className='text-center'> {new Date(feedback.createdAt).toLocaleDateString()} </Table.Cell>
                <Table.Cell className='text-center'> {feedback.currentUser} </Table.Cell>
                <Table.Cell className='text-center'> {feedback.feedback} </Table.Cell>
              </Table.Row>
              </Table.Body>
            ))}
          
        </Table>
        </>
        
      )}
    </div>
  )
            }
