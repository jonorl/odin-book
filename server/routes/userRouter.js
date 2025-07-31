// routes/userRouter.js
import { Router } from "express";
import { authenticateToken } from "../controllers/authentication.js";
import { parser, processCloudinaryUpload } from "../controllers/multer.js";
import queries from "../db/queries.js";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await queries.getMe(req.user);
    res.json({ user });
  } catch (err) {
    console.error("Failed to get user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.get("/users/:userId", async (req, res) => {
  try {
    const user = await queries.getUserDetails(req.params.userId);
    res.json({ user });
  } catch (err) {
    console.error("failed to fetch user", err);
    res.status(500).json({ message: "server error" });
  }
});

userRouter.get("/users/handle/:handle", async (req, res) => {
  try {
    const user = await queries.getUserDetailsByHandle(req.params.handle);
    res.json({ user });
  } catch (err) {
    console.error("failed to fetch user", err);
    res.status(500).json({ message: "server error" });
  }
});

userRouter.get("/checkOwnLike", async (req, res) => {
  let check = false;
  const likeCheck = await queries.likeCheck(req.body.user.id);
  if (likeCheck !== null) check = true;
  res.json({ check });
});

userRouter.put(
  "/users",
  parser.single("imageFile"),
  processCloudinaryUpload,
  async (req, res) => {
    try {
      const { user, name, surname, handle, email, password } = req.body;
      const id = user.id;
      const imageUrl = req.imageUrl;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }
      if (!name || !surname || !handle || !email) {
        return res.status(400).json({
          success: false,
          message: "Name, surname, handle, and email are required",
        });
      }
      const existingUser = await queries.getUserDetails(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      if (email !== existingUser.email) {
        const emailExists = await queries.getUserByEmail(email);
        if (emailExists && emailExists.id !== id) {
          return res.status(400).json({
            success: false,
            message: "Email is already taken",
          });
        }
      }
      if (handle !== existingUser.handle) {
        const handleExists = await queries.getUniqueUserDetailsByHandle(handle);
        if (handleExists && handleExists.id !== id) {
          return res.status(400).json({
            success: false,
            message: "Handle is already taken",
          });
        }
      }
      const updateData = {
        name: name.trim(),
        surname: surname.trim(),
        handle: handle.trim(),
        email: email.trim().toLowerCase(),
        profilePicUrl: imageUrl || existingUser.profilePicUrl,
      };
      if (password && password.trim() !== "") {
        updateData.passwordHash = await bcrypt.hash(password.trim(), 10);
      }
      const updatedUser = await queries.updateUser(id, updateData);
      res.json({
        success: true,
        message: "User settings updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.code === "P2002") {
        const target = error.meta?.target;
        if (target?.includes("email")) {
          return res.status(400).json({
            success: false,
            message: "Email is already taken",
          });
        }
        if (target?.includes("handle")) {
          return res.status(400).json({
            success: false,
            message: "Handle is already taken",
          });
        }
      }
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

userRouter.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await queries.deleteUser(userId);
    res.json({ user });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default userRouter;