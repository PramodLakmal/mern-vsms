import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, Button, Spinner } from 'flowbite-react';
import ProductCard from '../components/ProductCard'; // Assuming you have a ProductCard component

export default function ProductPage() {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [product, setProduct] = useState(null);
  const [recentProducts, setRecentProducts] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/getproduct/${productId}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        setError(true);
        console.error('Error fetching product:', error); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const res = await fetch(`/api/product/getproducts?limit=4`);
        const data = await res.json();
        if (res.ok) {
          setRecentProducts(data.products);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchRecentProducts();
  }, []);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Alert color='failure'>Error occurred while fetching product data.</Alert>
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      {product && (
        <React.Fragment>
          <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
            {product.title}
          </h1>
          <Link
            to={`/search?category=${product.category}`}
            className='self-center mt-5'
          >
            <Button color='gray' pill size='xs'>
              {product.category}
            </Button>
          </Link>
          <img
            src={product.image}
            alt={product.title}
            className='mt-10 p-3 max-h-[600px] w-full object-cover'
          />

          <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
            <span className='text-lg font-semibold line-clamp-2'>
              Created at - {new Date(product.createdAt).toLocaleDateString()}
            </span>
            <span className='text-lg font-semibold line-clamp-2'>Price : LKR {product.itemPrice}</span>
            <span className='text-lg font-semibold line-clamp-2'>Quantity : {product.itemQuantity}</span>
          </div>

          <div
            className='p-3 max-w-2xl mx-auto w-full post-content'
            dangerouslySetInnerHTML={{ __html: product.content }}
          ></div>

          <Link to='/inventory' className='self-center mt-5'>
            <Button color='gray' pill size='xs'>
              Back
            </Button>
          </Link>
        </React.Fragment>
      )}

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recently added items.....</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentProducts &&
            recentProducts.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </div>
    </main>
  );
}
