import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import NewsImage from '../public/top-bar-image.png';

const News = () => {
  const [notices, setNotices] = useState([]);
  const [comments, setComments] = useState({}); // State to hold comments for each notice
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState(""); // State to hold the comment
  const [currentNoticeId, setCurrentNoticeId] = useState(null); // State to hold the ID of the current notice being commented
  const [replyCommentId, setReplyCommentId] = useState(null); // State to hold the ID of the comment being replied to

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/notice/all");
      if (!response.ok) {
        throw new Error(`Error fetching notices: ${response.statusText}`);
      }
      const data = await response.json();
      setNotices(data.notices || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Error fetching notices. Please try again later.");
    }
  };

  const handleLike = (noticeId) => {
    const updatedNotices = notices.map(notice => {
      if (notice._id === noticeId) {
        return {
          ...notice,
          likes: notice.likes ? notice.likes + 1 : 1
        };
      }
      return notice;
    });
    setNotices(updatedNotices);
  };

  const handleOpenModal = (noticeId, commentId = null) => {
    setCurrentNoticeId(noticeId);
    setReplyCommentId(commentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setComment(""); // Reset comment state when modal is closed
    setReplyCommentId(null); // Reset reply comment id
  };

  const handleSubmitComment = () => {
    if (comment.trim() === "") {
      toast.error("Comment cannot be empty.");
      return;
    }
    if (replyCommentId) {
      // Reply to a comment
      setComments(prevComments => ({
        ...prevComments,
        [currentNoticeId]: prevComments[currentNoticeId].map(c => {
          if (c._id === replyCommentId) {
            return {
              ...c,
              replies: [...(c.replies || []), comment]
            };
          }
          return c;
        })
      }));
    } else {
      // Add a new comment
      setComments(prevComments => ({
        ...prevComments,
        [currentNoticeId]: [...(prevComments[currentNoticeId] || []), { _id: Date.now(), content: comment }]
      }));
    }
    handleCloseModal(); // Close the modal after submitting the comment
  };

  return (
    <div className="flex justify-center"> {/* Centering the content */}
      <div>
        <div className="bg-gradient-to-b from-red-600 to-gray-200 w-full" style={{ height: '450px' }}>
          <img src={NewsImage} alt="News Bar" className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto p-5">
          <ToastContainer />

          <h1 className="text-4xl font-bold text-black mb-1 text-center">Latest News</h1>
          <p className="text-gray-600 mb-5 text-center">Stay updated with our latest announcements</p> {/* Subtitle */}

          {notices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300"
                >
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      {notice.Title}
                    </h2>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-gray-600">{notice.Date}</p>
                      <p className="text-sm text-gray-500">Type: {notice.NoticeType}</p>
                    </div>
                    <p className="mb-3">{notice.Description}</p>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleLike(notice._id)}
                        className="mr-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Like {notice.likes && `(${notice.likes})`}
                      </button>
                      <button
                        onClick={() => handleOpenModal(notice._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Comment
                      </button>
                    </div>
                    {/* Render comments */}
                    {comments[notice._id] && comments[notice._id].map((comment) => (
                      <div key={comment._id} className="mt-3 border-t pt-3">
                        <p className="font-bold">{comment.content}</p>
                        {comment.replies && comment.replies.map((reply, index) => (
                          <p key={index} className="ml-4">{reply}</p>
                        ))}
                        <button
                          onClick={() => handleOpenModal(notice._id, comment._id)}
                          className="text-blue-500 hover:text-blue-700 font-bold cursor-pointer mt-1"
                        >
                          Reply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white">No notices found</p>
          )}

          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Comment Modal"
          >
            <h2>{replyCommentId ? "Reply to Comment" : "Add a Comment"}</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Write your comment here..."
            />
            <div className="flex justify-end">
              <button onClick={handleCloseModal} className="mr-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
              <button onClick={handleSubmitComment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {replyCommentId ? "Reply" : "Comment"}
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default News;
