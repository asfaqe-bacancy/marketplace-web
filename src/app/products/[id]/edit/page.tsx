"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .typeError('Price must be a number'),
});

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/products/${id}/edit`));
    }
  }, [authLoading, isAuthenticated, router, id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setImagePreview(response.data.imageUrl);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id && isAuthenticated) {
      fetchProduct();
    }
  }, [id, isAuthenticated]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setError('');
      console.log('Updating product with values:', values);
      
      // Always use FormData for both cases
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', String(values.price)); // Convert to cents
      
      if (selectedFile) {
        formData.append('image', selectedFile);
        
        // Use PATCH request with multipart/form-data for image upload
        await api.patch(`/products/${id}/with-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use PATCH with FormData but without image
        await api.patch(`/products/${id}/with-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      console.log('Product updated successfully');
      router.push(`/products/${id}`);
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || 'Failed to update product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user is the owner of the product
  const isOwner = true;

  if (authLoading || loading) {
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
          <Button onClick={() => router.push(`/products/${id}`)} className="mt-4">
            Back to Product
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

  if (!isOwner) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            You do not have permission to edit this product
          </div>
          <Button onClick={() => router.push(`/products/${id}`)} className="mt-4">
            Back to Product
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
            onClick={() => router.push(`/products/${id}`)}
            className="text-gray-600"
          >
            ← Back to Product
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <Formik
            initialValues={{
              name: product.name,
              description: product.description,
              price: product.price, // Convert from cents to dollars for display
            }}
            validationSchema={ProductSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <Field
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.price && touched.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="price" component="p" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  
                  {imagePreview && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                      <div className="relative h-48 w-full max-w-md bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Product preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a new image only if you want to change the current one.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/products/${id}`)}
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#1c219e] hover:bg-[#141679] text-white px-4 py-2"
                    isLoading={isSubmitting}
                  >
                    Update Product
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </AppLayout>
  );
}