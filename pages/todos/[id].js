"use client";
import { useRouter } from "next/navigation";
import CustomContainer from "../components/CustomContainer";


export  async function getServerSideProps(context){
   const {req, params} = context;
   const uid = req.cookies.uid;

   if (!uid) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const {id} = params
  try{
    const response = await fetch(`${process.env.BASE_URL}/api/todos/${id}`,{
        method:"GET",
        headers:{
            Cookie: `uid= ${uid}`,
        },
        cache:"no-store",
    });
    if(!response.ok){
        const errorData = await response.json();
        return{
            props:{
                todo:null,
                error: errorData.error || "failed to fetch"
            }
        }
    };
    const data = await response.json();
    const todo = data.todo ?? data; 

    return{
        props:{
            todo,
            error:null
        }
    }
  }catch (err){
    console.error("Error fetching todo in getServerSideProps:", err);
    return {
      props: {
        todo: null,
        error: err.message || "Error loading todo",
      },
    };
  };
}


export default function TodoDetail({ todo, error }) {
  const router = useRouter();

  if (error) {
    return (
      <CustomContainer className = "flex flex-col md:w-[50%] mx-auto h-auto p-5 justify-self-center">
        <div className="text-center text-red-500 text-lg">Error: {error}</div>
        <button
          onClick={() => router.push("/todos")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Todos
        </button>
      </CustomContainer>
    );
  }

  if (!todo) {
    return <CustomContainer className="flex flex-col md:w-[50%] mx-auto text-center text-gray-600 text-lg">Loading...</CustomContainer>;
  }

  return (
    <CustomContainer className = "flex flex-col md:w-[50%] mx-auto h-auto p-5 justify-self-center">
      <h1 className="text-2xl font-bold">Todo Details</h1>
      <p>ID: {todo.id}</p>
      <p>Title: {todo.title}</p>
      <p>Completed: {todo.completed ? "Yes" : "No"}</p>
      <button
        onClick={() => router.push("/todos")}
        className="mt-4 text-blue-600 hover:underline"
      >
        Back to Todos
      </button>
    </CustomContainer>
  );
}

