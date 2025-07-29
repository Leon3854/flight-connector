// src/middlewares/auth.middleware.ts
import axios from "axios";

export async function authenticate(req, res, next) {
  try {
    const authResponse = await axios.get(
      `${process.env.USERS_SERVICE_URL}/auth/validate`,
      { headers: { Authorization: req.headers.authorization } }
    );

    req.user = authResponse.data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
