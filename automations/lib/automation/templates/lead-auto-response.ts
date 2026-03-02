/**
 * Lead Auto-Response Email Template
 * Used by: L1-W1 + L2-W1 (Lead Capture & Auto-Response)
 *
 * Sent immediately when a new lead is captured.
 * Personalized with the client's business name and service type.
 */

interface LeadAutoResponseData {
  leadName: string;
  clientBusinessName: string;
  clientServiceType: string;
  isQualified: boolean;
  bookingLink?: string; // Only included if lead is qualified
}

export function leadAutoResponseSubject(data: LeadAutoResponseData): string {
  return data.isQualified
    ? `Thanks for reaching out to ${data.clientBusinessName}!`
    : `Thanks for your interest in ${data.clientBusinessName}`;
}

export function leadAutoResponseHtml(data: LeadAutoResponseData): string {
  const qualifiedContent = `
    <p>Great news — based on what you've shared, it looks like we're a great fit!</p>
    <p>Here's what happens next:</p>
    <ol>
      <li>Pick a time that works for you using the link below</li>
      <li>You'll receive a calendar invite with a Zoom link</li>
      <li>Show up, and we'll take it from there</li>
    </ol>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.bookingLink}" 
         style="background-color: #6366f1; color: white; padding: 14px 32px; 
                text-decoration: none; border-radius: 8px; font-weight: 600;
                display: inline-block; font-size: 16px;">
        Book Your Session →
      </a>
    </div>
  `;

  const unqualifiedContent = `
    <p>We appreciate your interest! At the moment, we may not be the best fit for what you're looking for, 
    but we'd love to keep in touch.</p>
    <p>If your needs change or you have questions, don't hesitate to reach out.</p>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                 max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a2e; 
                 background-color: #f8f9fa; line-height: 1.6;">
      <div style="background: white; border-radius: 12px; padding: 32px; 
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="margin-top: 0; color: #1a1a2e;">
          Hi ${data.leadName}! 👋
        </h2>
        
        <p>Thanks for reaching out to <strong>${data.clientBusinessName}</strong>.</p>
        
        ${data.isQualified ? qualifiedContent : unqualifiedContent}
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          This message was sent on behalf of ${data.clientBusinessName}.<br>
          Powered by Campus BIB
        </p>
      </div>
    </body>
    </html>
  `;
}
