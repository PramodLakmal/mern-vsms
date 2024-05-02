import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product/getproducts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserProducts(data.products);
          if (data.products.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchProducts();
    }
  }, [currentUser._id]);

  useEffect(() => {
    // Filter products based on search query
    const filtered = userProducts.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, userProducts]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleShowMore = async () => {
    const startIndex = userProducts.length;
    try {
      const res = await fetch(
        `/api/product/getproducts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserProducts((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const generateProductReport = () => {
    try {
      const doc = new jsPDF(); // Initialize jsPDF
      doc.setFontSize(11);
      doc.text('Products Report', 10, 10);

      // Add table header row
      const headerCols = [
        'Date Updated', 'Title', 'Category', 'Price', 'Quantity'
      ];
      const headerRowHeight = 5;
      const headerYPos = 15;

      const tableBody = userProducts.map(product => ([
        new Date(product.updatedAt).toLocaleDateString(),
        product.title,
        product.category,
        product.itemPrice,
        product.itemQuantity
      ]));
      autoTable(doc, {
        head: [headerCols],
        body: tableBody,
        startY: headerYPos + headerRowHeight,
        styles: { overflow: 'linebreak' },
        margin: { top: headerYPos + headerRowHeight + 5 }
      });

      // Calculate the end Y position of the table manually
      const endY = headerYPos + doc.previousAutoTable.finalY;

      // Add additional report information (optional)
      const additionalInfoYPos = endY + 5;
      doc.text('Report generated on:', 8, additionalInfoYPos);
      doc.text(new Date().toLocaleDateString(), 50, additionalInfoYPos);

      // Save or download the report
      doc.save('products_report.pdf');
    } catch (error) {
      console.error('Error generating products report:', error);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify-between items-center mb-5'>
        <Link to={'/create-product'}>
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            className='w-full'
          >
            Add Product
          </Button>
        </Link>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          <button
            type="button"
            className="outline-red-500 hover:bg-red-300 outline  font-bold py-2 px-4 rounded flex items-center ml-60"
            onClick={generateProductReport}
          >
              <FiDownload className="mr-2" />
              Generate Product Report
          </button>
        </span>

      </div>

      <div className="mb-'flex justify-between items-center mb-5  ">
        <input
          type="text"
          placeholder="Search name or category"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 mb-4 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white border-gray-300 bg-white text-black"
        />
      </div>
      
      {currentUser.isAdmin && (searchQuery ? filteredProducts.length > 0 : userProducts.length > 0) ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Update</Table.HeadCell>
            </Table.Head>
            {searchQuery ? (
              filteredProducts.map((product) => (
                <Table.Body className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className='w-20 h-10 object-cover bg-gray-500'
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className='font-medium text-gray-900 dark:text-white'
                        to={`/product/${product._id}`}
                      >
                        {product.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{product.category}</Table.Cell>
                    <Table.Cell>{product.itemPrice}</Table.Cell>
                    <Table.Cell>{product.itemQuantity}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setProductIdToDelete(product._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className='text-teal-500 hover:underline'
                        to={`/update-product/${product._id}`}
                      >
                        Update
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))
            ) : (
              userProducts.map((product) => (
                <Table.Body className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className='w-20 h-10 object-cover bg-gray-500'
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className='font-medium text-gray-900 dark:text-white'
                        to={`/product/${product._id}`}
                      >
                        {product.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{product.category}</Table.Cell>
                    <Table.Cell>{product.itemPrice}</Table.Cell>
                    <Table.Cell>{product.itemQuantity}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setProductIdToDelete(product._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className='text-teal-500 hover:underline'
                        to={`/update-product/${product._id}`}
                      >
                        Update
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))
            )}
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
        <p>No products found!</p>
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
              Are you sure you want to delete this product?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteProduct}>
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
