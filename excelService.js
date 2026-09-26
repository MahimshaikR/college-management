import XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { Student } from '../models/index.js';

export const excelService = {
  // Parse and validate uploaded attendance spreadsheet
  async parseAttendanceFile(filePath, expectedDepartmentId, expectedSemester, expectedSection) {
    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(worksheet);

    if (!rawRows || rawRows.length === 0) {
      throw new Error('Uploaded spreadsheet contains no data rows.');
    }

    const students = await Student.find({
      departmentId: expectedDepartmentId,
      semester: expectedSemester,
      section: expectedSection,
    });

    const studentRollMap = new Map();
    students.forEach((s) => studentRollMap.set(s.rollNumber.toUpperCase(), s));

    const validRecords = [];
    const errors = [];
    const processedRolls = new Set();

    rawRows.forEach((row, index) => {
      const rowNum = index + 2; // Accounting for 1-based header
      const rollNumberKey = Object.keys(row).find((k) => /roll|reg|student.*id/i.test(k));
      const statusKey = Object.keys(row).find((k) => /status|attendance|present/i.test(k));

      if (!rollNumberKey) {
        errors.push({ row: rowNum, rollNumber: 'N/A', reason: 'Missing Roll Number column' });
        return;
      }

      const rollNumber = String(row[rollNumberKey] || '').trim().toUpperCase();
      if (!rollNumber) {
        errors.push({ row: rowNum, rollNumber: 'N/A', reason: 'Empty roll number' });
        return;
      }

      if (processedRolls.has(rollNumber)) {
        errors.push({ row: rowNum, rollNumber, reason: 'Duplicate entry detected in file' });
        return;
      }

      const student = studentRollMap.get(rollNumber);
      if (!student) {
        errors.push({ row: rowNum, rollNumber, reason: 'Roll number not found in this department/section roster' });
        return;
      }

      let rawStatus = 'Present';
      if (statusKey && row[statusKey]) {
        const val = String(row[statusKey]).trim().toLowerCase();
        if (['p', 'present', '1', 'yes'].includes(val)) rawStatus = 'Present';
        else if (['a', 'absent', '0', 'no'].includes(val)) rawStatus = 'Absent';
        else if (['l', 'late'].includes(val)) rawStatus = 'Late';
        else if (['e', 'excused', 'od'].includes(val)) rawStatus = 'Excused';
      }

      processedRolls.add(rollNumber);
      validRecords.push({
        studentId: student._id,
        rollNumber: student.rollNumber,
        status: rawStatus,
      });
    });

    return {
      totalRows: rawRows.length,
      successRows: validRecords.length,
      errorRows: errors.length,
      validRecords,
      errors,
    };
  },

  // Generate styled attendance spreadsheet using ExcelJS
  async generateAttendanceReport(sessionList, subjectName) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NRI Institute of Technology Academic Engine';
    const sheet = workbook.addWorksheet('Attendance Ledger');

    sheet.columns = [
      { header: 'Session Date', key: 'date', width: 16 },
      { header: 'Period', key: 'period', width: 10 },
      { header: 'Subject', key: 'subject', width: 28 },
      { header: 'Total Students', key: 'total', width: 15 },
      { header: 'Present Count', key: 'present', width: 15 },
      { header: 'Absent Count', key: 'absent', width: 15 },
      { header: 'Attendance %', key: 'pct', width: 15 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' },
    };

    sessionList.forEach((s) => {
      const pct = s.totalStudents > 0 ? ((s.presentCount / s.totalStudents) * 100).toFixed(1) : '0.0';
      sheet.addRow({
        date: new Date(s.date).toLocaleDateString(),
        period: `Period ${s.period}`,
        subject: subjectName || 'Core Subject',
        total: s.totalStudents,
        present: s.presentCount,
        absent: s.absentCount,
        pct: `${pct}%`,
      });
    });

    return await workbook.xlsx.writeBuffer();
  },
};

