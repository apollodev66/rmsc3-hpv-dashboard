import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Select,
  InputLabel,
  FormControl,
  Backdrop,
  CircularProgress,
  Grid,
} from "@mui/material";
import { convertToStrainsNameFormat } from "./StrainsNameFormat";
import UserInfo from "./UserInfo";
import ExcelUploader from "./ExcelUploader";

const strains = [
  "Multiple_HPV_16_18",
  "Multiple_HPV_non_16_18",
  "Multiple_HPV_16",
  "Multiple_HPV_18",
  "SINGLE_16",
  "SINGLE_18",
  "SINGLE_31",
  "SINGLE_33",
  "SINGLE_35",
  "SINGLE_39",
  "SINGLE_45",
  "SINGLE_51",
  "SINGLE_52",
  "SINGLE_56",
  "SINGLE_58",
  "SINGLE_59",
  "SINGLE_66",
  "SINGLE_68",
];

const labs = [
  "ศวก. 1",
  "ศวก. 1-1",
  "ศวก. 2",
  "ศวก. 3",
  "ศวก. 4",
  "ศวก. 5",
  "ศวก. 6",
  "ศวก. 7",
  "ศวก. 8",
  "ศวก. 9",
  "ศวก. 10",
  "ศวก. 11",
  "ศวก. 11-1",
  "ศวก. 12",
  "ศวก. 12-1",
];

const months = [
  "2024-10",
  "2024-11",
  "2024-12",
  "2025-01",
  "2025-02",
  "2025-03",
  "2025-04",
  "2025-05",
];

// ฟังก์ชันแบ่ง strains เป็นกลุ่มๆ ละ 3 สายพันธุ์
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const InsertData = () => {
  const [month, setMonth] = useState("");
  const [lab, setLab] = useState("");
  const [totalSamples, setTotalSamples] = useState("");
  const [casesData, setCasesData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (month && lab) {
      setLoading(true);
      const labRef = doc(db, `hpv_records/${month}/Labs`, lab);
      const unsubscribe = onSnapshot(labRef, (docSnap) => {
        if (docSnap.exists()) {
          setTotalSamples(docSnap.data().total_samples || "");
          const updatedCasesData = {};
          strains.forEach((strain) => {
            updatedCasesData[strain] = docSnap.data()[strain] || "";
          });
          setCasesData(updatedCasesData);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [month, lab]);

  const handleChangeCases = (strain, value) => {
    setCasesData((prevState) => ({
      ...prevState,
      [strain]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lab || !totalSamples || !month) return;

    setLoading(true);

    const totalStrains = Object.values(casesData).reduce(
      (sum, value) => sum + (parseInt(value) || 0),
      0
    );

    const labRef = doc(db, `hpv_records/${month}/Labs`, lab);

    const dataToSave = {
      total_samples: parseInt(totalSamples),
      total_strains: totalStrains,
      ...casesData,
    };

    await setDoc(labRef, dataToSave);

    setLab("");
    setTotalSamples("");
    setCasesData({});
    setMonth("");

    setLoading(false);
  };

  // แบ่ง strains เป็นกลุ่มๆ ละ 3 สายพันธุ์
  const strainGroups = chunkArray(strains, 6);

  return (
    <>
      <Container>
        <UserInfo />
        <Typography variant="h6" gutterBottom>
          เพิ่ม/แก้ไข ข้อมูลการตรวจหาเชื้อ
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={1}>
            <FormControl fullWidth size="small">
              <InputLabel>เลือกเดือน</InputLabel>
              <Select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                label="เลือกเดือน"
                fullWidth
              >
                {months.map((monthItem) => (
                  <MenuItem key={monthItem} value={monthItem}>
                    {monthItem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <TextField
            select
            label="เลือก Lab"
            value={lab}
            onChange={(e) => setLab(e.target.value)}
            fullWidth
            margin="normal"
            size="small" 
            sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}
          >
            {labs.map((labItem) => (
              <MenuItem key={labItem} value={labItem}>
                {labItem}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="กรอกตัวอย่างทั้งหมด"
            type="number"
            value={totalSamples}
            onChange={(e) => setTotalSamples(e.target.value)}
            fullWidth
            margin="normal"
            size="small" 
            sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
            กรอกข้อมูลสายพันธุ์ HPV
          </Typography>
          
          {/* แสดงผลแบบ 3 คอลัมน์ */}
          <Grid container spacing={2}>
            {strainGroups.map((group, groupIndex) => (
              <Grid item xs={12} md={4} key={groupIndex}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>สายพันธุ์ HPV</TableCell>
                        <TableCell align="center">จำนวน</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.map((strain) => (
                        <TableRow key={strain}>
                          <TableCell>{convertToStrainsNameFormat(strain)}</TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              value={casesData[strain] || ""}
                              onChange={(e) => handleChangeCases(strain, e.target.value)}
                              size="small"
                              sx={{ width: "100px" }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ))}
          </Grid>

          <Box mt={1} mb={1}>
            <Button type="submit" variant="contained" color="primary" size="large">
              บันทึกข้อมูล
            </Button>
          </Box>
        </form>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
};

export default InsertData;