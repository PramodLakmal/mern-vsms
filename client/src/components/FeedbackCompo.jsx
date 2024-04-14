import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {Button, Textarea} from 'flowbite-react'
import momemnt from 'moment';



export default function FeedbackCompo({feedback, onEdit, onDelete}) {
    const [user, setUser] = useState({});
    const {currentUser} = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFeedback, setEditedFeedback] = useState(feedback.feedback);
    const [feedbacks, setFeedbacks] = useState([{}]);

    console.log(user);


    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`api/user/${feedback.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [feedback]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedFeedback(feedback.feedback);
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/feedback/editfeedbacks/${feedback._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback: editedFeedback }),
            });
            await res.json();
            if(res.ok){
                setIsEditing(false);
                onEdit(feedback, editedFeedback)
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

    
  return (
    <div className='flex p-5 border-b dark:border-gray-600 text-sm ml-10 mr-10'>
        <div className='flex-shrink-0 mr-5'> 
            <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
            <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}`: 'Anonymous User'}</span>
            <span className='text-gray-500 text-xs'> {momemnt(feedback.createdAt).fromNow()}</span>
            </div>
            <p className='text-gray-500 pb-2'>{feedback.feedback}</p>
        </div>
        {isEditing ? (
            <>
            <Textarea className='mb-2 me-40' value={editedFeedback} onChange={(e) => setEditedFeedback(e.target.value)}/>
            <div className='flex justify-end gap-2 text-xs size-9'>
                <Button type='button' size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}>
                    Save
                </Button>
                <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline onClick={() => setIsEditing(false)}>
                    Cancel
                </Button>
            </div>
            </>
            
        ) : (
            <>
        
        <div>
        {currentUser && currentUser._id === feedback.userId && (
        <div className='flex justify-end'>
            <button type='button' onClick={handleEdit} className='text-xs text-gray-500 hover:text-blue-500'>Edit</button>

            {!currentUser.isCustomerServiceAgent && (
            <div className='flex ml-2'>
            <button type='button' onClick={()=> onDelete(feedback._id)} className='text-xs text-gray-500 hover:text-red-500'>Delete</button>
            </div>
            )}
            
        </div>
         )}
         {currentUser.isCustomerServiceAgent && (
        <div className='flex justify-end'>
            <div className='flex ml-2'>
            <button type='button' onClick={()=> onDelete(feedback._id)} className='text-xs text-gray-500 hover:text-red-500'>Delete</button>
            </div>
            
        </div>
         )}
        </div></>
            
        )}
        
        
    </div>

    
  )
}
