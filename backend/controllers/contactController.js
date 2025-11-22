import { sendContactEmail } from "../services/emailservice.js";

export const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: "All fields are required: name, email, subject, and message" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({ 
        message: "Message must be at least 10 characters long" 
      });
    }

    // Send contact email
    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ 
      message: "Thank you for your message! We'll get back to you soon." 
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ 
      message: "Failed to send your message. Please try again later." 
    });
  }
};