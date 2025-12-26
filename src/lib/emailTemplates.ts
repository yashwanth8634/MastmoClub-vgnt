export const emailTemplates = {
  // ---------------------------------------------------------------------------
  // 1. MEMBERSHIP EMAILS
  // ---------------------------------------------------------------------------
  membershipPending: (name: string) => ({
    subject: "MASTMO Club - Membership Application Received",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <div style="background: linear-gradient(135deg, #00f0ff 0%, #0099cc 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">MASTMO CLUB</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">MATHEMATICAL & STATISTICAL MODELING</p>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Thank you for submitting your membership application to MASTMO Club. We are pleased to receive your application and appreciate your interest in joining our community.
          </p>
          <div style="background: #f5f5f5; border-left: 4px solid #00f0ff; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #00f0ff; font-weight: 600; font-size: 14px;">APPLICATION STATUS</p>
            <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.6;">
              Your application is currently under review by our administration team. We typically process applications within 2-3 business days.
            </p>
          </div>
          <p style="font-size: 15px; color: #555; margin: 20px 0; line-height: 1.7;">
            Once your application has been reviewed and approved, you will receive a welcome email confirming your membership status.
          </p>
          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
            If you have any questions, reach out at <a href="https://www.instagram.com/mastmo_vgnt/" style="color: #00f0ff; text-decoration: none; font-weight: 600;">Instagram @mastmo_vgnt</a>.
          </p>
        </div>
        <div style="background: #f9f9f9; border-top: 1px solid #e0e0e0; padding: 30px; text-align: center;">
          <p style="font-size: 14px; color: #888; margin: 0 0 10px 0;">MASTMO Club, Vignan Institute of Technology and Science</p>
          <p style="font-size: 12px; color: #aaa; margin: 0;">© 2025 MASTMO Club. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  membershipApproved: (name: string) => ({
    subject: "Welcome to MASTMO Club - Membership Approved",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <div style="background: linear-gradient(135deg, #00f0ff 0%, #0099cc 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">🎉 WELCOME!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">You are now a member of MASTMO Club</p>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Congratulations! Your membership application to MASTMO Club has been approved. We are excited to have you as part of our community.
          </p>
          <div style="background: #f5f5f5; border-left: 4px solid #00f0ff; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; color: #00f0ff; font-weight: 600; font-size: 14px;">✓ MEMBERSHIP ACTIVE</p>
            <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
              <li style="margin: 8px 0; line-height: 1.6;">Access to all upcoming events and competitions</li>
              <li style="margin: 8px 0; line-height: 1.6;">Participate in team-based activities and hackathons</li>
              <li style="margin: 8px 0; line-height: 1.6;">Connect with fellow club members and mentors</li>
            </ul>
          </div>
          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
             We look forward to your active participation! For any queries, reach out at <a href="https://www.instagram.com/mastmo_vgnt/" style="color: #00f0ff; text-decoration: none; font-weight: 600;">Instagram @mastmo_vgnt</a>.
          </p>
        </div>
        <div style="background: #f9f9f9; border-top: 1px solid #e0e0e0; padding: 30px; text-align: center;">
          <p style="font-size: 14px; color: #888; margin: 0 0 10px 0;">MASTMO Club, Vignan Institute of Technology and Science</p>
          <p style="font-size: 12px; color: #aaa; margin: 0;">© 2025 MASTMO Club. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  membershipRejected: (name: string, reason?: string) => ({
    subject: "MASTMO Club - Membership Application Update",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <div style="background: linear-gradient(135deg, #666 0%, #444 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">APPLICATION UPDATE</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">MASTMO Club</p>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Thank you for your interest in MASTMO Club. After careful review, we regret to inform you that we are unable to approve your membership request at this time.
          </p>
          ${reason ? `<div style="background: #f5f5f5; border-left: 4px solid #999; padding: 20px; margin: 25px 0; border-radius: 4px;"><p style="margin: 0 0 10px 0; color: #666; font-weight: 600; font-size: 14px;">REASON</p><p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">${reason}</p></div>` : ""}
          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
            Please don't be discouraged. We encourage you to reapply in the future.
          </p>
        </div>
        <div style="background: #f9f9f9; border-top: 1px solid #e0e0e0; padding: 30px; text-align: center;">
          <p style="font-size: 14px; color: #888; margin: 0 0 10px 0;">MASTMO Club, Vignan Institute of Technology and Science</p>
          <p style="font-size: 12px; color: #aaa; margin: 0;">© 2025 MASTMO Club. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // ---------------------------------------------------------------------------
  // 2. EVENT REGISTRATION EMAILS
  // ---------------------------------------------------------------------------
 eventRegistrationConfirmed: (name: string, eventName: string, teamName?: string) => ({
    subject: `Event Registration Confirmed - ${eventName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <div style="background: linear-gradient(135deg, #00f0ff 0%, #0099cc 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">REGISTRATION CONFIRMED</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Event Registration</p>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Your registration for <strong>${eventName}</strong> has been successfully received and confirmed.
          </p>
          <div style="background: #f5f5f5; border-left: 4px solid #00f0ff; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; color: #00f0ff; font-weight: 600; font-size: 14px;">✓ REGISTRATION DETAILS</p>
            <p style="margin: 8px 0; color: #666; font-size: 14px; line-height: 1.6;"><strong>Event:</strong> ${eventName}</p>
            ${teamName ? `<p style="margin: 8px 0; color: #666; font-size: 14px; line-height: 1.6;"><strong>Team Name:</strong> ${teamName}</p>` : ""}
            <p style="margin: 8px 0; color: #666; font-size: 14px; line-height: 1.6;"><strong>Status:</strong> Confirmed</p>
          </div>
          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
            If you need to make changes, please reach out at <a href="https://www.instagram.com/mastmo_vgnt/" style="color: #00f0ff; text-decoration: none; font-weight: 600;">Instagram @mastmo_vgnt</a>.
          </p>
        </div>
        <div style="background: #f9f9f9; border-top: 1px solid #e0e0e0; padding: 30px; text-align: center;">
          <p style="font-size: 14px; color: #888; margin: 0 0 10px 0;">MASTMO Club, Vignan Institute of Technology and Science</p>
          <p style="font-size: 12px; color: #aaa; margin: 0;">© 2025 MASTMO Club. All rights reserved.</p>
        </div>
      </div>
    `,
  }),



  // ---------------------------------------------------------------------------
  // 3. NEW EVENT ANNOUNCEMENT (Used when creating events)
  // ---------------------------------------------------------------------------
  newEventAnnouncement: (eventName: string, eventDate: string, eventLink: string) => ({
    subject: `📢 New Event Alert: ${eventName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <div style="background: linear-gradient(135deg, #00f0ff 0%, #0099cc 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">MASTMO CLUB</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">NEW EVENT ALERT 🚀</p>
        </div>
  
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin-top: 0;">New Event: ${eventName}</h2>
          <p style="font-size: 16px; color: #555; margin: 0 0 20px 0; line-height: 1.6;">
            Hello Member,
          </p>
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            We are excited to announce a brand new event! We invite you to check out the details and register to participate.
          </p>
  
          <div style="background: #f5f5f5; border-left: 4px solid #00f0ff; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 5px 0; color: #333;"><strong>📅 Date:</strong> ${new Date(eventDate).toDateString()}</p>
            <p style="margin: 5px 0; color: #333;"><strong>📍 Check details & Register below:</strong></p>
          </div>
  
          <div style="text-align: center; margin: 35px 0;">
            <a href="${eventLink}" style="background-color: #000; color: #00f0ff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              View Event & Register
            </a>
          </div>
  
          <p style="font-size: 14px; color: #777; margin: 20px 0 0 0; line-height: 1.6; text-align: center;">
            Don't miss out! Registrations are open now.
          </p>
        </div>
  
        <div style="background: #f9f9f9; border-top: 1px solid #e0e0e0; padding: 30px; text-align: center;">
          <p style="font-size: 14px; color: #888; margin: 0 0 10px 0;">
            MASTMO Club, Vignan Institute of Technology and Science
          </p>
          <p style="font-size: 12px; color: #aaa; margin: 0;">
            © 2025 MASTMO Club. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }),
};