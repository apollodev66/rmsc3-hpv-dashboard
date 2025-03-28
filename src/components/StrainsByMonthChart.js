import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Container, Typography, Select, MenuItem } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const months = ["2025-02", "2025-03", "2025-04", "2025-05","2025-04"];

const StrainsByMonthChart = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  // ฟังก์ชันในการเลือกเดือน
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // ดึงข้อมูลการตรวจหาเชื้อ HPV สำหรับทุก Lab และเดือนที่เลือก
  useEffect(() => {
    const fetchData = async () => {
      const labRef = collection(db, `hpv_records/${selectedMonth}/Labs`);
      const labSnapshot = await getDocs(labRef);

      // เก็บชื่อ lab ทั้งหมดที่พบ
      const labNames = labSnapshot.docs.map((doc) => doc.id);

      let strainsCount = {}; // ใช้เก็บจำนวนสายพันธุ์

      // ดึงข้อมูลจากทุก Lab
      for (let lab of labNames) {
        const labDocRef = doc(db, `hpv_records/${selectedMonth}/Labs/${lab}`);
        const labDocSnap = await getDoc(labDocRef);

        if (labDocSnap.exists()) {
          const rawData = labDocSnap.data();

          // นับจำนวนสายพันธุ์ที่พบใน lab นี้
          for (let strain in rawData) {
            strainsCount[strain] =
              (strainsCount[strain] || 0) + rawData[strain];
          }
        }
      }

      // สร้างข้อมูลที่ใช้แสดงในกราฟ
      const chartData = Object.keys(strainsCount)
      .filter((strain) => strain !== "total_samples" && strain !== "total_strains") // กรองออก
      .map((strain) => ({
        name: strain,
        value: strainsCount[strain],
      }));

      setData(chartData);
    };

    fetchData();
  }, [selectedMonth]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        จำนวนสายพันธุ์ที่พบในแต่ละเดือน
      </Typography>

      {/* ส่วนของการเลือกเดือน */}
      <Select
        value={selectedMonth}
        onChange={handleMonthChange}
        fullWidth
        margin="normal"
      >
        {months.map((month) => (
          <MenuItem key={month} value={month}>
            {month}
          </MenuItem>
        ))}
      </Select>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            angle={45}
            textAnchor="end"
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4E6CB4" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default StrainsByMonthChart;
