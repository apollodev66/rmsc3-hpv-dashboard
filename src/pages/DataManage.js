import React, { useState } from "react";
import { Container, Button, Box, ButtonGroup } from "@mui/material";
import UserInfo from "../components/UserInfo";
import ExcelUploader from "../components/ExcelUploader";
import InsertData from "../components/InsertData";

const DataManage = () => {
  const [showInsert, setShowInsert] = useState(true);

  return (
    <>
      {/* UserInfo และปุ่ม Toggle ยังคงอยู่ใน Container */}
      <Container>
        <UserInfo />
        <br />

        {/* ปุ่ม Toggle คู่กัน และอยู่ตรงกลาง */}
        <Box display="flex" justifyContent="center" mb={2}>
          <ButtonGroup>
            <Button
              variant={showInsert ? "contained" : "outlined"}
              color="primary"
              onClick={() => setShowInsert(true)}
            >
              กรอกข้อมูลด้วยตัวเอง
            </Button>
            <Button
              variant={!showInsert ? "contained" : "outlined"}
              color="secondary"
              onClick={() => setShowInsert(false)}
            >
              อัพโหลดข้อมูล
            </Button>
          </ButtonGroup>
        </Box>
      </Container>

      {/* แสดง Component ตามที่เลือก */}
      {/* ใช้ Box แทน Container เพื่อให้ ExcelUploader แสดงผลเต็มจอ */}
      <Box sx={{ width: "100%" }}>
        {showInsert ? <InsertData /> : <ExcelUploader />}
      </Box>
    </>
  );
};

export default DataManage;