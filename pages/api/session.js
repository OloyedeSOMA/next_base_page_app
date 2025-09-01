import { adminAuth } from "../../utils/firebase/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { idToken } = req.body;
      const decoded = await adminAuth.verifyIdToken(idToken);

      res.setHeader(
        "Set-Cookie",
        `uid=${decoded.uid}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24}`
      );

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ error: "invalid token", details: String(err) });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }
}