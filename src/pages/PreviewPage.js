import React, { useRef, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Button, ButtonGroup, CircularProgress, Snackbar, Alert } from "@mui/material";
import html2canvas from "html2canvas";
import StrainsChart from "../components/StrainsChart";
import StackedBarChart from "../components/StackedBarChart";
import StackedTable from "../components/StackedTable";
import StrainsTable from "../components/StrainsTable";
import UnitCount from "../components/UnitCount";
import TopFiveStrains from "../components/TopFiveStrains";
import UserInfo from "../components/UserInfo";

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

function PreviewPage() {
  // Refs for each component we want to export
  const unitCountRef = useRef(null);
  const strainsChartRef = useRef(null);
  const stackedBarChartRef = useRef(null);
  const stackedTableRef = useRef(null);
  const topFiveStrainsRef = useRef(null);
  const strainsTableRef = useRef(null);
  const fullPageRef = useRef(null);

  // State for loading and notifications
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Function to hide export buttons before capturing
  const hideExportButtons = () => {
    const buttons = document.querySelectorAll('.export-button');
    buttons.forEach(button => {
      button.style.visibility = 'hidden';
    });
  };

  // Function to show export buttons after capturing
  const showExportButtons = () => {
    const buttons = document.querySelectorAll('.export-button');
    buttons.forEach(button => {
      button.style.visibility = 'visible';
    });
  };

  // Function to export a specific component as PNG
  const exportComponentAsPNG = async (ref, fileName) => {
    if (!ref.current) return;
    
    setIsExporting(true);
    setExportProgress(0);

    try {
      hideExportButtons();
      
      const canvas = await html2canvas(ref.current, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Hide buttons in the cloned document
          const clonedButtons = clonedDoc.querySelectorAll('.export-button');
          clonedButtons.forEach(button => {
            button.style.visibility = 'hidden';
          });
        }
      });
      
      const link = document.createElement("a");
      link.download = `${fileName || 'component'}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      setSnackbar({
        open: true,
        message: `${fileName} exported successfully!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error exporting component:", error);
      setSnackbar({
        open: true,
        message: `Failed to export ${fileName}`,
        severity: "error",
      });
    } finally {
      showExportButtons();
      setIsExporting(false);
      setExportProgress(100);
      setTimeout(() => setExportProgress(0), 1000);
    }
  };

  // Function to export all components
  const exportAllComponents = async () => {
    const components = [
      { ref: unitCountRef, name: "Unit Count" },
      { ref: strainsChartRef, name: "Strains Chart" },
      { ref: stackedBarChartRef, name: "Stacked Bar Chart" },
      { ref: stackedTableRef, name: "Stacked Table" },
      { ref: topFiveStrainsRef, name: "Top Five Strains" },
      { ref: strainsTableRef, name: "Strains Table" },
    ];

    setIsExporting(true);
    setExportProgress(0);

    try {
      for (let i = 0; i < components.length; i++) {
        const component = components[i];
        setExportProgress(Math.floor((i / components.length) * 100));
        await exportComponentAsPNG(component.ref, component.name);
        // Small delay between exports to avoid browser issues
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setSnackbar({
        open: true,
        message: "All components exported successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error exporting components:", error);
      setSnackbar({
        open: true,
        message: "Failed to export some components",
        severity: "error",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(100);
      setTimeout(() => setExportProgress(0), 1000);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <UserInfo />
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh",
        p: 2,
        gap: 3,
        position: 'relative',
      }} ref={fullPageRef}>
        {/* Loading overlay */}
        {isExporting && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
            <CircularProgress 
              variant={exportProgress ? "determinate" : "indeterminate"}
              value={exportProgress}
              size={80}
              thickness={5}
              sx={{ mb: 2 }}
            />
            <Box sx={{ color: 'white', fontSize: '1.2rem' }}>
              {exportProgress ? `Exporting... ${exportProgress}%` : 'Preparing export...'}
            </Box>
          </Box>
        )}

        {/* Export buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
          <ButtonGroup variant="contained">
            <Button 
              onClick={() => exportComponentAsPNG(fullPageRef, "Full_Page")}
              disabled={isExporting}
            >
              Export Full Page
            </Button>
            <Button 
              onClick={exportAllComponents}
              disabled={isExporting}
            >
              Export All Components
            </Button>
          </ButtonGroup>
        </Box>

        {/* Header Section */}
        <Box ref={unitCountRef}>
          <UnitCount />
          <Button 
            className="export-button"
            size="small" 
            variant="outlined" 
            onClick={() => exportComponentAsPNG(unitCountRef, "Unit_Count")}
            sx={{ mt: 1 }}
            disabled={isExporting}
          >
            Export
          </Button>
        </Box>

        {/* Charts Row */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }} ref={strainsChartRef}>
            <StrainsChart />
            <Button 
              className="export-button"
              size="small" 
              variant="outlined" 
              onClick={() => exportComponentAsPNG(strainsChartRef, "Strains_Chart")}
              sx={{ mt: 1 }}
              disabled={isExporting}
            >
              Export
            </Button>
          </Box>
          <Box sx={{ flex: 1 }} ref={stackedBarChartRef}>
            <StackedBarChart />
            <Button 
              className="export-button"
              size="small" 
              variant="outlined" 
              onClick={() => exportComponentAsPNG(stackedBarChartRef, "Stacked_Bar_Chart")}
              sx={{ mt: 1 }}
              disabled={isExporting}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Tables Row */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box ref={stackedTableRef}>
              <StackedTable />
              <Button 
                className="export-button"
                size="small" 
                variant="outlined" 
                onClick={() => exportComponentAsPNG(stackedTableRef, "Stacked_Table")}
                sx={{ mt: 1 }}
                disabled={isExporting}
              >
                Export
              </Button>
            </Box>
            <Box ref={topFiveStrainsRef}>
              <TopFiveStrains />
              <Button 
                className="export-button"
                size="small" 
                variant="outlined" 
                onClick={() => exportComponentAsPNG(topFiveStrainsRef, "Top_Five_Strains")}
                sx={{ mt: 1 }}
                disabled={isExporting}
              >
                Export
              </Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }} ref={strainsTableRef}>
            <StrainsTable />
            <Button 
              className="export-button"
              size="small" 
              variant="outlined" 
              onClick={() => exportComponentAsPNG(strainsTableRef, "Strains_Table")}
              sx={{ mt: 1 }}
              disabled={isExporting}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default PreviewPage;