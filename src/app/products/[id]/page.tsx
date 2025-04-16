"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .typeError('Price must be a number'),
  category: Yup.string().required('Category is required'),
});

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/${params.id}`);
        setProduct(response.data);
        if (response.data.imageUrl) {
          setImagePreview(response.data.imageUrl);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setError('');
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price.toString());
      formData.append('description', values.description);
      formData.append('category', values.category);
      
      if (values.image) {
        formData.append('image', values.image);
      }
      
      await api.updateProductWithImage(params.id, formData);
      setIsEditing(false);
      
      // Refresh product data
      const response = await api.get(`/products/${params.id}`);
      setProduct(response.data);
      if (response.data.imageUrl) {
        setImagePreview(response.data.imageUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsDeleting(true);
        await api.deleteProduct(params.id);
        router.push('/');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (error || !product) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-xl font-bold text-red-600 mb-2">Error</h1>
              <p className="text-gray-700">{error || 'Product not found'}</p>
              <Button
                onClick={() => router.push('/')}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                Back to Products
              </Button>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
          {isEditing ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
              </div>

              {error && (
                <div className="p-3 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <Formik
                initialValues={{
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  category: product.category || '',
                  image: null,
                }}
                validationSchema={ProductSchema}
                onSubmit={handleUpdate}
              >
                {({ isSubmitting, errors, touched, setFieldValue }) => (
                  <Form className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
                        Product Name
                      </label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium mb-1 text-gray-700">
                        Price ($)
                      </label>
                      <Field
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.price && touched.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="price" component="p" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700">
                        Category
                      </label>
                      <Field
                        id="category"
                        name="category"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.category && touched.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <ErrorMessage name="category" component="p" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Product Image
                      </label>
                      <div className="mt-1 flex items-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {imagePreview ? 'Change Image' : 'Add Image'}
                        </button>
                        {imagePreview && (
                          <span className="ml-4 text-sm text-gray-500">Image selected</span>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-40 w-auto object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-300 text-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {isSubmitting ? <LoadingSpinner size="sm" color="border-white" /> : 'Update Product'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {isDeleting ? <LoadingSpinner size="sm" color="border-white" /> : 'Delete'}
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-80 object-cover"
                        // onError={(e) => {
                        //   (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
                        // }}
                      />
                    ) : (
                      <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-500 flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="mt-2">No image available</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-3xl font-bold text-blue-600 mb-4">
                      ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    
                    {product.category && (
                      <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                      <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                    </div>
                    
                    <div className="mt-8">
                      <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                      >
                        Back to Products
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}