// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const formatTime = (timeString) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const generatePassengerEmail = (booking, driver) => ({
  subject: `Ride Booking Confirmed - PNR: ${booking.PNRid}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f97316;">Your Ride is Confirmed!</h2>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937; margin-bottom: 15px;">Booking Details</h3>
        <p><strong>PNR Number:</strong> ${booking.PNRid}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${formatTime(booking.time)}</p>
        <p><strong>From:</strong> ${booking.locationFrom}</p>
        <p><strong>To:</strong> ${booking.locationTo}</p>
        <p><strong>Amount Paid:</strong> ₹${booking.price}</p>
      </div>
      
      <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937; margin-bottom: 15px;">Driver Details</h3>
        <p><strong>Driver Name:</strong> ${driver.firstName} ${driver.lastName}</p>
        <p><strong>Vehicle Number:</strong> ${driver.vehicleNumber}</p>
        <p><strong>Vehicle Type:</strong> ${driver.vehicleType}</p>
        <p><strong>Contact:</strong> ${driver.phoneNumber}</p>
      </div>

      <div style="color: #6b7280; font-size: 14px; margin-top: 20px;">
        <p>For any assistance, please contact our support team.</p>
        <p>Thank you for choosing our service!</p>
      </div>
    </div>
  `
});

const generateDriverEmail = (booking, passenger) => ({
  subject: `New Booking Received - PNR: ${booking.PNRid}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f97316;">New Ride Booking!</h2>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937; margin-bottom: 15px;">Booking Details</h3>
        <p><strong>PNR Number:</strong> ${booking.PNRid}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${formatTime(booking.time)}</p>
        <p><strong>Pickup Location:</strong> ${booking.locationFrom}</p>
        <p><strong>Drop Location:</strong> ${booking.locationTo}</p>
        <p><strong>Distance:</strong> ${booking.distance} km</p>
        <p><strong>Fare Amount:</strong> ₹${booking.price}</p>
      </div>
      
      <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937; margin-bottom: 15px;">Passenger Details</h3>
        <p><strong>Passenger Name:</strong> ${passenger.firstName} ${passenger.lastName}</p>
        <p><strong>Contact:</strong> ${passenger.phoneNumber}</p>
      </div>

      <div style="color: #6b7280; font-size: 14px; margin-top: 20px;">
        <p>Please ensure timely pickup and professional service.</p>
        <p>For any assistance, contact our support team.</p>
      </div>
    </div>
  `
});

const sendEmail = async (to, emailContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  generatePassengerEmail,
  generateDriverEmail
};