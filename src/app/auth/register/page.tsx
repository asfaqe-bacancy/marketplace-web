"use client";

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { requestNotificationPermission } from '@/lib/firebase';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [deviceToken, setDeviceToken] = useState<string | null>(null);

  // Get device token on component mount
  useEffect(() => {
    const getDeviceToken = async () => {
      try {
        await requestNotificationPermission();
        const token = localStorage.getItem('fcm_token');
        setDeviceToken(token);
      } catch (err) {
        console.error('Failed to get device token:', err);
        // Fallback to a default token
        setDeviceToken('web-app-token-' + Math.random().toString(36).substring(2, 15));
      }
    };

    getDeviceToken();
  }, []);

  const handleSubmit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setError('');
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        deviceToken: deviceToken || 'web-app-token'
      });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f2f2f2]">
      {/* Left side with blue background and logo */}
      <div className="hidden md:flex md:w-1/2 bg-[#1c219e] flex-col justify-between p-12">
        <div>
          <div className="text-white text-4xl font-bold mb-4">
            <span className="text-5xl">*</span>
          </div>
          <h1 className="text-white text-5xl font-bold mt-16 mb-4">
            Hello<br />Marketplace!👋
          </h1>
          <p className="text-white/80 text-lg mt-6 max-w-md">
            Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!
          </p>
        </div>
        <div className="text-white/60 text-sm">
          © 2023 Marketplace. All rights reserved.
        </div>
      </div>

      {/* Right side with register form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Marketplace</h2>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
              <p className="text-gray-600 mt-2">
                Already have an account? <Link href="/auth/login" className="text-[#1c219e] hover:underline">Sign in</Link>.
              </p>
            </div>

            {error && (
              <div className="p-3 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <Formik
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className={`w-full px-3 text-gray-800 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c219e]/50 placeholder-gray-400 ${
                        errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
s                      placeholder="your@email.com"
                      className={`w-full px-3 text-gray-800 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c219e]/50 placeholder-gray-400 ${
                        errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={`w-full text-gray-800 px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c219e]/50 placeholder-gray-400 ${
                        errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className={`w-full px-3  text-gray-800 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c219e]/50 placeholder-gray-400 ${
                        errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 bg-[#1c219e] text-white hover:bg-[#141679] rounded-md"
                    isLoading={isSubmitting}
                  >
                    Create Account
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}