
'use client';

import React from 'react';
import Link from 'next/link';
import { DynamicFunctionsHook } from '../utils/hook/DynamicFunctionsHook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TodoList = ({ todos }) => {
  const {
    listLoading,
    loadingTodos,
    isEditing,
    editTitle,
    error,
    setEditTitle,
    handleToggleComplete,
    handleStartEdit,
    handleEditSubmit,
    handleCancelEdit,
    handleDelete,
  } = DynamicFunctionsHook(todos); //todos is passed in order to compare ids 

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  if (listLoading) {
    return (
      <div className="text-center text-gray-600 text-lg">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        Loading...
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-600 text-lg">Create Todos</div>
    );
  }

  return (
    <>
      <div className="space-y-3 w-full">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              todo.completed ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
                className={todo.completed ? 'text-green-600' : 'text-gray-500'}
                disabled={loadingTodos.has(todo.id) || isEditing === todo.id}
              >
                {loadingTodos.has(todo.id) && isEditing !== todo.id ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : todo.completed ? (
                  <CheckCircleIcon/>
                ) : (
                  <CheckCircleIcon />
                )}
              </button>
              {isEditing === todo.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSubmit(todo.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    disabled={loadingTodos.has(todo.id)}
                  />
                  <button
                    onClick={() => handleEditSubmit(todo.id)}
                    className="text-green-600 hover:text-green-800"
                    disabled={loadingTodos.has(todo.id)}
                  >
                    {loadingTodos.has(todo.id) ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      '✔'
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-red-600 hover:text-red-800"
                    disabled={loadingTodos.has(todo.id)}
                  >
                    ✗
                  </button>
                </div>
              ) : (
                <span className={todo.completed ? 'line-through text-gray-600' : ''}>
                  {todo.title}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStartEdit(todo.id, todo.title)}
                className="text-gray-600 hover:text-blue-600"
                disabled={loadingTodos.has(todo.id) || isEditing === todo.id}
              >
                <EditIcon/>
              </button>
              
                {/* api routes with firebase slows the site down.. so i used this method to get my details in order to try and reduce server payload */}
                <Link href={{pathname: `/todoPage/${todo.id}`,query: {id:todo.id, title: todo.title, completed: todo.completed }}}><VisibilityIcon className="text-gray-600 hover:text-red-600"/></Link>
              
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-gray-600 hover:text-red-600"
                disabled={loadingTodos.has(todo.id) || isEditing === todo.id}
              >
                {loadingTodos.has(todo.id) ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <DeleteIcon/>
                )}
              </button>
            </div>
          </div>
        ))}
        {error && (
          <div className="w-full flex justify-center text-center text-sm text-red-500 mt-2">
            {error}
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        {remainingTodos} item{remainingTodos !== 1 ? 's' : ''} left to complete
      </div>
    </>
  );
};

export default TodoList;