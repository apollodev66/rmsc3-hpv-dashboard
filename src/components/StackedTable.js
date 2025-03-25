import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";

import { convertToThaiDate } from "../components/MonthsTH";

const StackedTable = () => {
  const [labsData, setLabsData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(false);

  const months = [
    "ทั้งหมด",
    "2024-10",
    "2024-11",
    "2024-12",
    "2025-01",
    "2025-02",
    "2025-03",
  ];

  const labOrder = [
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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  useEffect(() => {
    const fetchLabsData = async () => {
      setLoading(true);
      let data = {};

      const fetchMonthData = async (month) => {
        const labsRef = collection(db, "hpv_records", month, "Labs");
        const querySnapshot = await getDocs(labsRef);

        querySnapshot.forEach((docSnap) => {
          const labName = docSnap.id;
          const labData = docSnap.data();

          if (!data[labName]) {
            data[labName] = { labName, totalSamples: 0, totalStrains: 0 };
          }

          data[labName].totalSamples += Number(labData.total_samples || 0);
          data[labName].totalStrains += Number(labData.total_strains || 0);
        });
      };

      if (selectedMonth === "ทั้งหมด") {
        await Promise.all(months.slice(1).map(fetchMonthData));
      } else {
        await fetchMonthData(selectedMonth);
      }

      const sortedData = Object.values(data).sort(
        (a, b) => labOrder.indexOf(a.labName) - labOrder.indexOf(b.labName)
      );

      setLabsData(sortedData);
      setLoading(false);
    };

    fetchLabsData();
  }, [selectedMonth]);

  // ฟังก์ชันเพื่อกำหนดสีพื้นหลังของแถว
  const getRowColor = (index) => {
    const colors = ["#fce49a"];
    return colors[index % colors.length];
  };

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        ข้อมูลรายเดือนในแต่ละศูนย์ฯ
      </Typography>

 <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>เลือกเดือน</InputLabel>
            <Select value={selectedMonth} onChange={handleMonthChange} label="เลือกเดือน">
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {convertToThaiDate(month)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={300}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fbbc04" }}>
                <TableCell sx={{ color: "#000", fontWeight: "bold" }}>
                  ศูนย์
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#000", fontWeight: "bold" }}
                >
                  ตัวอย่างทั้งหมด
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#000", fontWeight: "bold" }}
                >
                  ตัวอย่างที่พบเชื้อความเสี่ยงสูง
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {labsData.map((lab, index) => (
                <TableRow
                  key={lab.labName}
                  sx={{ backgroundColor: getRowColor(index) }}
                >
                  <TableCell>{lab.labName}</TableCell>
                  <TableCell align="right">{lab.totalSamples}</TableCell>
                  <TableCell align="right">{lab.totalStrains}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StackedTable;
