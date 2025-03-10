import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StrainsChart from "./components/StrainsChart";
import DataManage from "./components/DataManage";
import StackedBarChart from "./components/StackedBarChart";
import UnitCount from "./components/UnitCount";
import HeadBar from "./components/HeadBar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Container, Typography, Box } from "@mui/material";
import Image from "./asset/dmsc_logo.svg";

const theme = createTheme({
  typography: { fontFamily: "K2D, sans-serif" },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <HeadBar />
        <Container>
  <br />
  {window.location.pathname !== "/data-manage" && (
    <>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          textAlign: "center",
          color: "#2c3e50",
          lineHeight: "1.5",
          padding: "20px",
        }}
      >
        รายงานความก้าวหน้า ผลการดำเนินงานตามตัวชี้วัดร้อยละของหญิงไทย
      </Typography>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          textAlign: "center",
          color: "#2c3e50",
          lineHeight: "1.5",
        }}
      >
        ที่ได้รับการตรวจคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test
      </Typography>

      {/* ข้อมูลศูนย์วิทยาศาสตร์การแพทย์ */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f8ff",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          margin: "20px auto",
          padding: "10px",
        }}
      >
        <img
          src={Image}
          alt="Logo"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "10px",
          }}
        />
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
          ข้อมูลศูนย์วิทยาศาสตร์การแพทย์ 15 แห่ง
        </Typography>
      </Box>
    </>
  )}
  
  <Routes>
    <Route path="/" element={<><UnitCount /><StrainsChart /><StackedBarChart /></>} />
    <Route path="/login" element={<Login />} />
    <Route path="/data-manage" element={<ProtectedRoute element={<DataManage />} />} />
  </Routes>
</Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
