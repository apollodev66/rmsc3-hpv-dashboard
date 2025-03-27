export const months = [
  "ทั้งหมด", // เพิ่มตัวเลือกทั้งหมด
  "2024-10", "2024-11", "2024-12",
  "2025-01", "2025-02", "2025-03",
  "2025-04", "2025-05"
];
  
export const convertToThaiDate = (isoMonth) => {
  if (isoMonth === "ทั้งหมด") return "ทั้งหมด"; // กรณีเลือกทั้งหมด
  
  const [year, month] = isoMonth.split("-").map(Number);
  const thaiYear = year + 543;

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  return `${thaiMonths[month - 1]} ${thaiYear}`;
};