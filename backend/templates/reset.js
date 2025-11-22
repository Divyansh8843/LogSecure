export const resetPasswordTemplate = (userName, resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset - Secure Log Analyzer</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563eb, #1e3a8a);
      color: white;
      text-align: center;
      padding: 25px;
    }
    .header h1 {
      margin: 0;
      font-size: 1.6rem;
    }
    .body {
      padding: 30px 40px;
      text-align: center;
    }
    .body p {
      font-size: 1rem;
      color: #374151;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .reset-btn {
      background-color: #2563eb;
      color: white !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-weight: 600;
      display: inline-block;
      margin-top: 10px;
      transition: background 0.3s;
    }
    .reset-btn:hover {
      background-color: #1e40af;
    }
    .footer {
      background-color: #f9fafb;
      text-align: center;
      padding: 15px;
      font-size: 0.85rem;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Secure Log Analyzer - Password Reset</h1>
    </div>
    <div class="body">
      <p>Dear ${userName || "User"},</p>
      <p>We received a request to reset your password. Click the button below to securely reset it:</p>
      <a href="${resetLink}" class="reset-btn">Reset Password</a>
      <p>If you didn’t request this change, please ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} College Cybersecurity Division | Secure Log Analyzer<br>
      For support, contact <a href="mailto:support@college.edu">support@college.edu</a>
    </div>
  </div>
</body>
</html>
`;
