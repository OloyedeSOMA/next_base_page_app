"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CustomForm = ({ signup, onSubmit, includeName }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleData = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { name, email, password } = formData;
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({
        email,
        password,
        ...(includeName ? { name } : {}),
      });
      setFormData({});
    } catch (err) {
      setError(err.message || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <div align="center">
          <Image src="/images/logo.png" alt="logo" width={20} height={30} />
        </div>
        <h1 className="w-full flex text-center justify-center text-xl mb-4 mt-4">
          Welcome to Task Master
        </h1>
        <p className="w-full flex text-center justify-center text-sm">
          {signup === 'true' ? 'Sign Up' : 'Log In'} to manage your tasks and stay productive
        </p>

        <div className="w-full p-4 flex justify-center bg-black-500">
          <form className="w-full p-4" onSubmit={handleSubmit}>
            {signup === 'true' && includeName && (
              <div className="w-full p-4 flex flex-col items-center p-3">
                <label className="text-lg w-[100%] md:w-[70%] flex-start">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name || ''}
                  className="w-full md:w-[70%] h-[30px] p-5 mr-5 rounded-xl border-2 border-gray-400 focus:outline-none"
                  required
                  onChange={handleData}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="w-full p-4 flex flex-col items-center p-3">
              <label className="text-lg w-[100%] md:w-[70%] flex-start">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email || ''}
                className="w-full md:w-[70%] h-[30px] p-5 mr-5 rounded-xl border-2 border-gray-400 focus:outline-none"
                required
                onChange={handleData}
                disabled={isLoading}
              />
            </div>

            <div className="w-full p-4 flex flex-col items-center p-3">
              <label className="text-lg w-[100%] md:w-[70%] flex-start">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password || ''}
                minLength={6}
                className="w-full md:w-[70%] h-[30px] p-5 mr-5 rounded-xl border-2 border-gray-400 focus:outline-none"
                required
                onChange={handleData}
                disabled={isLoading}
              />
              {error && (
                <p className="w-full flex text-center justify-center text-sm text-red-500">
                  {error}
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="w-full flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full md:w-[90%]  h-[50px] flex justify-center items-center cursor-pointer text-center text-white bg-[#2563EB] rounded-lg"
                disabled={isLoading}
              >
                {signup === 'true' ? 'Sign Up' : 'Log In'}
              </button>
            )}

            <p className="w-full flex text-center justify-center text-sm">
              {signup === 'true' ? (
                <>
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-500 hover:underline">
                    Log in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <Link href="/" className="text-blue-500 hover:underline">
                    Sign up
                  </Link>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomForm;