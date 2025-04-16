"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .typeError('Price must be a number'),
  category: Yup.string().required('Category is required'),
});

export default function CreateProductPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

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

  const handleSubmit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
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
      
      await api.uploadProductWithImage(formData);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Product</h1>

          {error && (
            <div className="p-3 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Formik
            initialValues={{
              name: '',
              description: '',
              price: '',
              category: '',
              image: null,
            }}
            validationSchema={ProductSchema}
            onSubmit={handleSubmit}
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
                      Choose Image
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
                    onClick={() => router.push('/')}
                    className="border-gray-300 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" color="border-white" /> : 'Create Product'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}