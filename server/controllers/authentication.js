// JWT authentication to return the payload as req.user

import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

function signToken(req, res, next) {
  const newUser = req.newUser;
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.status(201).json({ token });
}

function signGithubToken(req, res, next) {
  const newUser = req.newUser;
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token
}

export { authenticateToken, signToken, signGithubToken };
