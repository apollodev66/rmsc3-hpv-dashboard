import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  Button,
  Container,
  Typography,
  Backdrop,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import * as XLSX from "xlsx";

const months = [
  "2024-10",
  "2024-11",
  "2024-12",
  "2025-01",
  "2025-02",
  "2025-03",
  "2025-04",
  "2025-05",
];

const strains = [
  "Multiple_HPV_16",
  "Multiple_HPV_16_18",
  "Multiple_HPV_18",
  "Multiple_HPV_non_16_18",
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

const ExcelUploader = () => {
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    if (!file || !month) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 0,
      });

      if (!jsonData.length) {
        setSnackbarMessage("ไฟล์ Excel ไม่มีข้อมูล");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      const tempPreviewData = labs.map((lab, i) => {
        const casesData = {};
        strains.forEach((strain, index) => {
          casesData[strain] = jsonData[index + 1]?.[i + 1] || 0;
        });

        const totalStrains = Object.values(casesData).reduce(
          (sum, value) => sum + (parseInt(value) || 0),
          0
        );
        const totalSamples = jsonData[19]?.[i + 1] || 0;

        return { lab, casesData, totalStrains, totalSamples };
      });

      setPreviewData(tempPreviewData);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleChange = (lab, strain, value) => {
    setPreviewData((prevData) =>
      prevData.map((item) =>
        item.lab === lab
          ? {
              ...item,
              casesData: {
                ...item.casesData,
                [strain]: value,
              },
            }
          : item
      )
    );
  };

  const handleCellClick = (lab, strain) => {
    setEditingCell({ lab, strain });
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Check if data already exists for the selected month
    const labRef = doc(db, `hpv_records/${month}/Labs`, labs[0]);
    const docSnap = await getDoc(labRef);

    if (docSnap.exists()) {
      setConfirmDialogOpen(true);
      setLoading(false);
      return;
    }

    await saveData();
  };

  const saveData = async () => {
    for (const labData of previewData) {
      const { lab, casesData, totalStrains, totalSamples } = labData;

      const dataToSave = {
        total_samples: totalSamples,
        total_strains: totalStrains,
        ...casesData,
      };

      const labRef = doc(db, `hpv_records/${month}/Labs`, lab);
      await setDoc(labRef, dataToSave);
    }

    setLoading(false);
    setSnackbarMessage("อัพโหลดและบันทึกข้อมูลสำเร็จ!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleConfirmDialogClose = (confirmed) => {
    setConfirmDialogOpen(false);
    if (confirmed) {
      saveData();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Container>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            อัพโหลดข้อมูลจากไฟล์ Excel
          </Typography>
          <form onSubmit={handlePreview}>
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>เลือกเดือน</InputLabel>
              <Select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                label="เลือกเดือน"
              >
                {months.map((monthItem) => (
                  <MenuItem key={monthItem} value={monthItem}>
                    {monthItem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="upload-file"
              />
              <label htmlFor="upload-file">
                <Button variant="contained" component="span" size="small">
                  อัพโหลดไฟล์ Excel
                </Button>
              </label>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                component="a"
                href="/asset/template/hpv_template.xlsx"
                download
              >
                ดาวน์โหลดเทมเพลต
              </Button>
            </Box>

            {file && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {file.name}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!file || !month}
              size="small"
              fullWidth
            >
              แสดงตัวอย่างข้อมูล
            </Button>
          </form>
        </Box>
      </Container>

      {previewData.length > 0 && (
        <Box sx={{ maxWidth: "90%", margin: "0 auto", overflowX: "auto" }}>
          <Typography
            variant="subtitle1"
            mt={2}
            mb={1}
            sx={{ textAlign: "center" }}
          >
            ตัวอย่างข้อมูล
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 450 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>สายพันธุ์</TableCell>
                  {previewData.map(({ lab }) => (
                    <TableCell
                      key={lab}
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        padding: "8px",
                      }}
                    >
                      {lab}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {strains.map((strain) => (
                  <TableRow key={strain} hover>
                    <TableCell sx={{ padding: "8px" }}>{strain}</TableCell>
                    {previewData.map(({ lab, casesData }) => (
                      <TableCell
                        key={`${lab}-${strain}`}
                        onClick={() => handleCellClick(lab, strain)}
                        sx={{
                          textAlign: "center",
                          padding: "8px",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        {editingCell?.lab === lab &&
                        editingCell?.strain === strain ? (
                          <TextField
                            variant="outlined"
                            type="number"
                            size="small"
                            value={casesData[strain]}
                            onChange={(e) =>
                              handleChange(lab, strain, e.target.value)
                            }
                            fullWidth
                            autoFocus
                            sx={{ maxWidth: "80px" }}
                          />
                        ) : (
                          casesData[strain]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={2} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="small"
              sx={{ padding: "4px 16px" }}
            >
              บันทึกข้อมูล
            </Button>
          </Box>
        </Box>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" mt={4} mb={2} sx={{ textAlign: "center" }}>
          กำลังบันทึกข้อมูล ห้าม Refresh หรือ ปิดหน้าเว็บ
        </Typography>
      </Backdrop>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => handleConfirmDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">แจ้งเตือน</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            เดือนที่คุณเลือกมีข้อมูลอยู่แล้ว ข้อมูลเก่าจะถูกเขียนทับ
            คุณต้องการดำเนินการต่อหรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleConfirmDialogClose(false)}
            color="primary"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={() => handleConfirmDialogClose(true)}
            color="primary"
            autoFocus
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExcelUploader;
