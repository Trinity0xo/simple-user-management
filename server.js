import express from "express";
import { env } from "./configs/env.js";

const PORT = env.PORT;
const app = express();

app.use(express.json());

let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: 2,
    name: "Sarah Nguyen",
    email: "sarah@example.com",
  },
  {
    id: 3,
    name: "Michael Lee",
    email: "michael@example.com",
  },
  {
    id: 4,
    name: "Anna Tran",
    email: "anna@example.com",
  },
  {
    id: 5,
    name: "David Smith",
    email: "david@example.com",
  },
];

app.get("/", (req, res) => {
  res.send("Hello from express server");
});

app.get("/users", (req, res) => {
  res.json({
    success: true,
    data: users,
  });
});

app.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users.find((user) => userId == user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Not found",
    });
  }

  return res.json({
    success: true,
    data: user,
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(401).json({
      success: false,
      message: "Invalid input",
    });
  }

  const userIndex = users.findIndex((user) => user.email === email);
  if (userIndex != -1) {
    return res.status(409).json({
      success: false,
      message: "User with this email already exist",
    });
  }

  let lastId;

  if (users.length > 0) {
    lastId = users[users.length - 1].id;
  }

  const newUser = {
    id: lastId ? lastId + 1 : 1,
    name,
    email,
  };

  users.push(newUser);

  return res.status(201).json({
    success: true,
    data: newUser,
  });
});

app.put("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(401).json({
      success: false,
      message: "Invalid input",
    });
  }

  const updateUserIndex = users.filter(
    (user) => user.id == userId || user.email == email
  );

  if (updateUserIndex != -1) {
    return res.status(409).json({
      success: false,
      message: "User with this email already exist",
    });
  }

  users[updateUserIndex].name = name;
  users[updateUserIndex].email = email;

  res.json({
    success: true,
    data: users[updateUserIndex],
  });
});

app.delete("/users/:userId", (req, res) => {
  const { userId } = req.params;

  const userIndex = users.findIndex((user) => user.id == userId);

  if (userIndex != -1) {
    users.splice(userIndex, 1);
  }

  res.json({
    success: false,
    message: "Delete success",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
