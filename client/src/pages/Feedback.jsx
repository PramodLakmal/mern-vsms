import { Alert, Button, Label, Spinner, TextInput, Textarea, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'mongoose';
import FeedbackCompo from '../components/FeedbackCompo';
import { HiOutlineExclamationCircle } from 'react-icons/hi';



export default function Feedback() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pubishError, setPublishError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthFeedbacks, setLastMonthFeedbacks] = useState(0);
    const [userFeedbacks, setUserFeedbacks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  console.log(feedback);

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
        navigate('/feedbackSuccess');
      }
        
    } catch (error) {
      setPublishError('Failed to publish feedback');
    }
  }; 

  useEffect(() => {
    const getFeedback = async () => {
      try {
        const res = await fetch('/api/feedback/getfeedbacks');
        const data = await res.json();
        setFeedback(data);
      } catch (error) {
        setPublishError('Failed to fetch feedbacks');
      }
  }});

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/user/getusers?limit=5`);
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
                setTotalUsers(data.totalUsers);
                setLastMonthUsers(data.lastMonthUsers);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    if (currentUser.isAdmin) {
        fetchUsers();
    }

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch(`/api/feedback/getfeedbacks`);
            const data = await res.json();
            if (res.ok) {
                setFeedbacks(data.feedbacks);
                setTotalFeedbacks(data.totalFeedbacks);
                setLastMonthFeedbacks(data.lastMonthFeedbacks);
                setUserFeedbacks(data.feedbacks);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

   
        fetchFeedbacks();
    


}, [currentUser]); 

const handlefeedback = async (feedback, editedFeedback) => {
  setFeedbacks(feedbacks.map((f) => f._id === feedback._id ? {...f, feedback: editedFeedback} : f));
}

const handleDelete = async (feedbackId) => {
  setShowModal(false);
  try {
      const res = await fetch(`/api/feedback/deletefeedbacks/${feedbackId}`, {
          method: 'DELETE',
      });
      if (res.ok) {
          setFeedbacks(feedbacks.filter((f) => f._id !== feedbackId));
      }
  } catch (error) {
      console.log(error.message);
  }
};
  
  return (
    <div className='mt-0'>
      <div className='flex max-w-500 mx-auto flex-col md:flex-row md:items-center'>
        {/* Left */}
        <div className='flex-1'>
        <span className="">
        <img src={"https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/Logo%20and%20Other%2FService%20Feedback.png?alt=media&token=1f7e2a50-170b-41c7-a8b4-dd04902aa9da"} alt="Preview" style={{ maxWidth: '100%', maxHeight: '570px', width: '670px', height: '1500px' }} className="object-cover" />
        </span>
      
        </div>

        {/* Right */}
        <div className='flex-1'>
          <div className='p-6 text-center'><h1 className='dark:text-white text-3xl font-semibold'>Give Your Honnest Feedback Here</h1></div>
          <form className='flex flex-col gap-4 border border-red-500 rounded-md p-8 mr-5' onSubmit={handleSubmit}>
          <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                <p>sign in as: </p>
                <img className="h-5 w-5 object-cover rounded-full" src= {currentUser.profilePicture} alt=""  />
                <Link to ={"/dashboard?tab=profile"} className='text-xs text-cyan-500 hover:underline'>
                     @{currentUser.username}
                </Link>
            </div>
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
            
            <Button className='' gradientMonochrome="failure" type='submit' disabled={loading}>
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
          
        {feedback === 0 ? (
          <p>No feedbacks yet</p>
        ) : (
          <>
          <div className='text-sm my-8 flex items-center gap-2 justify-center mt-20'>
            <p className='font-bold'>Total Feedbacks</p>
            <div className='border border-red-400 font-bold py-1 px-2 text-lg rounded-sm'>
            <p>{totalFeedbacks}</p>
            </div>
         </div>

            {feedbacks.map((feedback) => (
              <FeedbackCompo key={feedback} feedback={feedback} onEdit={handlefeedback}  onDelete={(feedbackId) => {
                setShowModal(true);
                setFeedbackToDelete(feedbackId);
              }}/>
            ))
            }
            
          </>
          

        )
        }

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
              <Button
                color='failure'
                onClick={() => handleDelete(feedbackToDelete)}
              >
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
    
    
  );
  

}

