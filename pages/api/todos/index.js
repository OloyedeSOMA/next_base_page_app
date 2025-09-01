import { adminDb } from "../../utils/firebase/firebaseAdmin";

export default async function handler(req, res) {
  const uid = req.cookies.uid;
  console.log("Server UID from cookie:", uid);
  if (!uid) {
    console.log("unauthorized");
    return res.status(401).json("Unauthorized");
  }

  if (req.method === "GET") {
    try {
      const snapshot = await adminDb.collection("users").doc(uid).collection("todos").get();
      console.log(snapshot);
      const todos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(todos);

      return res.status(200).json({ todos });
    } catch (err) {
      console.error("Error fetching todos:", err);
      return res.status(500).json({ Error: "Error fetching todos" });
    }
  } else if (req.method === "POST") {
    try {
      const { title } = req.body;
      console.log(title);
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const todoRef = adminDb.collection("users").doc(uid).collection("todos").doc();
      await todoRef.set({
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      console.log(todoRef);

      return res.status(200).json({ id: todoRef.id, title });
    } catch (err) {
      console.error("Error creating todo:", err.message, err.stack);
      return res.status(500).json({ error: "Error creating todo", details: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed. Use GET or POST." });
  }
}

