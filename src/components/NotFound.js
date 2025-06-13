import React, { useEffect } from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../asset/404-animation.json";

const NotFound = () => {
  useEffect(() => {
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
            อ๊ะๆ ดูเหมือนคุณจะหลงทาง
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ชั่วคราว
          </Typography>
          
          <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/"
                size="large"
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                กลับสู่หน้าหลัก
              </Button>
            </motion.div>

            <Typography variant="body2" color="text.secondary">
              หรือไปที่หน้าอื่น
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/data-manage"
                  sx={{ borderRadius: 2 }}
                >
                  จัดการข้อมูล
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/preview-page"
                  sx={{ borderRadius: 2 }}
                >
                  ตัวอย่างข้อมูล
                </Button>
              </motion.div>
            </Stack>
          </Stack>
        </Box>
      </motion.div>
    </Container>
  );
};

export default NotFound;