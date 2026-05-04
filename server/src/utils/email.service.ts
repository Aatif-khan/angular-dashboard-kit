import sgMail from '@sendgrid/mail';

export const sendResetPasswordEmail = async (email: string, resetToken: string) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  
  console.log(`📤 Attempting to send email FROM: "${fromEmail}" TO: "${email}"`);

  if (!apiKey || !fromEmail) {
    console.warn('⚠️ SendGrid credentials missing in .env. Falling back to terminal logging.');
    return;
  }

  sgMail.setApiKey(apiKey);

  const resetLink = `http://localhost:4200/auth/reset-password?token=${resetToken}`;

  const msg = {
    to: email,
    from: {
      email: fromEmail,
      name: 'DashKit Admin'
    },
    subject: 'Password Reset Request - DashKit',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Reset Your Password</h2>
        <p style="color: #475569; line-height: 1.6;">You requested to reset your password for your DashKit account. Click the button below to set a new one. This link is valid for 1 hour.</p>
        <div style="margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #64748b; font-size: 12px;">DashKit Admin Team</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`📧 Reset email sent to ${email} via SendGrid`);
  } catch (error: any) {
    console.error('❌ SendGrid Error:', error.response?.body || error.message);
    throw new Error('Failed to send reset email');
  }
};
