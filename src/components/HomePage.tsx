"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from './AppLayout';
import api from '@/lib/api';
import Button from './ui/Button';
import ProductCard from './ui/ProductCard';
import LoadingSpinner from './ui/LoadingSpinner';
import EmptyState from './ui/EmptyState';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get('page') || 1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ProductsResponse>(`/products?page=${currentPage}&limit=${meta.limit}`);
        setProducts(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, meta.limit]);

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
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
      <Button
        key="prev"
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1"
      >
        &laquo;
      </Button>
    );

    // First page button if not starting from page 1
    if (startPage > 1) {
      pageButtons.push(
        <Button
          key="1"
          variant={currentPage === 1 ? "primary" : "outline"}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1"
        >
          1
        </Button>
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
        <Button
          key={i}
          variant={currentPage === i ? "primary" : "outline"}
          onClick={() => handlePageChange(i)}
          className="px-3 py-1"
        >
          {i}
        </Button>
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
        <Button
          key={meta.pages}
          variant={currentPage === meta.pages ? "primary" : "outline"}
          onClick={() => handlePageChange(meta.pages)}
          className="px-3 py-1"
        >
          {meta.pages}
        </Button>
      );
    }

    // Next button
    pageButtons.push(
      <Button
        key="next"
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === meta.pages}
        className="px-3 py-1"
      >
        &raquo;
      </Button>
    );

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {pageButtons}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <Button
            onClick={() => router.push('/products/create')}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Product
          </Button>
        </div>
        
        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : products.length === 0 ? (
          <EmptyState 
            message="No products available" 
            buttonText="Create Your First Product"
            onButtonClick={() => router.push('/products/create')}
            icon={
              <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product._id}
                  product={product}
                  onClick={() => handleProductClick(product._id)}
                />
              ))}
            </div>
            
            {renderPagination()}
            
            <div className="mt-4 text-center text-sm text-gray-600 font-medium">
              Showing {products.length} of {meta.total} products
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}