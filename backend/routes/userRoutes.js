import express from "express";
import { searchedUsers, authUser, registerUser, allUsers } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, searchedUsers)
router.post('/login', authUser);
router.route("/allusers").get(protect, allUsers);

export default router;