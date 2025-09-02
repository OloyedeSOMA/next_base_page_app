"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../utils/firebase/firebase";
import NavBar from "../components/NavBar";
import CustomContainer from "../components/CustomContainer";
import AddTodoInput from "../components/AddTodoInput";
import TodoList from "../components/TodoList";
import Button from "../components/Button";

export async function getServerSideProps(context) {
  const { req } = context;
  const uid = req.cookies.uid;
  console.log("Cookies in getServerSideProps:", req.cookies);
  console.log("UID in getServerSideProps:", uid);

  if (!uid) {
    // console.log("No UID cookie found, redirecting to /");
    // console.log("Request headers:", req.headers);
    // console.log("Cookies in getServerSideProps:", req.cookies);
    // console.log("UID in getServerSideProps:", uid);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
     
    const response = await fetch(`${process.env.BASE_URL}/api/todos`, {
      method: "GET",
      headers: {
        Cookie: `uid=${uid}`,
      },
      cache: "no-store",
    });

    console.log("Fetch response status:", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Fetch error data:", errorData);
      return {
        props: {
          initialTodos: [],
          error: errorData.error || "Failed to fetch todos",
        },
      };
    }

    const { todos } = await response.json();
    console.log("Fetched todos:", todos);

    return {
      props: {
        initialTodos: todos || [],
        error: null,
      },
    };
  } catch (error) {
    console.error("Error fetching todos in getServerSideProps:", error);
    return {
      props: {
        initialTodos: [],
        error: error.message || "Error loading todos",
      },
    };
  }
}

export default function TodoPage({ initialTodos, error }) {
  const [todos, setTodos] = useState(initialTodos || []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("No user authenticated");
        setTodos([]);
        return;
      }

      console.log("User ID:", user.uid);
      const unsubscribeSnapshot = onSnapshot(
        collection(db, "users", user.uid, "todos"),
        (snapshot) => {
          console.log("Snapshot received, docs:", snapshot.docs.length);
          const updatedTodos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Updated todos:", updatedTodos);
          setTodos(updatedTodos);
        },
        (error) => {
          console.error("Error listening to todos:", error);
        }
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  if (error) {
    return (
      <div className="h-[100vh] max-w-[100%]">
        <NavBar />
        <CustomContainer className="flex flex-col md:w-[60%] mx-auto h-auto p-5">
          <div className="text-center text-red-500 text-lg">Error: {error}</div>
        </CustomContainer>
      </div>
    );
  }

  return (
    <div className="h-[100vh] max-w-[100%]">
      <NavBar />
      <CustomContainer className="flex flex-col md:w-[60%] mx-auto h-auto p-5">
        <AddTodoInput />
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold">Your Tasks</h2>
          <div className="flex gap-2 ml-auto">
            <Button>All</Button>
            <Button>Active</Button>
            <Button>Completed</Button>
          </div>
        </div>
        <TodoList todos={todos} />
      </CustomContainer>
    </div>
  );
}

