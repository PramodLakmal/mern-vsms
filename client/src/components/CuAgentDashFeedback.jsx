import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';



export default function CuAgentDashFeedback() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackIdToDelete, setFeedbackIdToDelete] = useState(null);
  console.log(feedbacks);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`/api/feedback/getfeedbacks?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data.feedbacks);
          
        }
      } catch (error) {
        console.log('Failed to fetch feedbacks');
      }
    }
    if (currentUser.isCustomerServiceAgent) {
      fetchFeedbacks();
    }
  }, [currentUser]);


  const handleDeleteFeedback = async (feedbackId) => {
    setShowModal(false);
    try {
        const res = await fetch(`/api/feedback/deletefeedbacks/${feedbackIdToDelete}`, {
            method: 'DELETE',
        });
        const data = await res.json();

        if (res.ok) {
            setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== feedbackIdToDelete));
            setShowModal(false);
            
        }
        else {
          console.log(data.message);
      }
    } catch (error) {
        console.log(error.message);
    }

  };




  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isCustomerServiceAgent && (
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell className='text-center'>Date</Table.HeadCell>
            <Table.HeadCell className='text-center'>Customer Username</Table.HeadCell>
            <Table.HeadCell className='text-center'>Feedback</Table.HeadCell>
            <Table.HeadCell className='text-center'></Table.HeadCell>
          </Table.Head>
          
            {feedbacks.map((feedback) => (
              <Table.Body className='divide-y'>
              <Table.Row key={feedback._id}  className='bg-white dark:border-gray-700 dark:bg-gray-800'>
              <Table.Cell className='text-center'> {new Date(feedback.createdAt).toLocaleDateString()} </Table.Cell>
                <Table.Cell className='text-center'> {feedback.currentUser} </Table.Cell>
                <Table.Cell className='text-center'> {feedback.feedback} </Table.Cell>
                <Table.Cell className='text-center'> <span
                      onClick={() => {
                        setShowModal(true);
                        setFeedbackIdToDelete(feedback._id);

                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer mx-auto'
                    >
                      Delete
                    </span> </Table.Cell>
              </Table.Row>
              </Table.Body>
            ))}
          
        </Table>
        </>
        
      )}

<Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this feedback?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteFeedback}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
  }
