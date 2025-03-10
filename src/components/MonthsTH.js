export const months = [
    "2024-10", "2024-11", "2024-12",
    "2025-01", "2025-02", "2025-03",
    "2025-04", "2025-05"
  ];
  
  // ฟังก์ชันแปลงเป็นเดือนภาษาไทย + พ.ศ.
  export const convertToThaiDate = (isoMonth) => {
    const [year, month] = isoMonth.split("-").map(Number);
    const thaiYear = year + 543;
  
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
  
    return `${thaiMonths[month - 1]} ${thaiYear}`;
  };
  