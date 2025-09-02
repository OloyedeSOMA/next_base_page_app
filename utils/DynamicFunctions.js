"use client";

import { useState, useEffect } from "react";

export function useDynamicFunctions(todos) {
  const [listLoading, setListLoading] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(new Set());
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setListLoading(true);
    const timer = setTimeout(() => setListLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [todos]);

  const handleToggleComplete = async (todoId, currentCompleted) => {
    setLoadingTodos((prev) => new Set(prev).add(todoId));
    setError("");
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !currentCompleted }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to toggle todo");
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      setError(error.message || "Failed to toggle todo");
    } finally {
      setLoadingTodos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(todoId);
        return newSet;
      });
    }
  };

  const handleStartEdit = (todoId, currentTitle) => {
    setIsEditing(todoId);
    setEditTitle(currentTitle);
    setError("");
  };

  const handleEditSubmit = async (todoId) => {
    if (
      !editTitle ||
      editTitle.trim() === "" ||
      editTitle === todos.find((todo) => todo.id === todoId)?.title
    ) {
      setIsEditing(null);
      setEditTitle("");
      return;
    }

    setLoadingTodos((prev) => new Set(prev).add(todoId));
    setError("");
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle.trim() }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to update todo");
      }

      setIsEditing(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating todo:", error);
      setError(error.message || "Failed to update todo");
    } finally {
      setLoadingTodos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(todoId);
        return newSet;
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditTitle("");
    setError("");
  };

  const handleDelete = async (todoId) => {
    setLoadingTodos((prev) => new Set(prev).add(todoId));
    setError("");
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError(error.message || "Failed to delete todo");
    } finally {
      setLoadingTodos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(todoId);
        return newSet;
      });
    }
  };

  return {
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
  };
}