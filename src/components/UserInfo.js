import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import image from "../asset/dmsc_logo.svg";

const UserInfo = () => {
  const navigate = useNavigate();
  const fullname = localStorage.getItem("fullname"); // ดึงชื่อผู้ใช้จาก localStorage

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("fullname"); // ลบข้อมูลผู้ใช้
    navigate("/login"); // ไปหน้า login
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",  // ตั้งให้เป็นตำแหน่ง absolute
        top: "20px",           // ระยะห่างจากด้านบน
        right: "20px",         // ชิดขวา
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        minWidth: "400px",      // ขนาดความกว้างขั้นต่ำ
        justifyContent: "space-between",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // เพิ่มเงาให้สวยขึ้น
      }}
    >
      {/* รูปโลโก้ */}
      <img
        src={image}
        alt="Logo"
        style={{
          width: "40px",
          height: "40px",
          marginRight: "10px",
        }}
      />

      {/* ข้อความ */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
          ระบบจัดการข้อมูล
        </Typography>
        {fullname && (
          <Typography variant="body1" sx={{ color: "#555" }}>
            ยินดีต้อนรับ, {fullname}
          </Typography>
        )}
      </Box>

      {/* ปุ่ม Logout */}
      <Button variant="contained" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Paper>
  );
};

export default UserInfo;
