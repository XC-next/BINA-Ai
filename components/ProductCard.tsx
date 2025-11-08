
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="flex-shrink-0 w-56 bg-[#E6E0F0] dark:bg-[#22223B] rounded-2xl overflow-hidden shadow-[5px_5px_10px_#d8d4e1,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1e1e30,-5px_-5px_10px_#3a3a58] snap-start">
      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{product.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 h-10 overflow-hidden my-1">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-lg text-indigo-500 dark:text-indigo-400">{product.price}</span>
          <button className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-500 rounded-lg shadow-md hover:bg-indigo-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
