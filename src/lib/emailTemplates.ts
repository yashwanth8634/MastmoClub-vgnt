export const emailTemplates = {
  membershipPending: (name: string) => ({
    subject: "MASTMO Club - Membership Application Received",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00f0ff 0%, #0099cc 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">MASTMO CLUB</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px;">MATHEMATICAL & STATISTICAL MODELING</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Thank you for submitting your membership application to MASTMO Club. We are pleased to receive your application and appreciate your interest in joining our community.
          </p>

          <!-- Status Box -->
          <div style="background: #f5f5f5; border-left: 4px solid #00f0ff; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #00f0ff; font-weight: 600; font-size: 14px;">APPLICATION STATUS</p>
            <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.6;">
              Your application is currently under review by our administration team. We typically process applications within 2-3 business days.
            </p>
          </div>

          <p style="font-size: 15px; color: #555; margin: 20px 0; line-height: 1.7;">
            Once your application has been reviewed and approved, you will receive a welcome email confirming your membership status. You will then have access to all club events and activities.
          </p>

          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
            If you have any questions in the meantime, please don't hesitate to reach out to our team at <a href="https://www.instagram.com/mastmo_vgnt/" style="color: #00f0ff; text-decoration: none; font-weight: 600;">Instagram @mastmo_vgnt</a>.
          </p>
        </div>

        <!-- Footer -->
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

  membershipApproved: (name: string) => ({
    subject: "Welcome to MASTMO Club - Membership Approved",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00f0ff 0%, #0099cc 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">🎉 WELCOME!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">You are now a member of MASTMO Club</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Congratulations! Your membership application to MASTMO Club has been approved. We are excited to have you as part of our community.
          </p>

          <!-- Membership Details -->
          <div style="background: #f5f5f5; border-left: 4px solid #00f0ff; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; color: #00f0ff; font-weight: 600; font-size: 14px;">✓ MEMBERSHIP ACTIVE</p>
            <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
              <li style="margin: 8px 0; line-height: 1.6;">Access to all upcoming events and competitions</li>
              <li style="margin: 8px 0; line-height: 1.6;">Participate in team-based activities and hackathons</li>
              <li style="margin: 8px 0; line-height: 1.6;">Connect with fellow club members and mentors</li>
              <li style="margin: 8px 0; line-height: 1.6;">Stay updated with club announcements and opportunities</li>
            </ul>
          </div>

          <p style="font-size: 15px; color: #555; margin: 20px 0; line-height: 1.7;">
            <strong>What's Next?</strong><br/>
            Explore our upcoming events and register for activities that interest you. Visit the club website to view all available opportunities and connect with other members.
          </p>

          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
            We look forward to your active participation and contribution to MASTMO Club! For any queries, feel free to reach out at <a href="https://www.instagram.com/mastmo_vgnt/" style="color: #00f0ff; text-decoration: none; font-weight: 600;">Instagram @mastmo_vgnt</a>.
          </p>
        </div>

        <!-- Footer -->
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

  membershipRejected: (name: string, reason?: string) => ({
    subject: "MASTMO Club - Membership Application Update",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #666 0%, #444 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">APPLICATION UPDATE</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">MASTMO Club</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Thank you for your interest in MASTMO Club. After careful review of your application, we regret to inform you that we are unable to approve your membership request at this time.
          </p>

          ${reason ? `<!-- Reason Box -->
          <div style="background: #f5f5f5; border-left: 4px solid #999; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #666; font-weight: 600; font-size: 14px;">REASON</p>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">${reason}</p>
          </div>` : ""}

          <p style="font-size: 15px; color: #555; margin: 20px 0; line-height: 1.7;">
            Please don't be discouraged. We encourage you to reapply in the future or reach out to our team if you would like more feedback on your application.
          </p>

          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
            If you have any questions or concerns, please feel free to contact us at <a href="https://www.instagram.com/mastmo_vgnt/" style="color: #00f0ff; text-decoration: none; font-weight: 600;">Instagram @mastmo_vgnt</a>.
          </p>
        </div>

        <!-- Footer -->
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

  eventRegistrationConfirmed: (name: string, eventName: string, teamName?: string) => ({
    subject: `Event Registration Confirmed - ${eventName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00f0ff 0%, #0099cc 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">REGISTRATION CONFIRMED</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Event Registration</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Your registration for <strong>${eventName}</strong> has been successfully received and confirmed.
          </p>

          <!-- Registration Details -->
          <div style="background: #f5f5f5; border-left: 4px solid #00f0ff; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; color: #00f0ff; font-weight: 600; font-size: 14px;">✓ REGISTRATION DETAILS</p>
            <p style="margin: 8px 0; color: #666; font-size: 14px; line-height: 1.6;"><strong>Event:</strong> ${eventName}</p>
            ${teamName ? `<p style="margin: 8px 0; color: #666; font-size: 14px; line-height: 1.6;"><strong>Team Name:</strong> ${teamName}</p>` : ""}
            <p style="margin: 8px 0; color: #666; font-size: 14px; line-height: 1.6;"><strong>Status:</strong> Confirmed</p>
          </div>

          <p style="font-size: 15px; color: #555; margin: 20px 0; line-height: 1.7;">
            Your participation has been recorded. Please make note of the event details and ensure you are available at the scheduled date and time.
          </p>

          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
            If you have any questions or need to make changes to your registration, please reach out at <a href="https://www.instagram.com/mastmo_vgnt/" style="color: #00f0ff; text-decoration: none; font-weight: 600;">Instagram @mastmo_vgnt</a>.
          </p>
        </div>

        <!-- Footer -->
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

  eventRegistrationApproved: (name: string, eventName: string) => ({
    subject: `Registration Approved - ${eventName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00f0ff 0%, #0099cc 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">✓ ALL SET!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${eventName}</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          
          <p style="font-size: 15px; color: #555; margin: 0 0 20px 0; line-height: 1.7;">
            Great news! Your registration for <strong>${eventName}</strong> has been approved and confirmed.
          </p>

          <!-- Status Box -->
          <div style="background: #f5f5f5; border-left: 4px solid #00f0ff; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 15px 0; color: #00f0ff; font-weight: 600; font-size: 14px;">YOUR PARTICIPATION IS CONFIRMED</p>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
              You are all set to participate in this event. Please ensure you have the necessary materials and arrive on time.
            </p>
          </div>

          <p style="font-size: 15px; color: #555; margin: 20px 0; line-height: 1.7;">
            <strong>Event Guidelines:</strong><br/>
            • Arrive at least 15 minutes before the scheduled start time<br/>
            • Bring any required materials or identification<br/>
            • Follow all event instructions and rules<br/>
            • Respect other participants and organizers
          </p>

          <p style="font-size: 15px; color: #555; margin: 20px 0 0 0; line-height: 1.7;">
            We look forward to your participation and wish you the best of luck! For any queries, reach out at <a href="https://www.instagram.com/mastmo_vgnt/" style="color: #00f0ff; text-decoration: none; font-weight: 600;">Instagram @mastmo_vgnt</a>.
          </p>
        </div>

        <!-- Footer -->
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
