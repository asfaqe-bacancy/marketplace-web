
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await api.delete(`/products/${id}`);
      router.push('/');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again later.');
      setDeleteLoading(false);
    }
  };

  const isOwner = user && product && user?._id === product?.seller?._id;

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1c219e]"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <Button onClick={() => router.push('/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            Product not found
          </div>
          <Button onClick={() => router.push('/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/products')}
            className="text-gray-600"
          >
            ← Back to Products
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-full w-full bg-gray-200">
                {product?.imageUrl ? (
                  <Image
                    src={product?.imageUrl}
                    alt={product?.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
              <p className="text-2xl font-bold text-[#1c219e] mb-4">${product?.price.toFixed(2)}</p>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{product?.description}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Seller Information</h2>
                <p className="text-gray-600">{product?.seller?.name}</p>
                <p className="text-gray-600">{product?.seller?.email}</p>
              </div>
              
              <div className="text-sm text-gray-500 mb-6">
                Listed on {new Date(product?.createdAt).toLocaleDateString()}
              </div>
              
              // In the JSX where the delete button is rendered:
               
                <div className="flex space-x-4">
                  <Link href={`/products/${product?._id}/edit`} className="flex-1">
                    <Button className="w-full bg-[#1c219e] hover:bg-[#141679]">
                      Edit Product
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                    isLoading={deleteLoading}
                  >
                    Delete Product
                  </Button>
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}