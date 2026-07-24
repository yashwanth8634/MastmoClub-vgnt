// ============================================================================
// MASTMO EMAIL TEMPLATES — matched to site theme (dark navy / cyan / gothic wordmark)
// ============================================================================
// Drop-in replacement: same function signatures as before.
// Theme reference: mastmovgnt.in — dark starfield bg, cyan (#22E5FF) neon accent,
// bold display wordmark, monospace tracked-uppercase labels, pill buttons.

const THEME = {
  bgDark: "#04060D",       // near-black navy, matches site background
  bgDarkGradientEnd: "#0B1130",
  cyan: "#22E5FF",         // neon cyan accent used across the site
  white: "#FFFFFF",
  textMuted: "#9CA3AF",
  bodyBg: "#0E1220",       // slightly lighter than pure black for the content card
  bodyText: "#D7DAE3",
  cardBg: "#151A2E",
};

// Monospace stack for tracked-uppercase labels/badges (mirrors the site's "VGNT CAMPUS CHAPTER" pill)
const MONO_FONT = "'Courier New', Courier, monospace";
// Clean serif for readable body copy (email-safe, evokes the site's serif body text)
const BODY_FONT = "Georgia, 'Times New Roman', serif";

// ============================================================================
// SHARED LAYOUT
// ============================================================================

function wrapEmail(opts: {
  eyebrow: string; // small tracked-uppercase pill label, e.g. "MEMBERSHIP UPDATE"
  bodyHtml: string;
}): string {
  const { eyebrow, bodyHtml } = opts;

  return `
  <div style="font-family: ${BODY_FONT}; max-width: 640px; margin: 0 auto; background: ${THEME.bgDark};">

    <!-- Header: dark navy, cyan asterisk accent, wordmark -->
    <div style="background: linear-gradient(180deg, ${THEME.bgDark} 0%, ${THEME.bgDarkGradientEnd} 100%); padding: 48px 30px 40px; text-align: center;">

      <!-- Eyebrow pill badge -->
      <div style="display:inline-block; border: 1px solid ${THEME.cyan}; border-radius: 999px; padding: 6px 18px; margin-bottom: 24px;">
        <span style="font-family: ${MONO_FONT}; font-size: 11px; letter-spacing: 2px; color: ${THEME.cyan}; font-weight: 700;">
          ${eyebrow}
        </span>
      </div>

      <!-- Wordmark -->
      <div style="font-size: 40px; font-weight: 800; color: ${THEME.white}; letter-spacing: 1px; font-family: Georgia, serif;">
        MASTMO<span style="color: ${THEME.cyan};">*</span>
      </div>
      <div style="font-family: ${MONO_FONT}; font-size: 11px; letter-spacing: 3px; color: ${THEME.cyan}; margin-top: 10px;">
        MATHEMATICAL &amp; STATISTICAL MODELING CLUB
      </div>
    </div>

    <!-- Content card -->
    <div style="background: ${THEME.bodyBg}; padding: 40px 34px;">
      ${bodyHtml}
    </div>

    <!-- Footer -->
    <div style="background: ${THEME.bgDark}; padding: 32px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08);">
      <div style="font-family: ${MONO_FONT}; font-size: 11px; letter-spacing: 1.5px; color: ${THEME.textMuted}; margin-bottom: 14px;">
        MASTMO CLUB &middot; VIGNAN INSTITUTE OF TECHNOLOGY AND SCIENCE
      </div>
      <div style="font-size: 13px; color: ${THEME.textMuted};">
        📧 <a href="mailto:support@mastmovgnt.in" style="color: ${THEME.cyan}; text-decoration: none;">support@mastmovgnt.in</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        📸 <a href="https://instagram.mastmovgnt.in" style="color: ${THEME.cyan}; text-decoration: none;">@mastmo_vgnt</a>
      </div>
      <div style="font-size: 11px; color: #565B70; margin-top: 18px;">
        © ${new Date().getFullYear()} MASTMO. All rights reserved.
      </div>
    </div>
  </div>
  `;
}

// Section title inside the content card
function sectionTitle(text: string): string {
  return `<h1 style="margin:0 0 20px; font-size:24px; color:${THEME.white}; font-weight:700; font-family: Georgia, serif;">${text}</h1>`;
}

function bodyText(text: string): string {
  return `<p style="margin:0 0 18px; font-size:15px; line-height:1.7; color:${THEME.bodyText};">${text}</p>`;
}

// Info card matching the site's bordered/cyan-accented panels
function infoCard(innerHtml: string, accentColor: string = THEME.cyan): string {
  return `
    <div style="background: ${THEME.cardBg}; border-left: 3px solid ${accentColor}; border-radius: 8px; padding: 20px 22px; margin: 22px 0;">
      ${innerHtml}
    </div>
  `;
}

function infoRow(label: string, value: string): string {
  return `<p style="margin:6px 0; font-size:14px; color:${THEME.bodyText}; line-height:1.6;"><span style="color:${THEME.textMuted};">${label}:</span> <strong style="color:${THEME.white};">${value}</strong></p>`;
}

// Pill button — solid (matches "Explore Events" white pill) or outlined (matches "Become a Member")
function pillButton(text: string, url: string, variant: "solid" | "outline" = "solid"): string {
  const styles =
    variant === "solid"
      ? `background-color: ${THEME.white}; color: #0A0A0A;`
      : `background-color: transparent; color: ${THEME.white}; border: 1px solid rgba(255,255,255,0.4);`;

  return `
    <div style="text-align:center; margin: 30px 0 10px;">
      <a href="${url}" style="display:inline-block; padding:14px 32px; font-size:14px; font-weight:700; text-decoration:none; border-radius:999px; ${styles}">
        ${text}
      </a>
    </div>
  `;
}

// ============================================================================
// TEMPLATES (same signatures as before — drop-in replacement)
// ============================================================================

export const emailTemplates = {
  // ---------------------------------------------------------------------------
  // 1. MEMBERSHIP EMAILS
  // ---------------------------------------------------------------------------
  membershipPending: (name: string) => ({
    subject: "MASTMO Club - Membership Application Received",
    html: wrapEmail({
      eyebrow: "APPLICATION RECEIVED",
      bodyHtml: `
        ${sectionTitle("Thanks for applying")}
        ${bodyText(`Dear <strong style="color:${THEME.white};">${name}</strong>,`)}
        ${bodyText(`Thank you for submitting your membership application to MASTMO Club. We're glad you're interested in joining our community of thinkers, builders, and problem-solvers.`)}
        ${infoCard(`
          <p style="margin:0 0 8px; font-family:${MONO_FONT}; font-size:11px; letter-spacing:1.5px; color:${THEME.cyan}; font-weight:700;">APPLICATION STATUS</p>
          <p style="margin:0; color:${THEME.bodyText}; font-size:14px; line-height:1.6;">Your application is under review by our administration team. We typically process applications within 2–3 business days.</p>
        `)}
        ${bodyText(`Once reviewed, you'll receive a follow-up email confirming your membership status.`)}
        ${bodyText(`Questions in the meantime? Reach out on <a href="https://instagram.mastmovgnt.in" style="color:${THEME.cyan}; text-decoration:none; font-weight:600;">Instagram @mastmo_vgnt</a>.`)}
      `,
    }),
  }),

  membershipApproved: (name: string) => ({
    subject: "Welcome to MASTMO Club - Membership Approved",
    html: wrapEmail({
      eyebrow: "MEMBERSHIP APPROVED",
      bodyHtml: `
        ${sectionTitle("Welcome to MASTMO Club 🎉")}
        ${bodyText(`Dear <strong style="color:${THEME.white};">${name}</strong>,`)}
        ${bodyText(`Congratulations! Your membership application has been <strong style="color:${THEME.cyan};">approved</strong>. We're excited to have you join the club.`)}
        ${infoCard(`
          <p style="margin:0 0 12px; font-family:${MONO_FONT}; font-size:11px; letter-spacing:1.5px; color:${THEME.cyan}; font-weight:700;">✓ MEMBERSHIP ACTIVE</p>
          <p style="margin:6px 0; color:${THEME.bodyText}; font-size:14px; line-height:1.6;">→ Access to all upcoming events and competitions</p>
          <p style="margin:6px 0; color:${THEME.bodyText}; font-size:14px; line-height:1.6;">→ Participate in team-based activities and hackathons</p>
          <p style="margin:6px 0; color:${THEME.bodyText}; font-size:14px; line-height:1.6;">→ Connect with fellow members and mentors</p>
        `)}
        ${bodyText(`We look forward to your active participation. See you at the next event!`)}
        ${pillButton("Explore Events", "https://www.mastmovgnt.in/events", "solid")}
      `,
    }),
  }),

  membershipRejected: (name: string, reason?: string) => ({
    subject: "MASTMO Club - Membership Application Update",
    html: wrapEmail({
      eyebrow: "APPLICATION UPDATE",
      bodyHtml: `
        ${sectionTitle("Application Update")}
        ${bodyText(`Dear <strong style="color:${THEME.white};">${name}</strong>,`)}
        ${bodyText(`Thank you for your interest in MASTMO Club. After careful review, we're unable to approve your membership request at this time.`)}
        ${reason ? infoCard(`
          <p style="margin:0 0 8px; font-family:${MONO_FONT}; font-size:11px; letter-spacing:1.5px; color:${THEME.textMuted}; font-weight:700;">REASON</p>
          <p style="margin:0; color:${THEME.bodyText}; font-size:14px; line-height:1.6;">${reason}</p>
        `, "#565B70") : ""}
        ${bodyText(`Please don't be discouraged — we'd genuinely encourage you to reapply in our next recruitment cycle.`)}
      `,
    }),
  }),

  // ---------------------------------------------------------------------------
  // 2. EVENT REGISTRATION EMAILS
  // ---------------------------------------------------------------------------
  eventRegistrationConfirmed: (name: string, eventName: string, teamName?: string) => ({
    subject: `Event Registration Confirmed - ${eventName}`,
    html: wrapEmail({
      eyebrow: "REGISTRATION CONFIRMED",
      bodyHtml: `
        ${sectionTitle("You're registered! ✦")}
        ${bodyText(`Dear <strong style="color:${THEME.white};">${name}</strong>,`)}
        ${bodyText(`Your registration for <strong style="color:${THEME.cyan};">${eventName}</strong> has been successfully received and confirmed.`)}
        ${infoCard(`
          <p style="margin:0 0 10px; font-family:${MONO_FONT}; font-size:11px; letter-spacing:1.5px; color:${THEME.cyan}; font-weight:700;">✓ REGISTRATION DETAILS</p>
          ${infoRow("Event", eventName)}
          ${teamName ? infoRow("Team Name", teamName) : ""}
          ${infoRow("Status", "Confirmed")}
        `)}
        ${bodyText(`Need to make changes? Reach out on <a href="https://instagram.mastmovgnt.in" style="color:${THEME.cyan}; text-decoration:none; font-weight:600;">Instagram @mastmo_vgnt</a>.`)}
      `,
    }),
  }),

  // ---------------------------------------------------------------------------
  // 3. NEW EVENT ANNOUNCEMENT
  // ---------------------------------------------------------------------------
  newEventAnnouncement: (eventName: string, eventDate: string, eventLink: string) => ({
    subject: `📢 New Event Alert: ${eventName}`,
    html: wrapEmail({
      eyebrow: "NEW EVENT ALERT",
      bodyHtml: `
        ${sectionTitle(eventName)}
        ${bodyText(`Hello Member,`)}
        ${bodyText(`We're excited to announce a brand new event! Check out the details below and register to participate.`)}
        ${infoCard(`
          ${infoRow("📅 Date", new Date(eventDate).toDateString())}
        `)}
        ${pillButton("View Event & Register", eventLink, "solid")}
        ${bodyText(`<span style="text-align:center; display:block; color:${THEME.textMuted}; font-size:13px;">Don't miss out — registrations are open now.</span>`)}
      `,
    }),
  }),
};