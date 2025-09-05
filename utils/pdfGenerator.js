const PDFDocument = require('pdfkit');

function generateAppointmentPDF(appointment) {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(20).text('Appointment Receipt', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Name: ${appointment.firstName} ${appointment.lastName}`);
  doc.text(`Date: ${appointment.appointmentDate}`);
  doc.text(`Time: ${appointment.appointmentTime}`);
  doc.text(`Plan: ${appointment.plan}`);
  doc.text(`Duration: ${appointment.duration} mins`);
  doc.text(`Amount Paid: ₹${appointment.amount}`);
  doc.text(`Payment ID: ${appointment.paymentId || 'N/A'}`);

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers).toString('base64');
      resolve(pdfData);
    });
  });
}

module.exports = generateAppointmentPDF;
