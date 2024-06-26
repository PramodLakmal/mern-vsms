import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard'; // Assuming you have a ProductCard component

export default function Inventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => { 
      const res = await fetch('/api/product/getproducts'); // Adjust endpoint to fetch products
      const data = await res.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-4 p-12 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to our Product Section...</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of products available in our inventory.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          Find your products
        </Link>
      </div>
      

      <div className='max-w-6xl mx-auto p-8 flex flex-col gap-8 py-1 items-center mb-10'>
        {products && products.length > 0 && (
          <div className='flex flex-col gap-8'>
            <h2 className='text-2xl font-semibold text-center'>Recent products.....</h2>
            <div className='flex flex-wrap gap-8 justify-center'>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
