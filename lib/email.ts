import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendReviewRequestEmail(
  to: string,
  shopName: string,
  orderId: string,
  reviewLink: string
) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Share your experience with ${shopName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for your purchase!</h2>
        <p>We hope you're enjoying your order #${orderId} from ${shopName}.</p>
        <p>Your feedback is important to us. Would you mind taking a moment to share your experience?</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${reviewLink}" 
             style="background-color: #4CAF50; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px;
                    display: inline-block;">
            Leave a Review
          </a>
        </div>
        <p>Thank you for helping us improve our service!</p>
        <p>Best regards,<br>${shopName} Team</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 