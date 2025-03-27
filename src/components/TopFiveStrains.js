import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  BarChart as BarChartIcon,
  List as ListIcon,
  PieChart as PieChartIcon,
} from "@mui/icons-material";

import { convertToThaiDate } from "../components/MonthsTH";
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

const months = [
  "2024-10",
  "2024-11",
  "2024-12",
  "2025-01",
  "2025-02",
  "2025-03",
];

const colors = {
  Multiple_HPV_16_18: "#b4e4e8",
  Multiple_HPV_non_16_18: "#ffc498",
  Multiple_HPV_16: "#afddba",
  Multiple_HPV_18: "#fce49a",
  SINGLE_16: "#f7b5af",
  SINGLE_18: "#b3cffa",
  SINGLE_31: "#7fd1d6",
  SINGLE_33: "#fe994c",
  SINGLE_35: "#70c387",
  SINGLE_39: "#fdd04e",
  SINGLE_45: "#f07b72",
  SINGLE_51: "#7baaf7",
  SINGLE_52: "#46bcc7",
  SINGLE_56: "#ff6d01",
  SINGLE_58: "#35a953",
  SINGLE_59: "#fbbc04",
  SINGLE_66: "#ea4335",
  SINGLE_68: "#7bb7e2",
};

// ฟังก์ชันสร้างข้อมูลสำหรับกราฟโดนัท
const prepareDonutData = (data) => {
  return data.map((item) => ({
    name: convertToStrainsNameFormat(item.name),
    value: item.value,
    color: colors[item.name] || "#003366",
  }));
};

const TopFiveStrains = () => {
  const [dataTotal, setDataTotal] = useState([]);
  const [dataMonth, setDataMonth] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("bar"); // 'bar', 'list', หรือ 'pie'

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let aggregatedTotal = {};
      let aggregatedMonth = {};

      for (const month of months) {
        const labsRef = collection(db, `hpv_records/${month}/Labs`);
        const querySnapshot = await getDocs(labsRef);

        querySnapshot.forEach((docSnap) => {
          const labData = docSnap.data();
          strains.forEach((strain) => {
            aggregatedTotal[strain] =
              (aggregatedTotal[strain] || 0) + Number(labData[strain] || 0);
          });
        });

        if (month === selectedMonth) {
          querySnapshot.forEach((docSnap) => {
            const labData = docSnap.data();
            strains.forEach((strain) => {
              aggregatedMonth[strain] =
                (aggregatedMonth[strain] || 0) + Number(labData[strain] || 0);
            });
          });
        }
      }

      setDataTotal(
        Object.entries(aggregatedTotal)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
      );

      setDataMonth(
        Object.entries(aggregatedMonth)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
      );

      setLoading(false);
    };

    fetchData();
  }, [selectedMonth]);

  // เตรียมข้อมูลสำหรับกราฟโดนัท
  const donutDataMonth = prepareDonutData(dataMonth);
  const donutDataTotal = prepareDonutData(dataTotal);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        5 อันดับสายพันธุ์ที่ถูกพบมากที่สุด
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
                  {convertToThaiDate(month)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="โหมดการแสดงผล"
            >
              <ToggleButton value="bar" aria-label="กราฟแท่ง">
                <BarChartIcon />
              </ToggleButton>
              <ToggleButton value="pie" aria-label="กราฟวงกลม">
                <PieChartIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="รายการ">
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>
      </Grid>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {/* การแสดงผลสำหรับเดือนที่เลือก */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 'auto'}}>
              <CardContent
                sx={{
                  minHeight: "400px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                  5 อันดับสายพันธุ์ที่ถูกพบมากที่สุดในเดือน{" "}
                  {convertToThaiDate(selectedMonth)}
                </Typography>
                {dataMonth.length === 0 ? (
                  <Typography
                    color="textSecondary"
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    กำลังรวบรวมข้อมูล
                  </Typography>
                ) : viewMode === "list" ? (
                  <TableContainer
                    component={Paper}
                    sx={{ maxHeight: 300, mt: 2 }}
                  >
                    <Table
                      size="small"
                      stickyHeader
                      aria-label="ตารางแสดงผลลัพธ์รายเดือน"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                            }}
                          >
                            ลำดับ
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                            }}
                          >
                            สายพันธุ์ HPV
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: "bold",
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                            }}
                          >
                            จำนวนตัวอย่าง
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataMonth.map((item, index) => (
                          <TableRow
                            key={index}
                            hover
                            sx={{
                              "&:nth-of-type(odd)": {
                                backgroundColor: "action.hover",
                              },
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              {convertToStrainsNameFormat(item.name)}
                            </TableCell>
                            <TableCell align="right">
                              {item.value.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : viewMode === "pie" ? (
                  <Box sx={{ flexGrow: 1 }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={donutDataMonth}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {donutDataMonth.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box sx={{ flexGrow: 1 }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dataMonth}>
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={90}
                          tickFormatter={convertToStrainsNameFormat}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                          {dataMonth.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[entry.name] || "#003366"}
                            />
                          ))}
                          <LabelList
                            dataKey="value"
                            position="top"
                            fill="#000"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* การแสดงผลสำหรับข้อมูลทั้งหมด */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 'auto' }}>
              <CardContent
                sx={{
                  minHeight: "400px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                  5 อันดับสายพันธุ์ที่ถูกพบมากที่สุดทั้งหมด
                </Typography>
                {dataTotal.length === 0 ? (
                  <Typography
                    color="textSecondary"
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    กำลังรวบรวมข้อมูล
                  </Typography>
                ) : viewMode === "list" ? (
                  <TableContainer component={Paper} sx={{ maxHeight: 300 , mt: 2}}>
                    <Table
                      stickyHeader
                      size="small"
                      aria-label="ตารางแสดงผลลัพธ์"
                    >
                       <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                            }}
                          >
                            ลำดับ
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                            }}
                          >
                            สายพันธุ์ HPV
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: "bold",
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                            }}
                          >
                            จำนวนตัวอย่าง
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataTotal.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {convertToStrainsNameFormat(item.name)} 
                            </TableCell>
                            <TableCell align="right">{item.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : viewMode === "pie" ? (
                  <Box sx={{ flexGrow: 1 }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={donutDataTotal}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {donutDataTotal.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box sx={{ flexGrow: 1 }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dataTotal}>
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={90}
                          tickFormatter={convertToStrainsNameFormat}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                          {dataTotal.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[entry.name] || "#003366"}
                            />
                          ))}
                          <LabelList
                            dataKey="value"
                            position="top"
                            fill="#000"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default TopFiveStrains;
