import React from "react";
import { Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";
import StrainsChart from "./components/StrainsChart";
import DataManage from "./pages/DataManage";
import StackedBarChart from "./components/StackedBarChart";
import StackedTable from "./components/StackedTable";
import StrainsTable from "./components/StrainsTable";
import UnitCount from "./components/UnitCount";
import HeadBar from "./components/HeadBar";
import Login from "./components/Login";
import TopFiveStrains from "./components/TopFiveStrains";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";

const theme = createTheme({
  typography: { fontFamily: "K2D, sans-serif" },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <HeadBar />
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Routes>
            <Route
              path="/"
              element={
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <UnitCount />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StrainsChart />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StackedBarChart />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StackedTable />
                    <TopFiveStrains />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StrainsTable />
                  </Grid>
                </Grid>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/data-manage"
              element={
                <ProtectedRoute>
                  <DataManage />
                </ProtectedRoute>
              }
            />
            {/* เพิ่ม Route สำหรับหน้าที่ไม่พบ */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;