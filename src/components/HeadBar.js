import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const HeadBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#003366" }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 24px'
      }}>
        {/* ส่วนโลโก้และชื่อหน่วยงาน */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            ศูนย์วิทยาศาสตร์การแพทย์ที่ 3 นครสวรรค์
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '4px'
            }}
          >
            กระทรวงสาธารณสุข
          </Typography>
        </Box>

        {/* ส่วนเมนูนำทาง */}
        {/* <Box sx={{ display: 'flex', gap: '16px' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/data-manage"
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            จัดการข้อมูล
          </Button>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default HeadBar;