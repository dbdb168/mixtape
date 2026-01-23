import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendMixtapeEmailParams {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  mixtapeTitle: string;
  mixtapeUrl: string;
  message?: string;
  trackCount: number;
}

export async function sendMixtapeEmail({
  recipientEmail,
  recipientName,
  senderName,
  mixtapeTitle,
  mixtapeUrl,
  message,
  trackCount,
}: SendMixtapeEmailParams): Promise<{ success: boolean; error?: string }> {
  console.log('sendMixtapeEmail called with:', { recipientEmail, recipientName, senderName, mixtapeTitle, mixtapeUrl, trackCount });

  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured - skipping email');
    console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
    return { success: true }; // Don't fail if email not configured
  }

  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.warn('SendGrid from email not configured - skipping email');
    console.log('SENDGRID_FROM_EMAIL exists:', !!process.env.SENDGRID_FROM_EMAIL);
    return { success: true };
  }

  console.log('SendGrid configured, sending email from:', process.env.SENDGRID_FROM_EMAIL);

  const html = generateMixtapeEmailHtml({
    recipientName,
    senderName,
    mixtapeTitle,
    mixtapeUrl,
    message,
    trackCount,
  });

  const text = generateMixtapeEmailText({
    recipientName,
    senderName,
    mixtapeTitle,
    mixtapeUrl,
    message,
  });

  try {
    console.log('Attempting to send email to:', recipientEmail);
    const result = await sgMail.send({
      to: recipientEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Mixtape',
      },
      subject: `${senderName} sent you a mixtape!`,
      text,
      html,
    });
    console.log('SendGrid response:', result);
    return { success: true };
  } catch (error: unknown) {
    console.error('SendGrid error:', error);
    // Log full error details for SendGrid errors
    if (error && typeof error === 'object' && 'response' in error) {
      const sgError = error as { response?: { body?: unknown } };
      console.error('SendGrid error body:', sgError.response?.body);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

function generateMixtapeEmailText({
  recipientName,
  senderName,
  mixtapeTitle,
  mixtapeUrl,
  message,
}: {
  recipientName: string;
  senderName: string;
  mixtapeTitle: string;
  mixtapeUrl: string;
  message?: string;
}): string {
  return `
Hey ${recipientName}!

${senderName} sent you a mixtape: "${mixtapeTitle}"

${message ? `"${message}"\n\n` : ''}Listen to it here: ${mixtapeUrl}

---
Made with Mixtape
https://mixtape-app-eight.vercel.app
`.trim();
}

function generateMixtapeEmailHtml({
  recipientName,
  senderName,
  mixtapeTitle,
  mixtapeUrl,
  message,
  trackCount,
}: {
  recipientName: string;
  senderName: string;
  mixtapeTitle: string;
  mixtapeUrl: string;
  message?: string;
  trackCount: number;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mixtapeTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a050f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a050f;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #a413ec; padding: 10px 14px; border-radius: 8px;">
                    <span style="color: white; font-size: 14px; font-weight: bold; letter-spacing: 2px;">MIXTAPE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1f 0%, #0d0d12 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">

              <!-- Cassette Visual -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 40px 30px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border: 2px solid rgba(255,255,255,0.3); border-radius: 4px; width: 280px;">
                      <!-- Label -->
                      <tr>
                        <td style="background-color: #f5f5f5; padding: 15px; border-bottom: 3px solid rgba(0,0,0,0.1);">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="font-size: 8px; color: #666; letter-spacing: 1px;">TAPE CREATION MODE</td>
                            </tr>
                            <tr>
                              <td style="padding-top: 8px;">
                                <div style="background-color: white; border: 1px solid #ddd; padding: 8px 12px; text-align: center;">
                                  <span style="font-family: 'Marker Felt', 'Comic Sans MS', cursive; font-size: 16px; color: #000;">${mixtapeTitle}</span>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- Reels -->
                      <tr>
                        <td style="padding: 20px; background-color: rgba(0,0,0,0.2);">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td align="center">
                                <table role="presentation" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td style="width: 50px; height: 50px; background-color: #000; border: 3px solid rgba(255,255,255,0.2); border-radius: 50%;"></td>
                                    <td style="width: 60px;"></td>
                                    <td style="width: 50px; height: 50px; background-color: #000; border: 3px solid rgba(255,255,255,0.2); border-radius: 50%;"></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 10px 30px 20px; text-align: center;">
                    <p style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 0 0 5px;">
                      Hey ${recipientName}!
                    </p>
                    <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">
                      ${senderName} sent you a mixtape
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message (if provided) -->
              ${message ? `
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0 30px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                      <tr>
                        <td style="padding: 15px;">
                          <p style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Liner Notes</p>
                          <p style="color: rgba(255,255,255,0.8); font-size: 14px; font-style: italic; margin: 0; line-height: 1.5;">"${message}"</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Track Count -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 0 30px 25px;">
                    <span style="color: #a413ec; font-size: 12px; font-weight: bold; letter-spacing: 2px;">${trackCount} TRACK${trackCount !== 1 ? 'S' : ''}</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0 30px 40px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="${mixtapeUrl}" style="display: inline-block; background-color: #a413ec; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 14px; letter-spacing: 1px; box-shadow: 0 4px 0 #7a0eb0, 0 6px 20px rgba(164,19,236,0.4);">
                            PLAY MIXTAPE
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px;">
              <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">
                Made with <a href="https://mixtape-app-eight.vercel.app" style="color: #a413ec; text-decoration: none;">Mixtape</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
