import { adminDb } from "../../../utils/firebase/firebaseAdmin";

export default async function handler(req, res) {
  const uid = req.cookies.uid;
  if (!uid) {
    
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Invalid todo ID" });
  }

  const todoRef = adminDb.collection("users").doc(uid).collection("todos").doc(id);

  if (req.method === "GET") {
    try {
      const todoDoc = await todoRef.get();
      if (!todoDoc.exists) {
        return res.status(404).json({ error: "Todo not found" });
      }

      const todo = { id: todoDoc.id, ...todoDoc.data() };
      // console.log("Fetched todo:", todo);
      return res.status(200).json(todo);
    } catch (err) {
      console.error("Error fetching todo:", err.message, err.stack);
      return res.status(500).json({ error: "Error fetching todo", details: err.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { title, completed } = req.body;
      if (!title && completed === undefined) {
        return res.status(400).json({ error: "At least one field (title or completed) is required" });
      }

      const todoDoc = await todoRef.get();
      if (!todoDoc.exists) {
        return res.status(404).json({ error: "Todo not found" });
      }

      const updateData = {};
      if (title && typeof title === "string" && title.trim() !== "") {
        updateData.title = title;
      }
      if (typeof completed === "boolean") {
        updateData.completed = completed;
      }

      await todoRef.update(updateData);
      
      return res.status(200).json({ id, ...updateData });
    } catch (err) {
      console.error("Error updating todo:", err.message, err.stack);
      return res.status(500).json({ error: "Error updating todo", details: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const todoDoc = await todoRef.get();
      if (!todoDoc.exists) {
        return res.status(404).json({ error: "Todo not found" });
      }

      await todoRef.delete();
      
      return res.status(200).json({ id });
    } catch (err) {
      console.error("Error deleting todo:", err.message, err.stack);
      return res.status(500).json({ error: "Error deleting todo", details: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed. Use GET, PUT, or DELETE." });
  }
}