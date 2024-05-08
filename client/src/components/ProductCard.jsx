import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className='group relative w-[300px] border border-teal-500 hover:border-2 h-[420px] overflow-hidden rounded-lg transition-all'>
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt='post cover'
          className='h-[220px] w-full object-cover group-hover:h-[160px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-1'>
        <p className='text-lg font-semibold line-clamp-2'>{product.title}</p>
        <span className='text-slate-500 mt-1 mb-2 font-semibold'>Category : {product.category}</span>
        <div className='text-slate-700 flex gap-4'>
          <div className='font-bold text-xs'>
            Price : LKR 
            {product.itemPrice}                
          </div>

          <div className='font-bold text-xs'>
            Quantity :
            {product.itemQuantity}
          </div>
        </div>
        
        <Link
          to={`/product/${product._id}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-180px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
        View
        </Link>
      </div>
    </div>
  );
}
