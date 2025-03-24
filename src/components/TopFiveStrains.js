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
  List,
  ListItem,
  ListItemText,
  Button,
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
} from "recharts";

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

const TopFiveStrains = () => {
  const [dataTotal, setDataTotal] = useState([]);
  const [dataMonth, setDataMonth] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [loading, setLoading] = useState(false);
  const [isListView, setIsListView] = useState(false);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let aggregatedTotal = {};
      let aggregatedMonth = {};

      for (const month of months) {
        // เปลี่ยนเป็น months แทนที่จะเป็น months.slice(1)
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

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        5 อันดับสายพันธุ์ที่ถูกพบมากที่สุด
      </Typography>

      <FormControl fullWidth margin="normal">
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

      {/* ปุ่มสลับโหมดการแสดงผล */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsListView(!isListView)}
        sx={{ mb: 2 }}
      >
        {isListView ? "แสดงเป็นกราฟ" : "แสดงเป็นรายการ"}
      </Button>

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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent
                sx={{
                  minHeight: "400px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom>
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
                ) : isListView ? (
                  <List sx={{ flexGrow: 1 }}>
                    {dataTotal.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${convertToStrainsNameFormat(item.name)}: ${
                            item.value
                          } ครั้ง`}
                        />
                      </ListItem>
                    ))}
                  </List>
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

          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent
                sx={{
                  minHeight: "400px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom>
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
                ) : isListView ? (
                  <List sx={{ flexGrow: 1 }}>
                    {dataMonth.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${convertToStrainsNameFormat(item.name)}: ${
                            item.value
                          } ครั้ง`}
                        />
                      </ListItem>
                    ))}
                  </List>
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
        </Grid>
      )}
    </Container>
  );
};

export default TopFiveStrains;
