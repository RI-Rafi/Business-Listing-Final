import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPass,
    },
});

export const sendBookingConfirmation = async (booking, business) => {
    const mailOptions = {
        from: config.emailUser,
        to: booking.customerEmail,
        subject: `Booking Confirmed - ${business.name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Your Booking Has Been Confirmed! 🎉</h2>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Business:</strong> ${business.name}</p>
          <p><strong>Contact:</strong> ${business.phone}</p>
          <p><strong>Email:</strong> ${business.email}</p>
          <p><strong>Address:</strong> ${business.address.street}, ${business.address.city}</p>
        </div>

        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px;">
          <h3>Services Booked:</h3>
          ${booking.cartSnapshot.items
                .map(
                    (item) => `
            <div style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px;">
              <p><strong>${item.service.name}</strong></p>
              <p>Date: ${new Date(item.scheduledDate).toLocaleDateString()}</p>
              <p>Time: ${item.scheduledTime}</p>
              <p>Price: $${item.service.price} x ${item.quantity}</p>
              ${item.notes ? `<p>Notes: ${item.notes}</p>` : ''}
            </div>
          `
                )
                .join('')}
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #dcfce7; border-radius: 8px;">
          <p style="margin: 0;"><strong>Total Amount: $${booking.cartSnapshot.totalAmount}</strong></p>
        </div>

        <p style="margin-top: 30px; color: #6b7280;">
          Thank you for choosing ${business.name}! We look forward to serving you.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendProviderNotification = async (provider, booking) => {
    const mailOptions = {
        from: config.emailUser,
        to: provider.email,
        subject: 'New Booking Received!',
        html: `
      <h2>You have a new booking!</h2>
      <p><strong>Customer:</strong> ${booking.customerEmail}</p>
      <p><strong>Phone:</strong> ${booking.customerPhone}</p>
      <p><strong>Total Amount:</strong> $${booking.cartSnapshot.totalAmount}</p>
      <p>Please log in to your dashboard to confirm the booking.</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending provider notification:', error);
    }
};
