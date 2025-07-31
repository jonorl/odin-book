// routes/index.js
import { Router } from "express";
import postRouter from "./postRouter.js";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import followRouter from "./followRouter.js";

const apiRouter = Router();

apiRouter.use(postRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use(userRouter);
apiRouter.use(followRouter);

export default apiRouter;