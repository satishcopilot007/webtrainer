/**
 * Email Service using Gmail SMTP
 * 
 * To use this service:
 * 1. Create a Gmail App Password: https://myaccount.google.com/apppasswords
 * 2. Set environment variables:
 *    - EMAIL_USER=your-email@gmail.com
 *    - EMAIL_PASSWORD=your-app-password
 *    - SENDER_EMAIL=your-email@gmail.com (optional, defaults to EMAIL_USER)
 *    - SENDER_NAME=TrainerMentors (optional)
 */

const nodemailer = require('nodemailer');

// Email configuration
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error.message);
  } else {
    console.log('✅ Email service is ready');
  }
});

/**
 * Send enrollment confirmation email
 */
const sendEnrollmentConfirmation = async (to, userData, courseData) => {
  const mailOptions = {
    from: `${process.env.SENDER_NAME || 'TrainerMentors'} <${process.env.SENDER_EMAIL || process.env.EMAIL_USER}>`,
    to,
    subject: `🎉 Welcome to ${courseData.title} - Enrollment Confirmed`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1>Welcome to TrainerMentors!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 10px 10px;">
          <p>Hi <strong>${userData.name}</strong>,</p>
          
          <p>Congratulations! 🎉 You have successfully enrolled in:</p>
          
          <div style="background-color: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${courseData.title}</h3>
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${courseData.duration_weeks} weeks</p>
            <p style="margin: 5px 0;"><strong>Level:</strong> ${courseData.level}</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> ₹${courseData.price}</p>
          </div>

          <h3>What's Next?</h3>
          <ol>
            <li>Check your email for course access credentials</li>
            <li>Join our student community on Telegram/WhatsApp</li>
            <li>Attend the upcoming orientation session</li>
            <li>Start learning and excel in your career!</li>
          </ol>

          <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #667eea; margin-top: 0;">📞 Need Help?</h4>
            <p style="margin: 10px 0;">Contact us anytime at:</p>
            <ul style="margin: 10px 0;">
              <li>📧 Email: <a href="mailto:support@trainermentors.com">support@trainermentors.com</a></li>
              <li>📱 WhatsApp: <a href="https://wa.me/919999999999">+91 99999 99999</a></li>
              <li>💬 Telegram: @trainermentors</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
            © 2026 TrainerMentors. All rights reserved.<br>
            <a href="https://trainermentors.com/privacy" style="color: #667eea; text-decoration: none;">Privacy Policy</a> | 
            <a href="https://trainermentors.com/terms" style="color: #667eea; text-decoration: none;">Terms of Service</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Enrollment confirmation sent to:', to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending enrollment email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send payment confirmation email
 */
const sendPaymentConfirmation = async (to, userData, orderData) => {
  const mailOptions = {
    from: `${process.env.SENDER_NAME || 'TrainerMentors'} <${process.env.SENDER_EMAIL || process.env.EMAIL_USER}>`,
    to,
    subject: `💳 Payment Confirmed - Order #${orderData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1>Payment Successful! ✅</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 10px 10px;">
          <p>Hi <strong>${userData.name}</strong>,</p>
          
          <p>Thank you for your purchase! Your payment has been received and processed successfully.</p>
          
          <div style="background-color: white; padding: 15px; border: 2px solid #28a745; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0;"><strong>Order ID:</strong></td>
                <td style="text-align: right;">#${orderData.orderId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0;"><strong>Number of Courses:</strong></td>
                <td style="text-align: right;">${orderData.courseCount}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0;"><strong>Subtotal:</strong></td>
                <td style="text-align: right;">₹${orderData.subtotal.toFixed(2)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0;"><strong>Tax (18% GST):</strong></td>
                <td style="text-align: right;">₹${orderData.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;"><strong>Total Amount Paid:</strong></td>
                <td style="text-align: right; font-size: 18px; color: #28a745;"><strong>₹${orderData.total.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>

          <h3>Your Courses:</h3>
          <ul style="list-style: none; padding: 0;">
            ${orderData.courses.map(course => `
              <li style="background-color: white; padding: 10px; margin: 5px 0; border-left: 4px solid #667eea; border-radius: 3px;">
                <strong>${course.title}</strong><br>
                <small style="color: #666;">Duration: ${course.duration_weeks} weeks | Level: ${course.level}</small>
              </li>
            `).join('')}
          </ul>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">⏰ Access Your Courses</h4>
            <p>Course access has been activated. Log in to your account to start learning immediately!</p>
            <a href="https://trainermentors.com/dashboard" style="display: inline-block; background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Go to Your Dashboard</a>
          </div>

          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
            © 2026 TrainerMentors. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Payment confirmation sent to:', to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending payment email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send demo booking confirmation email
 */
const sendDemoBookingConfirmation = async (to, userData, demoData) => {
  const mailOptions = {
    from: `${process.env.SENDER_NAME || 'TrainerMentors'} <${process.env.SENDER_EMAIL || process.env.EMAIL_USER}>`,
    to,
    subject: `📅 Demo Class Booked - ${demoData.courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1>Demo Class Booked! 📅</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 10px 10px;">
          <p>Hi <strong>${userData.name}</strong>,</p>
          
          <p>Your demo class has been successfully booked! Our team will contact you soon with the joining details.</p>
          
          <div style="background-color: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 3px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${demoData.courseName}</h3>
            <p style="margin: 5px 0;"><strong>📍 Mode:</strong> ${demoData.mode}</p>
            <p style="margin: 5px 0;"><strong>📅 Timeline:</strong> ${demoData.timeline}</p>
            <p style="margin: 5px 0;"><strong>📞 Contact Number:</strong> ${userData.phone}</p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⏰ What to Expect:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>We'll call you on the provided phone number</li>
              <li>Introduction to the course and mentor</li>
              <li>Q&A session about the curriculum</li>
              <li>Enrollment assistance if interested</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
            © 2026 TrainerMentors. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Demo booking confirmation sent to:', to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending demo booking email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (to, userName) => {
  const mailOptions = {
    from: `${process.env.SENDER_NAME || 'TrainerMentors'} <${process.env.SENDER_EMAIL || process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to TrainerMentors - Expert-Led Online Training',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1>Welcome to TrainerMentors! 🎓</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 10px 10px;">
          <p>Hi <strong>${userName}</strong>,</p>
          
          <p>Thank you for joining TrainerMentors! We're excited to have you on board.</p>
          
          <h3>🎯 What You Can Do:</h3>
          <ul>
            <li><strong>Browse Courses:</strong> Explore 139+ courses across 13 categories</li>
            <li><strong>Book Demo:</strong> Try any course with a free demo class</li>
            <li><strong>Learn from Experts:</strong> Study with industry professionals</li>
            <li><strong>Get Certified:</strong> Earn industry-recognized certificates</li>
            <li><strong>Guaranteed Placement:</strong> Access to job placement assistance</li>
          </ul>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">🚀 Get Started Now</h4>
            <p>Browse our course catalog and find the perfect course for your career goals.</p>
            <a href="https://trainermentors.com/courses" style="display: inline-block; background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Explore Courses</a>
          </div>

          <div style="background-color: #f0f4c3; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #f57f17; margin-top: 0;">💡 Popular Courses This Month</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Data Science & AI (25 courses)</li>
              <li>Software Development (24 courses)</li>
              <li>Project Management (13 courses)</li>
              <li>Cloud & Networking (8 courses)</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
            © 2026 TrainerMentors. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEnrollmentConfirmation,
  sendPaymentConfirmation,
  sendDemoBookingConfirmation,
  sendWelcomeEmail
};
