import React from "react";
import { Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StrainsChart from "./components/StrainsChart";
import DataManage from "./components/DataManage";
import StackedBarChart from "./components/StackedBarChart";
import UnitCount from "./components/UnitCount";
import HeadBar from "./components/HeadBar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Container } from "@mui/material";

const theme = createTheme({
  typography: { fontFamily: "K2D, sans-serif" },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HeadBar />
      <Container>
        <br />
        <Routes>
          <Route path="/" element={<><UnitCount /><StrainsChart /><StackedBarChart /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/data-manage" element={<ProtectedRoute><DataManage /></ProtectedRoute>} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
