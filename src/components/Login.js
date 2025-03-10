import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, CircularProgress } from "@mui/material";
import { db, collection, getDocs } from "../firebase"; // เชื่อมต่อ Firebase
import bcrypt from "bcryptjs";
import Image from "../asset/dmsc_logo.svg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // เริ่มการโหลด

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
              localStorage.setItem("1zxcasgr0kergrgkwjeir", "true");
              localStorage.setItem("fullname", user.fullname); // บันทึกชื่อเต็ม
              navigate("/data-manage"); // ไปยัง DataManage
            } else {
              setError("Incorrect password");
            }
            setLoading(false); // หยุดการโหลด
          });
        }
      });

      if (!userFound) {
        setError("Username not found");
        setLoading(false); // หยุดการโหลด
      }
    } catch (error) {
      console.error("Error fetching users from Firestore: ", error);
      setError("An error occurred");
      setLoading(false); // หยุดการโหลด
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // จัดให้อยู่กลาง
          alignItems: "center", // จัดให้แนวเดียวกัน
          backgroundColor: "#f0f8ff",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          margin: "20px auto",
          padding: "10px", // เพิ่ม padding
        }}
      >
        {/* รูปภาพ */}
        <img
          src={Image}
          alt="Logo"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "10px", // ระยะห่างระหว่างรูปกับข้อความ
          }}
        />
        {/* ข้อความ */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "#2c3e50",
            textAlign: "left",
            lineHeight: "1.5",
          }}
        >
          RMSc3 | HPV-Dashboard Login
        </Typography>
      </Box>
      <TextField 
        label="Username" 
        variant="outlined" 
        fullWidth
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        sx={{ marginBottom: 2 }} 
      />
      <TextField 
        label="Password" 
        type="password" 
        variant="outlined" 
        fullWidth
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        sx={{ marginBottom: 2 }} 
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={handleLogin}
        disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Login"
        )}
      </Button>
    </Box>
  );
};

export default Login;
