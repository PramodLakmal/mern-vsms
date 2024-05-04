import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
            setShowModal(false);
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDownloadCSVReport = async () => {
    try {
      const response = await fetch("/api/user/csv-report");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_report.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV report:", error);
    }
  };

  const handleDownloadPDFReport = async () => {
    try {
      const response = await fetch("/api/user/pdf-report");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF report:", error);
    }
  };

  const generateUserReport = () => {
    try {
        const doc = new jsPDF(); // Initialize jsPDF
        doc.setFontSize(11);
        doc.text('Users Report', 10, 10);

        // Add table header row
        const headerCols = [
            'User ID', 'Username', 'Fullname', 'Email', 'Admin', 'CuS Agent'
        ];
        const headerRowHeight = 5;
        const headerYPos = 15;

        const tableBody = users.map(user => ([
            user._id , user.username, user.fullName, user.email, user.isAdmin, user.isCustomerServiceAgent
        ]));
        autoTable(doc, {
            head: [headerCols],
            body: tableBody,
            startY: headerYPos + headerRowHeight,
            styles: { overflow: 'linebreak' },
            columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 24 }, 2: { cellWidth: 35 }, 3: { cellWidth: 47 }, 4: { cellWidth: 16 }, 5: { cellWidth: 18 } },
            margin: { top: headerYPos + headerRowHeight + 5 }
        });

        

        // Calculate the end Y position of the table manually
        const endY = headerYPos + doc.previousAutoTable.finalY;

        // Add additional report information (optional)
        const additionalInfoYPos = endY + 5;
        doc.text('Report generated on:', 8, additionalInfoYPos);
        doc.text(new Date().toLocaleDateString(), 50, additionalInfoYPos);

        // Save or download the report
        doc.save('users_report.pdf');
    } catch (error) {
        console.error('Error generating users report:', error);
    }
};

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify gap-80'>
      <input
        type="text"
        placeholder="Search by username"
        value={searchQuery}
        onChange={handleSearch}
        className="p-2 mb-4 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white border-gray-300 bg-white text-black"
      />
      
      <span className="text-sm text-gray-500 dark:text-gray-400"><button
                 type="button"
                 className="outline-red-500 hover:bg-red-300 outline  font-bold py-2 px-4 rounded flex items-center ml-80"
                 onClick={generateUserReport}
                >
                   <FiDownload className="mr-2" />
                  Generate Users Report
         </button></span>
      </div>
      


      {currentUser.isAdmin && users.length > 0 ? (
        
        <>
          <Table hoverable className='shadow-md mt-5' id='users'>
            <Table.Head>
              <Table.HeadCell className='text-center'>Date created</Table.HeadCell>
              <Table.HeadCell className='text-center'>User image</Table.HeadCell>
              <Table.HeadCell className='text-center'>Username</Table.HeadCell>
              <Table.HeadCell className='text-center'>Email</Table.HeadCell>
              <Table.HeadCell className='text-center'>Admin</Table.HeadCell>
              <Table.HeadCell className='text-center'>CuS Agent</Table.HeadCell>
              <Table.HeadCell className='text-center'>Delete</Table.HeadCell>
            </Table.Head>
            {filteredUsers.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 text-center'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full mx-auto'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500 mx-auto' />
                    ) : (
                      <FaTimes className='text-red-500 mx-auto' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isCustomerServiceAgent ? (
                      <FaCheck className='text-green-500 mx-auto' />
                    ) : (
                      <FaTimes className='text-red-500 mx-auto' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer mx-auto'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
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
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
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
