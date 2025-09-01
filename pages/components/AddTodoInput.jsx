
'use client';

import { useState } from 'react';

const AddTodoInput = () => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    console.log(title)

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
        credentials: 'include',
      });
      console.log("response",response)
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      setTitle(''); 
      
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-auto flex justify-center items-center mb-6">
      <input
        type="text"
        placeholder="Add a new todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-[80%] h-[60px] p-5 mr-5 rounded-xl border-2 border-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        className="w-[70px] h-[50px] flex justify-center items-center text-white bg-[#2563EB] rounded-lg"
      >
        Add
      </button>
    </form>
  );
};

export default AddTodoInput;