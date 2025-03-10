import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom"; // ใช้เพียงตัวนี้เท่านั้น

const HeadBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#003366" }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* กล่องข้อความชิดซ้าย */}
        <Box>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ศูนย์วิทยาศาสตร์การแพทย์ที่ 3 นครสวรรค์
          </Typography>
          {/* คำว่า "กระทรวงสาธารณสุข" ใต้คำว่า "ศูนย์วิทยาศาสตร์การแพทย์" */}
          <Typography variant="body2" sx={{ fontWeight: "lighter", marginTop: "5px", textAlign: "left" }}>
            กระทรวงสาธารณสุข
          </Typography>
        </Box>

        {/* ใช้ Link เพื่อทำให้ปุ่มไปยังหน้า DataManage */}
        <Button color="inherit" component={Link} to="/data-manage">
          จัดการข้อมูล
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default HeadBar;
