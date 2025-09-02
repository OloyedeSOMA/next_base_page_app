import { adminDb } from "../../../utils/firebase/firebaseAdmin";

export default async function handler(req, res) {
  const uid = req.cookies.uid;
  // console.log("UID in /api/todos:", uid);

  if (!uid) {
    console.log("No UID cookie in /api/todos, returning 401");
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const todosSnapshot = await adminDb
        .collection("users")
        .doc(uid)
        .collection("todos")
        .get();
      const todos = todosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Todos fetched:", todos);
      return res.status(200).json({ todos });
    } catch (error) {
      console.error("Error fetching todos:", error);
      return res.status(500).json({ error: "Failed to fetch todos", details: String(error) });
    }
  }

  if (req.method === "POST") {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      const todoRef = await adminDb
        .collection("users")
        .doc(uid)
        .collection("todos")
        .add({ title, completed: false });
      return res.status(201).json({ id: todoRef.id, title, completed: false });
    } catch (error) {
      console.error("Error adding todo:", error);
      return res.status(500).json({ error: "Failed to add todo", details: String(error) });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}