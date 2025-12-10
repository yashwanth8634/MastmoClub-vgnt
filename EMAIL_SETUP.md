# Email Configuration Guide

## Overview
The MASTMO Club application now sends automated emails for:
- ✅ Membership application confirmation (pending approval)
- ✅ Membership approval notification
- ✅ Membership rejection notification
- ✅ Event registration confirmation
- ✅ Event registration approval

## Gmail Setup Instructions

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on "2-Step Verification" in the left sidebar
3. Follow the prompts to set up 2-Step Verification with your phone

### Step 2: Generate App Password
1. Return to [Google Account Security](https://myaccount.google.com/security)
2. Scroll down and click "App passwords" (only available if 2-Step Verification is enabled)
3. Select "Mail" from the app dropdown
4. Select "Windows Computer" (or your operating system)
5. Click "Generate"
6. Google will display a 16-character password - copy this

### Step 3: Configure Environment Variables
1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Gmail credentials:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```
   
   Replace:
   - `your-email@gmail.com` with your actual Gmail address
   - `xxxx xxxx xxxx xxxx` with the 16-character app password from Step 2

### Step 4: Verify Setup
1. Restart the development server: `npm run dev`
2. Test by submitting a membership application at `/join`
3. Check the email inbox for the confirmation email

## Email Templates

### Membership Pending
- **Trigger**: User submits membership application
- **Recipient**: Applicant email
- **Content**: Informs user their application is pending admin approval

### Membership Approved
- **Trigger**: Admin approves membership in dashboard
- **Recipient**: Applicant email
- **Content**: Welcomes user as club member

### Membership Rejected
- **Trigger**: Admin rejects membership in dashboard
- **Recipient**: Applicant email
- **Content**: Informs user of rejection

### Event Registration Confirmed
- **Trigger**: User registers for event
- **Recipient**: All team members' emails
- **Content**: Confirms event registration (team or individual)

### Event Registration Approved
- **Trigger**: Admin approves event registration
- **Recipient**: All team members' emails
- **Content**: Confirms registration approval

## Troubleshooting

### Emails Not Sending
1. **Check credentials**: Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env.local`
2. **Restart server**: Kill and restart with `npm run dev`
3. **Check logs**: Look for error messages in terminal output
4. **Verify app password**: Ensure you copied the 16-character password correctly (includes spaces)

### Gmail Blocks Login
If you see "Less secure app access" warning:
1. The app password method should work - use that instead
2. Never use your actual Gmail password in code

### 2-Step Verification Issues
1. Ensure 2-Step Verification is fully enabled
2. Wait a few minutes after enabling before generating app password
3. If issues persist, disable and re-enable 2-Step Verification

## Email Customization

To modify email templates, edit `/src/lib/emailTemplates.ts`:
- All email HTML templates are defined here
- Each template is a function that accepts recipient name and event details
- Templates use inline CSS for better email client compatibility

## Deployment Considerations

When deploying to production:
1. Never commit `.env.local` to git - use `.env.example` for reference
2. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` as environment variables in your hosting platform
3. Consider using a dedicated Gmail account for the club (e.g., `mastmoclub@gmail.com`)
4. Test email sending in staging environment before production deployment
