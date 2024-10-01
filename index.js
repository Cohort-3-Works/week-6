const express = require("express");
const jwt = require("jsonwebtoken");
const jwt_secret = "secret";

const app = express();
app.use(express.json());

// we will push it to the global array
const users = [];

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.json({
    message: "User registered successfully",
    users,
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  //harder way to find user

  // let foundUser = null;
  // for (let i = 0; i < users.length; i++) {
  //   if (users[i].username === username && users[i].password === password) {
  //     foundUser = users[i];
  //   }
  // }

  if (!user) {
    res.json({
      message: "crendentials are wrong",
    });
    return;
  } else {
    const token = jwt.sign({ username }, jwt_secret);
    res.json({
      message: "User logged in successfully",
      token,
    });
  }
  console.log(user);
});

app.post("/me", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "JWT must be provided" });
  }

  try {
    const decodedData = jwt.verify(token, jwt_secret);

    let user = users.find((user) => user.username === decodedData.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User details",
      user,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
