import React, { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../asset/404-animation.json"; // ไฟล์อนิเมชัน Lottie

const NotFound = () => {
  useEffect(() => {
    // บันทึกการเข้าถึงหน้าผิดพลาด (สามารถเชื่อมกับ analytics ในอนาคต)
    console.log('User accessed non-existent route:', window.location.pathname);
  }, []);

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
            textAlign: "center",
          }}
        >
          {/* อนิเมชัน Lottie */}
          <Box sx={{ width: 300, height: 300, mb: 2 }}>
            <Lottie 
              animationData={animationData} 
              loop={true} 
              autoplay={true}
            />
          </Box>

          <Typography variant="h3" gutterBottom>
            404 - Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ชั่วคราว
          </Typography>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/"
              size="large"
              sx={{ borderRadius: 2 }}
            >
              กลับสู่หน้าหลัก
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default NotFound;