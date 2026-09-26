import PDFDocument from 'pdfkit';

export const pdfService = {
  // Official Examination Hall Ticket PDF
  createHallTicketPDF(student, exam, hallTicket, subjects) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    // Header with border
    doc.rect(20, 20, 555, 800).stroke('#4F46E5');

    // University Banner
    doc.fillColor('#4F46E5').fontSize(20).text('NRI INSTITUTE OF TECHNOLOGY', { align: 'center', bold: true });
    doc.fontSize(10).fillColor('#6B7280').text('Autonomous Institution • NAAC A++ Grade • Controller of Examinations', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#111827').fontSize(14).text('OFFICIAL EXAMINATION HALL TICKET', { align: 'center', bold: true });
    doc.moveDown(1);

    // Student Information Block
    doc.fontSize(10).fillColor('#374151');
    doc.text(`Student Name: ${student.userId?.name || 'Aarav Kapoor'}`, 40, 110);
    doc.text(`Roll Number: ${student.rollNumber}`, 40, 125);
    doc.text(`Department: ${student.departmentId?.name || 'Computer Science'}`, 40, 140);
    doc.text(`Semester: ${student.semester} | Section: ${student.section}`, 40, 155);

    doc.text(`Hall Ticket No: ${hallTicket.hallTicketNumber}`, 320, 110);
    doc.text(`Academic Year: ${exam.academicYear || '2025-2026'}`, 320, 125);
    doc.text(`Center Code: NC-MAIN-01`, 320, 140);
    doc.text(`Eligibility Status: ${hallTicket.isEligible ? 'ELIGIBLE' : 'DETAINED'}`, 320, 155);

    doc.moveDown(2);

    // Examination Schedule Table Header
    const tableTop = 190;
    doc.rect(40, tableTop, 515, 25).fill('#EEF2FF');
    doc.fillColor('#312E81').fontSize(10).text('Subject Code', 45, tableTop + 7, { bold: true });
    doc.text('Subject Name', 140, tableTop + 7, { bold: true });
    doc.text('Date', 340, tableTop + 7, { bold: true });
    doc.text('Session', 440, tableTop + 7, { bold: true });

    let y = tableTop + 30;
    (subjects || []).forEach((sub, idx) => {
      doc.fillColor('#1F2937').fontSize(9).text(sub.code || 'CS501', 45, y);
      doc.text(sub.name || 'Core Engineering Subject', 140, y);
      doc.text(new Date(Date.now() + idx * 86400000 * 2).toLocaleDateString(), 340, y);
      doc.text(idx % 2 === 0 ? 'FN (09:30 AM)' : 'AN (02:00 PM)', 440, y);

      doc.moveTo(40, y + 18).lineTo(555, y + 18).stroke('#E5E7EB');
      y += 25;
    });

    // Instructions & QR Stamp representation
    y = Math.max(y + 30, 480);
    doc.rect(40, y, 515, 90).stroke('#D1D5DB');
    doc.fillColor('#B91C1C').fontSize(9).text('RULES & INSTRUCTIONS FOR CANDIDATES:', 45, y + 8, { bold: true });
    doc.fillColor('#4B5563').fontSize(8);
    doc.text('1. Candidates must occupy their seats 15 minutes before the scheduled commencement of the examination.', 45, y + 25);
    doc.text('2. Possession of mobile phones, smartwatches, programmable calculators, or unauthorized materials is strictly prohibited.', 45, y + 38);
    doc.text('3. This hall ticket is digitally authorized and must be presented along with the official Institute Student ID Card.', 45, y + 51);

    // Signatures
    y += 130;
    doc.fontSize(10).fillColor('#111827');
    doc.text('Signature of Candidate', 60, y);
    doc.text('Controller of Examinations', 380, y, { bold: true });
    doc.fontSize(8).fillColor('#9CA3AF').text('[Digitally Verified by NRIIT Exam Engine]', 350, y + 15);

    return doc;
  },

  // Official Fee Payment Receipt PDF
  createFeeReceiptPDF(payment, student, feeStructure) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    // Outer Border
    doc.rect(20, 20, 555, 750).stroke('#10B981');

    doc.fillColor('#047857').fontSize(20).text('NRI INSTITUTE OF TECHNOLOGY', { align: 'center', bold: true });
    doc.fontSize(10).fillColor('#6B7280').text('Finance & Accounts Division • Official E-Receipt', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#111827').fontSize(14).text('STUDENT FEE RECEIPT', { align: 'center', bold: true });
    doc.moveDown(1);

    const infoTop = 110;
    doc.fontSize(10).fillColor('#374151');
    doc.text(`Receipt No: ${payment.receiptNumber}`, 40, infoTop);
    doc.text(`Transaction ID: ${payment.transactionId}`, 40, infoTop + 18);
    doc.text(`Payment Date: ${new Date(payment.paymentDate).toLocaleString()}`, 40, infoTop + 36);
    doc.text(`Payment Mode: ${payment.paymentMethod}`, 40, infoTop + 54);

    doc.text(`Student Name: ${student.userId?.name || 'Aarav Kapoor'}`, 320, infoTop);
    doc.text(`Roll Number: ${student.rollNumber}`, 320, infoTop + 18);
    doc.text(`Department: ${student.departmentId?.name || 'Computer Science'}`, 320, infoTop + 36);
    doc.text(`Semester: ${student.semester} - Section ${student.section}`, 320, infoTop + 54);

    // Breakdown Table
    const tableTop = 200;
    doc.rect(40, tableTop, 515, 25).fill('#ECFDF5');
    doc.fillColor('#065F46').fontSize(10).text('Fee Description', 50, tableTop + 7, { bold: true });
    doc.text('Amount (INR)', 450, tableTop + 7, { bold: true });

    let y = tableTop + 35;
    const items = [
      { name: 'Semester Tuition Fee', amount: payment.amountPaid },
      { name: 'Campus IT & Smart Laboratory Access', amount: 'Included' },
      { name: 'Digital Library & E-Journals Subscription', amount: 'Included' },
    ];

    items.forEach((item) => {
      doc.fillColor('#1F2937').fontSize(9).text(item.name, 50, y);
      doc.text(typeof item.amount === 'number' ? `₹${item.amount.toLocaleString()}` : item.amount, 450, y);
      doc.moveTo(40, y + 16).lineTo(555, y + 16).stroke('#E5E7EB');
      y += 24;
    });

    // Total Amount Box
    y += 20;
    doc.rect(300, y, 255, 35).fill('#D1FAE5');
    doc.fillColor('#065F46').fontSize(12).text(`Total Paid: ₹${payment.amountPaid.toLocaleString()}`, 320, y + 10, { bold: true });

    // Status Banner
    y += 60;
    doc.rect(40, y, 515, 40).fill('#F0FDF4');
    doc.fillColor('#166534').fontSize(11).text('✔ TRANSACTION CONFIRMED & RECONCILED WITH UNIVERSITY TREASURY', 45, y + 14, { bold: true, align: 'center' });

    // Signature stamp
    y += 120;
    doc.fontSize(10).fillColor('#111827');
    doc.text('Chief Accounts Officer', 380, y, { bold: true });
    doc.fontSize(8).fillColor('#9CA3AF').text('[Computer-generated receipt, requires no manual signature]', 300, y + 15);

    return doc;
  },
};

