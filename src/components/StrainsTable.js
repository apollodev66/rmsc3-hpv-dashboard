import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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
import { convertToStrainsNameFormat } from "../components/StrainsNameFormat";

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
  "ทั้งหมด",
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
  "ทั้งหมด",
  "2024-10",
  "2024-11",
  "2024-12",
  "2025-01",
  "2025-02",
  "2025-03",
];

const StrainsTable = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedLab, setSelectedLab] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(false);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleLabChange = (event) => {
    setSelectedLab(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let aggregatedData = {};

      if (selectedMonth === "ทั้งหมด") {
        for (const month of months.slice(1)) {
          if (selectedLab === "ทั้งหมด") {
            const labsRef = collection(db, `hpv_records/${month}/Labs`);
            const querySnapshot = await getDocs(labsRef);

            querySnapshot.forEach((docSnap) => {
              const labData = docSnap.data();
              strains.forEach((strain) => {
                aggregatedData[strain] =
                  (aggregatedData[strain] || 0) + Number(labData[strain] || 0);
              });
            });
          } else {
            const labRef = doc(db, `hpv_records/${month}/Labs`, selectedLab);
            const docSnap = await getDoc(labRef);

            if (docSnap.exists()) {
              const labData = docSnap.data();
              strains.forEach((strain) => {
                aggregatedData[strain] =
                  (aggregatedData[strain] || 0) + Number(labData[strain] || 0);
              });
            }
          }
        }
      } else {
        if (selectedLab === "ทั้งหมด") {
          const labsRef = collection(db, `hpv_records/${selectedMonth}/Labs`);
          const querySnapshot = await getDocs(labsRef);

          querySnapshot.forEach((docSnap) => {
            const labData = docSnap.data();
            strains.forEach((strain) => {
              aggregatedData[strain] =
                (aggregatedData[strain] || 0) + Number(labData[strain] || 0);
            });
          });
        } else {
          const labRef = doc(
            db,
            `hpv_records/${selectedMonth}/Labs`,
            selectedLab
          );
          const docSnap = await getDoc(labRef);

          if (docSnap.exists()) {
            const labData = docSnap.data();
            strains.forEach((strain) => {
              aggregatedData[strain] = Number(labData[strain] || 0);
            });
          }
        }
      }

      const tableData = strains.map((strain) => ({
        strain: convertToStrainsNameFormat(strain),
        value: aggregatedData[strain] || 0,
      }));

      setData(tableData);
      setLoading(false);
    };

    fetchData();
  }, [selectedMonth, selectedLab]);

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        ข้อมูลแยกตามสายพันธุ์
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>เลือกเดือน</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              label="เลือกเดือน"
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>เลือกหน่วยงาน</InputLabel>
            <Select
              value={selectedLab}
              onChange={handleLabChange}
              label="เลือกหน่วยงาน"
            >
              {labs.map((lab) => (
                <MenuItem key={lab} value={lab}>
                  {lab}
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
                  สายพันธุ์
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#000", fontWeight: "bold" }}
                >
                  จำนวน
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.strain}>
                  <TableCell>{row.strain}</TableCell>
                  <TableCell align="right" sx={{ backgroundColor: "#fce49a" }}>
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StrainsTable;
