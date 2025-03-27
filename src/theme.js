import { createTheme } from '@mui/material/styles';

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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#1976d2 #f5f5f5",  // เปลี่ยนสีพื้นหลังให้อ่อนลง
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 6,  // ลดความกว้างจาก 8px เป็น 6px
            height: 6,  // ลดความสูงจาก 8px เป็น 6px
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 6,  // ลดขนาด border radius ให้สอดคล้องกัน
            backgroundColor: "#1976d2",
            minHeight: 24,
            border: "1px solid #f5f5f5",  // ลดความหนาของ border จาก 2px เป็น 1px
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#1565c0",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#f5f5f5",  // เปลี่ยนสีให้อ่อนลง
          },
        },
      },
    },
  },
});

export default theme;