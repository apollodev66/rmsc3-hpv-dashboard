import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography } from "@mui/material";
import { db, collection, getDocs } from "../firebase"; // เชื่อมต่อ Firebase
import bcrypt from "bcryptjs";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let userFound = false;

      querySnapshot.forEach((doc) => {
        const user = doc.data();
        
        if (user.username === username) {
          userFound = true;

          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              // บันทึก session login พร้อม fullname
              localStorage.setItem("isLoggedIn", "true");
              localStorage.setItem("fullname", user.fullname); // บันทึกชื่อเต็ม
              navigate("/data-manage"); // ไปยัง DataManage
            } else {
              setError("Incorrect password");
            }
          });
        }
      });

      if (!userFound) {
        setError("Username not found");
      }
    } catch (error) {
      console.error("Error fetching users from Firestore: ", error);
      setError("An error occurred");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 3 }}>
      <TextField label="Username" variant="outlined" fullWidth
        value={username} onChange={(e) => setUsername(e.target.value)} sx={{ marginBottom: 2 }} />
      <TextField label="Password" type="password" variant="outlined" fullWidth
        value={password} onChange={(e) => setPassword(e.target.value)} sx={{ marginBottom: 2 }} />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>Login</Button>
    </Box>
  );
};

export default Login;
