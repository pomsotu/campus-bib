/**
 * Post-Session Follow-up Email Template
 * Used by: L2-W9 (Post-Session Follow-up)
 *
 * Sent to the lead 1 hour after their session ends.
 * Includes thank you, feedback request, and rebooking CTA.
 */

interface PostSessionData {
  leadName: string;
  clientName: string;
  clientBusinessName: string;
  serviceType: string;
  sessionDate: string;
  bookingLink: string; // For rebooking
  paymentPending: boolean;
  paymentAmount?: number;
}

// --- Lead-facing follow-up ---

export function postSessionLeadSubject(data: PostSessionData): string {
  return `Thanks for your session with ${data.clientBusinessName}!`;
}

export function postSessionLeadHtml(data: PostSessionData): string {
  const paymentSection = data.paymentPending
    ? `
      <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          💳 <strong>Payment reminder:</strong> You have an outstanding balance of 
          $${data.paymentAmount?.toFixed(2) || "—"} for this session.
          Please send payment at your earliest convenience.
        </p>
      </div>
    `
    : "";

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
          Thanks for the session! 🙏
        </h2>
        
        <p>Hi ${data.leadName},</p>
        <p>Hope your ${data.serviceType} session with <strong>${data.clientBusinessName}</strong> 
        on ${data.sessionDate} went well!</p>
        
        ${paymentSection}
        
        <p><strong>Quick feedback?</strong> We'd love to know how it went — 
        it only takes 30 seconds and helps us keep improving:</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; cursor: pointer;">
            <a href="#" style="text-decoration: none;">😍</a>&nbsp;&nbsp;
            <a href="#" style="text-decoration: none;">😊</a>&nbsp;&nbsp;
            <a href="#" style="text-decoration: none;">😐</a>&nbsp;&nbsp;
            <a href="#" style="text-decoration: none;">😕</a>
          </span>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        
        <p><strong>Ready for another session?</strong></p>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.bookingLink}" 
             style="background-color: #6366f1; color: white; padding: 14px 32px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600;
                    display: inline-block; font-size: 16px;">
            Book Next Session →
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          Sent on behalf of ${data.clientBusinessName}. Powered by Campus BIB
        </p>
      </div>
    </body>
    </html>
  `;
}

// --- Client-facing completion summary ---

export function postSessionClientSubject(data: PostSessionData): string {
  return `Session Completed: ${data.leadName} — ${data.sessionDate}`;
}

export function postSessionClientHtml(data: PostSessionData): string {
  const paymentBadge = data.paymentPending
    ? `<span style="background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 600;">⏳ Payment Pending</span>`
    : `<span style="background: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 600;">✅ Paid</span>`;

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
          Session Marked Complete ✅
        </h2>
        
        <p>Hey ${data.clientName},</p>
        <p>Your session with <strong>${data.leadName}</strong> has been marked as completed.</p>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>${data.sessionDate}</strong> — ${data.serviceType}</p>
          <p style="margin: 8px 0 0 0;">Payment: ${paymentBadge}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          A follow-up email with a feedback request and rebooking link has been sent to ${data.leadName} automatically.
        </p>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">— Campus BIB</p>
      </div>
    </body>
    </html>
  `;
}
