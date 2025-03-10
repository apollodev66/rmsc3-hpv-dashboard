import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("1zxcasgr0kergrgkwjeir") === "true";
  
  // หากผู้ใช้ล็อกอินแล้ว ให้แสดง children (หรือหน้าที่ต้องการ), ถ้าไม่ให้ไปที่หน้า login
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
