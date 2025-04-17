"use client";

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { requestNotificationPermission } from '@/lib/firebase';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
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

  const handleSubmit = async (values: { email: string; password: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setError('');
      await login({
        email: values.email,
        password: values.password,
        deviceToken: deviceToken || 'web-app-token'
      });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          © 2025 Marketplace. All rights reserved.
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Marketplace</h2>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
              <p className="text-gray-600 mt-2">
                Don't have an account? <Link href="/auth/register" className="text-[#1c219e] hover:underline">Create a new account now</Link>.
                It's FREE! Takes less than a minute.
              </p>
            </div>

            {error && (
              <div className="p-3 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c219e]/50 text-gray-700 placeholder-gray-400 ${
                        errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 ">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c219e]/50 text-gray-800 placeholder-gray-400 ${
                        errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-sm text-[#1c219e] hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 bg-[#1c219e] text-white hover:bg-[#141679] rounded-md"
                    isLoading={isSubmitting}
                  >
                    Login Now
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