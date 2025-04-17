"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get('page') || 1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get<ProductsResponse>(`/products?page=${currentPage}&limit=${meta.limit}`);
        setProducts(response.data.data);
        setMeta(response.data.meta);
        console.log('Products fetched:', response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, meta.limit]);

  const handlePageChange = (page: number) => {
    router.push(`/products?page=${page}`);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    if (meta.pages <= 1) return null;

    const pageButtons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(meta.pages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pageButtons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 mr-2 disabled:opacity-50 text-black font-bold"
      >
        &laquo;
      </button>
    );

    // First page button if not starting from page 1
    if (startPage > 1) {
      pageButtons.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded border border-gray-300 mr-2 text-black"
        >
          1
        </button>
      );
      
      // Ellipsis if there's a gap
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="px-2">...</span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded mr-2 ${
            currentPage === i
              ? 'bg-[#1c219e] text-white'
              : 'border border-gray-300 text-black'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page button if not ending at the last page
    if (endPage < meta.pages) {
      // Ellipsis if there's a gap
      if (endPage < meta.pages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="px-2">...</span>
        );
      }
      
      pageButtons.push(
        <button
          key={meta.pages}
          onClick={() => handlePageChange(meta.pages)}
          className="px-3 py-1 rounded border border-gray-300 mr-2 text-black"
        >
          {meta.pages}
        </button>
      );
    }

    // Next button
    pageButtons.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(meta.pages, currentPage + 1))}
        disabled={currentPage === meta.pages}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-black font-bold"
      >
        &raquo;
      </button>
    );

    return (
      <div className="flex justify-center mt-8">
        {pageButtons}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          {isAuthenticated && (
            <Link href="/products/create">
              <Button className="bg-[#1c219e] hover:bg-[#141679]">
                Add New Product
              </Button>
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1c219e]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">There are no products available at the moment.</p>
            {isAuthenticated && (
              <Link href="/products/create">
                <Button className="bg-[#1c219e] hover:bg-[#141679]">
                  Be the first to add a product
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product._id} href={`/products/${product._id}`}>
                  <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="relative h-48 w-full bg-gray-200">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-[#1c219e] font-bold mb-2">${(product.price/100).toFixed(2)}</p>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        {/* <span className="text-xs text-gray-500">
                          By {product.seller?.name}
                        </span> */}
                        {/* <span className="text-xs text-gray-500">
                          {product.createdAt && new Date(product.createdAt).toLocaleDateString()}
                        </span> */}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {renderPagination()}
            
            {/* Products count */}
            <div className="text-center text-gray-500 mt-4">
              Showing {products.length} of {meta.total} products
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}