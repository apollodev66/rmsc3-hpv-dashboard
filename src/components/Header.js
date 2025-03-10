import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Typography, Box } from "@mui/material";
import Image from "../asset/dmsc_logo.svg";

const theme = createTheme({
  typography: { fontFamily: "K2D, sans-serif" },
});

function Header() {
  return (
      <ThemeProvider theme={theme}>
        <Container>
          <br />
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
              ข้อมูลศูนย์วิทยาศาสตร์การแพทย์ 15 แห่ง
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
  );
}

export default Header;
