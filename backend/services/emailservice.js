import { transporter } from "../config/nodemailer.js";
import { resetPasswordTemplate } from "../templates/reset.js";

export const sendResetEmail = async (email, userName, token) => {
  const resetLink = `${process.env.RESET_URL}/${token}`;

  const mailOptions = {
    from: `"Secure Log Analyzer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset - Secure Log Analyzer",
    html: resetPasswordTemplate(userName, resetLink),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

export const sendReportEmail = async (toEmail, userName, reportUrl, reportData = {}) => {
  try {
    if (!reportUrl) {
      throw new Error("Report URL is missing.");
    }

    const reportTitle = reportData.filename || reportData.title || "Log Analysis Report";
    const totalLogs = reportData.totalLogs || 0;
    const suspiciousIPs = reportData.suspiciousIPs || 0;
    const errorLogs = reportData.errorLogs || 0;

    const mailOptions = {
      from: `"Secure Log Analyzer" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "📊 Your Log Analysis Report is Ready!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        📊 Log Analysis Report
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                        Your comprehensive security analysis is ready
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                        Hello ${userName}! 👋
                      </h2>
                      
                      <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Your log analysis report <strong>"${reportTitle}"</strong> has been successfully generated and is ready for review.
                      </p>

                      <!-- Stats Cards -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td width="33%" style="padding: 0 5px;">
                            <div style="background: #eff6ff; border-radius: 12px; padding: 20px; text-align: center; border: 2px solid #dbeafe;">
                              <div style="font-size: 32px; font-weight: 700; color: #2563eb; margin-bottom: 5px;">${totalLogs.toLocaleString()}</div>
                              <div style="font-size: 12px; color: #64748b; font-weight: 500;">Total Logs</div>
                            </div>
                          </td>
                          <td width="33%" style="padding: 0 5px;">
                            <div style="background: #fef2f2; border-radius: 12px; padding: 20px; text-align: center; border: 2px solid #fee2e2;">
                              <div style="font-size: 32px; font-weight: 700; color: #dc2626; margin-bottom: 5px;">${suspiciousIPs}</div>
                              <div style="font-size: 12px; color: #64748b; font-weight: 500;">Suspicious IPs</div>
                            </div>
                          </td>
                          <td width="33%" style="padding: 0 5px;">
                            <div style="background: #fef3c7; border-radius: 12px; padding: 20px; text-align: center; border: 2px solid #fde68a;">
                              <div style="font-size: 32px; font-weight: 700; color: #d97706; margin-bottom: 5px;">${errorLogs}</div>
                              <div style="font-size: 12px; color: #64748b; font-weight: 500;">Error Logs</div>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${reportUrl}" 
                               style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4); transition: all 0.3s;">
                              📥 View & Download Report
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 25px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        Click the button above to view your detailed report, download it as PDF, or share it with your team.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                        Thank you for using <strong style="color: #2563eb;">Secure Log Analyzer</strong>! 🔒
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        This email was sent because a report was shared with you. If you didn't request this, you can safely ignore it.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Report email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Email share error:", error.message);
    throw error;
  }
};

export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "📬 Contact Form Submission",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.6; background: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 25px; border-radius: 10px;">
            <h2 style="color: #2563eb;">New Contact Form Submission</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Message:</strong></p>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 6px;">${message}</p>
            <hr style="border:none; border-top:1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 13px; color: gray;">This email was sent from the Secure Log Analyzer contact form.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Contact email sent from ${email}`);
  } catch (error) {
    console.error("❌ Contact email error:", error.message);
  }
};
