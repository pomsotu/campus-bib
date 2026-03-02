/**
 * No-Show Rebooking Email Template
 * Used by: L2-W8 (No-Show Handler)
 *
 * Sent to leads who no-showed their session.
 * Also sends a notification to the client.
 */

interface NoShowRebookingData {
  leadName: string;
  clientName: string;
  clientBusinessName: string;
  serviceType: string;
  sessionDate: string;
  sessionTime: string;
  bookingLink: string;
}

// --- Lead-facing (rebooking offer) ---

export function noShowRebookingLeadSubject(data: NoShowRebookingData): string {
  return `Missed your session? Let's rebook — ${data.clientBusinessName}`;
}

export function noShowRebookingLeadHtml(data: NoShowRebookingData): string {
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
          No worries — life happens! 🤝
        </h2>
        
        <p>Hi ${data.leadName},</p>
        <p>We noticed you weren't able to make your ${data.serviceType} session 
        on ${data.sessionDate} at ${data.sessionTime}. No stress at all — things come up!</p>
        
        <p>If you'd still like to connect, we'd love to get you rebooked:</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="${data.bookingLink}" 
             style="background-color: #6366f1; color: white; padding: 14px 32px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600;
                    display: inline-block; font-size: 16px;">
            Pick a New Time →
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          If your plans have changed, no action needed — we understand.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          Sent on behalf of ${data.clientBusinessName}. Powered by Campus BIB
        </p>
      </div>
    </body>
    </html>
  `;
}

// --- Client-facing (no-show notification) ---

export function noShowClientSubject(data: NoShowRebookingData): string {
  return `No-Show: ${data.leadName} — ${data.sessionDate}`;
}

export function noShowClientHtml(data: NoShowRebookingData): string {
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
          Session No-Show 📭
        </h2>
        
        <p>Hey ${data.clientName},</p>
        <p><strong>${data.leadName}</strong> didn't show up for their session on 
        ${data.sessionDate} at ${data.sessionTime}.</p>
        
        <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #065f46; font-size: 14px;">
            ✅ <strong>Already handled:</strong> We've automatically sent them a 
            rebooking link. If they rebook, you'll be notified.
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          The session has been marked as "no-show" in your dashboard.
          No action needed from you.
        </p>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">— Campus BIB</p>
      </div>
    </body>
    </html>
  `;
}
