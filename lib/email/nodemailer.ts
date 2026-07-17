import nodemailer from 'nodemailer';

// Validate environment variables
if (!process.env.EMAIL_FROM) {
  console.warn('⚠️ EMAIL_FROM is not set - email functionality will not work');
}
if (!process.env.EMAIL_PASSWORD) {
  console.warn('⚠️ EMAIL_PASSWORD is not set - email functionality will not work');
}

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration (only if credentials are provided)
if (process.env.EMAIL_FROM && process.env.EMAIL_PASSWORD) {
  transporter.verify((_error, _success) => {
    if (_error) {
      console.error('❌ Email service error:', _error);
    } else {
      console.log('✅ Email service is ready to send emails');
    }
  });
}
