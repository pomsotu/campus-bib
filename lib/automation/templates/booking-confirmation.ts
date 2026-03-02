/**
 * Booking Confirmation Email Template
 * Used by: L2-W4 (Booking Confirmation & Setup)
 *
 * Sent to both the lead AND the client when a session is booked.
 */

interface BookingConfirmationData {
  leadName: string;
  clientBusinessName: string;
  clientName: string;
  serviceType: string;
  sessionDate: string; // Formatted date string, e.g., "Monday, March 10"
  sessionTime: string; // Formatted time string, e.g., "3:00 PM EST"
  sessionDuration: number; // in minutes
  meetingLink: string;
  rescheduleLink: string;
}

// --- Lead-facing email ---

export function bookingConfirmationLeadSubject(data: BookingConfirmationData): string {
  return `Session Confirmed — ${data.sessionDate} at ${data.sessionTime}`;
}

export function bookingConfirmationLeadHtml(data: BookingConfirmationData): string {
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
          You're all set! ✅
        </h2>
        
        <p>Hi ${data.leadName},</p>
        <p>Your ${data.serviceType} session with <strong>${data.clientBusinessName}</strong> is confirmed.</p>
        
        <div style="background: #f0f0ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Date</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right;">${data.sessionDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Time</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right;">${data.sessionTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Duration</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right;">${data.sessionDuration} minutes</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.meetingLink}" 
             style="background-color: #6366f1; color: white; padding: 14px 32px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600;
                    display: inline-block; font-size: 16px;">
            Join Session →
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Need to reschedule? <a href="${data.rescheduleLink}" style="color: #6366f1;">Click here</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          Sent on behalf of ${data.clientBusinessName}.<br>
          Powered by Campus BIB
        </p>
      </div>
    </body>
    </html>
  `;
}

// --- Client-facing notification ---

export function bookingConfirmationClientSubject(data: BookingConfirmationData): string {
  return `New Session Booked: ${data.leadName} — ${data.sessionDate}`;
}

export function bookingConfirmationClientHtml(data: BookingConfirmationData): string {
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
          New Session Booked 🎉
        </h2>
        
        <p>Hey ${data.clientName},</p>
        <p>A new session just got booked — here are the details:</p>
        
        <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Client</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right;">${data.leadName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Date</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right;">${data.sessionDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Time</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right;">${data.sessionTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Duration</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right;">${data.sessionDuration} min</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          A calendar invite has been added to your Google Calendar with a Zoom link.
          Your lead has also received a confirmation email.
        </p>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          — Campus BIB Automation
        </p>
      </div>
    </body>
    </html>
  `;
}
