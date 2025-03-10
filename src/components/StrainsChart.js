import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import {
  Container,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  FormControl,
  InputLabel
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
const months = ["ทั้งหมด", "2024-10","2024-11","2024-12","2025-01", "2025-02", "2025-03"];

// กำหนดสีของแต่ละสายพันธุ์
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

const StrainsChart = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedLab, setSelectedLab] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(false); // สถานะการโหลดข้อมูล

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleLabChange = (event) => {
    setSelectedLab(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // เริ่มโหลดข้อมูล
      let aggregatedData = {};
  
      if (selectedMonth === "ทั้งหมด") {
        // วนลูปดึงข้อมูลจากทุกเดือน (ยกเว้น "ทั้งหมด")
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
          const labRef = doc(db, `hpv_records/${selectedMonth}/Labs`, selectedLab);
          const docSnap = await getDoc(labRef);
  
          if (docSnap.exists()) {
            const labData = docSnap.data();
            strains.forEach((strain) => {
              aggregatedData[strain] = Number(labData[strain] || 0);
            });
          }
        }
      }
  
      const chartData = strains.map((strain) => ({
        name: strain,
        value: aggregatedData[strain] || 0,
      }));
  
      setData(chartData);
      setLoading(false); // หยุดโหลดข้อมูล
    };
  
    fetchData();
  }, [selectedMonth, selectedLab]);
  

  return (
    <Container>
      <br />
      <Typography variant="h5" gutterBottom>
        ข้อมูลแยกตามสายพันธ์ุ
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>เลือกเดือน</InputLabel>
        <Select value={selectedMonth} onChange={handleMonthChange} label="เลือกเดือน" fullWidth>
          {months.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
      <InputLabel>เลือกหน่วยงาน</InputLabel>
      <Select
        value={selectedLab}
        onChange={handleLabChange}
        fullWidth
        margin="normal"
        label="เลือกหน่วยงาน"
      >
        {labs.map((lab) => (
          <MenuItem key={lab} value={lab}>
            {lab}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
      {/* แสดง CircularProgress ขณะโหลดข้อมูล */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={90}
              style={{ fontFamily: "K2D, sans-serif" }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[5, 5, 0, 0]}>
              {data.map((entry, index) => (
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
                style={{ fontFamily: "K2D, sans-serif" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
};

export default StrainsChart;
