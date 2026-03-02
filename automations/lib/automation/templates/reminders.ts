/**
 * Session Reminder Email Templates
 * Used by: L2-W7 (Session Reminders)
 *
 * Two variants: 24-hour reminder and 1-hour reminder.
 * Both are sent to the lead AND the client.
 */

interface ReminderData {
  leadName: string;
  clientName: string;
  clientBusinessName: string;
  serviceType: string;
  sessionDate: string;
  sessionTime: string;
  meetingLink: string;
  rescheduleLink: string;
}

// ─── 24-Hour Reminder ────────────────────────────────────────

export function reminder24hrSubject(data: ReminderData): string {
  return `Reminder: Session tomorrow at ${data.sessionTime}`;
}

export function reminder24hrLeadHtml(data: ReminderData): string {
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
          Friendly Reminder 📅
        </h2>
        
        <p>Hi ${data.leadName},</p>
        <p>Just a heads up — your ${data.serviceType} session with 
        <strong>${data.clientBusinessName}</strong> is tomorrow.</p>
        
        <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #92400e; font-size: 14px;">📅 Date</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #92400e;">${data.sessionDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #92400e; font-size: 14px;">🕐 Time</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #92400e;">${data.sessionTime}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.meetingLink}" 
             style="background-color: #6366f1; color: white; padding: 12px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600;
                    display: inline-block;">
            Join Link (save for tomorrow) →
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Can't make it? <a href="${data.rescheduleLink}" style="color: #6366f1;">Reschedule here</a>
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

export function reminder24hrClientHtml(data: ReminderData): string {
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
          Session Tomorrow 📋
        </h2>
        
        <p>Hey ${data.clientName},</p>
        <p>You have a session with <strong>${data.leadName}</strong> tomorrow.</p>
        
        <div style="background: #f0f0ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>${data.sessionDate}</strong> at <strong>${data.sessionTime}</strong></p>
          <p style="margin: 4px 0; color: #6b7280;">Service: ${data.serviceType}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
          Your lead has also been reminded. — Campus BIB
        </p>
      </div>
    </body>
    </html>
  `;
}

// ─── 1-Hour Reminder ─────────────────────────────────────────

export function reminder1hrSubject(data: ReminderData): string {
  return `Starting in 1 hour — ${data.clientBusinessName} session`;
}

export function reminder1hrLeadHtml(data: ReminderData): string {
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
          Starting Soon! ⏰
        </h2>
        
        <p>Hi ${data.leadName}, your session starts in <strong>1 hour</strong>.</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="${data.meetingLink}" 
             style="background-color: #059669; color: white; padding: 16px 36px; 
                    text-decoration: none; border-radius: 8px; font-weight: 700;
                    display: inline-block; font-size: 18px;">
            Join Session Now →
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Looking forward to it! 🙌
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

export function reminder1hrClientHtml(data: ReminderData): string {
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
        <p>Hey ${data.clientName}, your session with <strong>${data.leadName}</strong> starts in 1 hour.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${data.meetingLink}" 
             style="background-color: #059669; color: white; padding: 12px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600;
                    display: inline-block;">
            Join →
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">— Campus BIB</p>
      </div>
    </body>
    </html>
  `;
}
