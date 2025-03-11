import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Container,
} from "@mui/material";
import { months, convertToThaiDate } from "../components/MonthsTH";
import Header from "./Header";

const UnitCount = () => {
  const [totalSamples, setTotalSamples] = useState(0);
  const [totalStrains, setTotalStrains] = useState(0);
  const [monthlySamples, setMonthlySamples] = useState(0);
  const [monthlyStrains, setMonthlyStrains] = useState(0);
  const [previousMonthSamples, setPreviousMonthSamples] = useState(0);
  const [previousMonthStrains, setPreviousMonthStrains] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  const prevDate = new Date(currentDate);
  prevDate.setMonth(prevDate.getMonth() - 1);
  const previousMonth = prevDate.toISOString().slice(0, 7);

  useEffect(() => {
    const fetchData = async () => {
      let totalSamplesCount = 0;
      let totalStrainsCount = 0;
      let monthSamplesCount = 0;
      let monthStrainsCount = 0;
      let prevSamplesCount = 0;
      let prevStrainsCount = 0;

      for (const month of months) {
        const labsRef = collection(db, "hpv_records", month, "Labs");
        const querySnapshot = await getDocs(labsRef);

        querySnapshot.forEach((docSnap) => {
          const labData = docSnap.data();
          if (labData) {
            totalSamplesCount += Number(labData.total_samples || 0);
            totalStrainsCount += Number(labData.total_strains || 0);
          }
        });
      }

      if (months.includes(currentMonth)) {
        const labsRefCurrent = collection(
          db,
          "hpv_records",
          currentMonth,
          "Labs"
        );
        const querySnapshotCurrent = await getDocs(labsRefCurrent);

        querySnapshotCurrent.forEach((docSnap) => {
          const labData = docSnap.data();
          if (labData) {
            monthSamplesCount += Number(labData.total_samples || 0);
            monthStrainsCount += Number(labData.total_strains || 0);
          }
        });
      }

      if (months.includes(previousMonth)) {
        const labsRefPrevious = collection(
          db,
          "hpv_records",
          previousMonth,
          "Labs"
        );
        const querySnapshotPrevious = await getDocs(labsRefPrevious);

        querySnapshotPrevious.forEach((docSnap) => {
          const labData = docSnap.data();
          if (labData) {
            prevSamplesCount += Number(labData.total_samples || 0);
            prevStrainsCount += Number(labData.total_strains || 0);
          }
        });
      }

      setTotalSamples(totalSamplesCount);
      setTotalStrains(totalStrainsCount);
      setMonthlySamples(monthSamplesCount);
      setMonthlyStrains(monthStrainsCount);
      setPreviousMonthSamples(prevSamplesCount);
      setPreviousMonthStrains(prevStrainsCount);
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatNumber = (number) => number.toLocaleString();

  return (
    <Container>
      <Header />
      <Box sx={{ width: "100%", padding: 2 }}>
        <Grid container spacing={2}>
          {/* ข้อมูลเดือนที่ผ่านมา */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{ backgroundColor: "#4a90e2", color: "#fff", height: "100%" }}
            >
              <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6">
                  ข้อมูลเดือนที่ผ่านมา ({convertToThaiDate(previousMonth)})
                </Typography>
                <Typography variant="h4">
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    formatNumber(previousMonthSamples)
                  )}{" "}
                  ตัวอย่าง
                </Typography>
                <Typography variant="h6">
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    formatNumber(previousMonthStrains)
                  )}{" "}
                  ตัวอย่างพบเชื้อ
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* ข้อมูลเดือนปัจจุบัน */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{ backgroundColor: "#f4ae74", color: "#fff", height: "100%" }}
            >
              <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" sx={{ textAlign: "left" }}>
                  ข้อมูลเดือนปัจจุบัน ({convertToThaiDate(currentMonth)})
                </Typography>
                {monthlySamples === 0 && monthlyStrains === 0 ? (
                  <>
                    <Typography variant="h4" sx={{ textAlign: "left" }}>
                      -
                    </Typography>
                    <Typography variant="h6" sx={{ textAlign: "left" }}>
                      กำลังรวบรวมข้อมูล
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h4" sx={{ textAlign: "left" }}>
                      {formatNumber(monthlySamples)} ตัวอย่าง
                    </Typography>
                    <Typography variant="h6" sx={{ textAlign: "left" }}>
                      {formatNumber(monthlyStrains)} ตัวอย่างพบเชื้อ
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* ข้อมูลทั้งหมด */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{ backgroundColor: "#7cc0d0", color: "#fff", height: "100%" }}
            >
              <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6">ข้อมูลทั้งหมด</Typography>
                <Typography variant="h4">
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    formatNumber(totalSamples)
                  )}{" "}
                  ตัวอย่าง
                </Typography>
                <Typography variant="h6">
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    formatNumber(totalStrains)
                  )}{" "}
                  ตัวอย่างพบเชื้อ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UnitCount;
