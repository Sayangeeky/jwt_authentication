const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456"; // Secret key for signing JWTs

const app = express();
app.use(express.json());

const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

function userExists(username, password) {
  let userExists = false;
  for (let i = 0; i < ALL_USERS.length; i++) {
    if (ALL_USERS[i].username === username && ALL_USERS[i].password === password) {
      userExists = true;
      break; // Exit the loop early if user is found
    }
  }
  return userExists;
}

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
     res.status(403).json({
      msg: "User doesn't exist in our in-memory db",
    });
  }

  // Sign JWT with user's username and jwtPassword
  var token = jwt.sign({ username: username }, jwtPassword);

   res.json({
   token,
  });
});

app.get("/users", function(req, res) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, jwtPassword);
     
      res.json({ username: decoded.username, message: "Access granted to protected resource" });
    } catch (error) {
      console.error("JWT verification error:", error);
      return res.status(403).json({ msg: "Invalid token" });
    }
  });

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
