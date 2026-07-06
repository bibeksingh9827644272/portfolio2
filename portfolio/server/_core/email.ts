// Using native fetch available in Node.js 18+

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Send contact form email notification to portfolio owner
 * Uses Manus built-in email API
 */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!forgeApiUrl || !forgeApiKey) {
    console.warn('Email service not configured - missing API credentials');
    return;
  }

  try {
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <pre>${data.message}</pre>
      <hr>
      <p><strong>Reply to:</strong> ${data.email}</p>
    `;

    const response = await fetch(`${forgeApiUrl}/v1/email/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${forgeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'bibeksingh9827644272@gmail.com',
        subject: `New Portfolio Contact: ${data.subject}`,
        html: emailContent,
        from: 'noreply@portfolio.manus.app',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email:', error);
      throw new Error(`Email API error: ${response.status}`);
    }

    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending contact email:', error);
    // Don't throw - allow form submission to succeed even if email fails
  }
}
