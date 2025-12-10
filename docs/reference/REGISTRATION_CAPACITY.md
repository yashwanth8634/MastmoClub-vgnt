# Event Registration - Auto-Approval & Capacity Management

## Overview
Event registrations are now **automatically approved** on submission. Registration closes based on either:
1. **Deadline reaches** - Date/time specified in event
2. **Capacity limit reached** - When current registrations >= max registrations

## Key Changes

### 1. Event Registration Auto-Approval
- Event registrations have `status: "approved"` immediately
- No admin approval needed for event registrations
- Confirmation emails sent instantly to all team members
- Only **membership applications** require admin approval

### 2. Capacity-Based Registration Closing
- When creating an event, set `maxRegistrations` value (0 = unlimited)
- Registration closes automatically when limit is reached
- Users see "Registration Full" instead of "Registration Closed"

### 3. UI Updates
**Event Details Page:**
- Shows current registrations vs max: "45/100 registered"
- "Register Now" button changes to "Registration Full" when capacity reached
- "Registration Full" message appears before deadline if capacity exceeded

**Event Registration Page:**
- Shows "Registration capacity reached" message if full
- Users cannot access the form if capacity is reached

## How It Works

### Registration Flow
```
1. User submits registration form
2. System validates deadline: deadline not passed?
3. System validates capacity: current < max?
4. If valid:
   - Creates registration with status="approved"
   - Increments event.currentRegistrations
   - If now at capacity, sets registrationOpen=false
   - Sends confirmation emails
5. If invalid:
   - Returns error message
   - No registration created
```

### Admin Event Creation
When creating an event, set:
- `deadline` - Last date/time to register
- `maxRegistrations` - Total spots (0 for unlimited)
- `registrationOpen` - Manual override (optional)

### Example Event Setup
```
Title: Mathematics Hackathon
Deadline: 2025-12-20 23:59
Max Registrations: 50
Team Size: 2-4 members

When 50 teams register → registration automatically closes
If deadline passes → registration automatically closes
```

## Member Emails

### Event Registration (Auto-Sent)
- **When:** User successfully registers
- **To:** All team members
- **Content:** Confirms registration, shows team info
- **Status:** Registration confirmed as "approved"

### Membership Application (Admin-Controlled)
- **When:** User applies to join club
- **Pending Email:** Immediate (automatic)
- **Approval Email:** Admin approves in dashboard
- **Rejection Email:** Admin rejects in dashboard

## Admin Dashboard
- View all registrations (both event and membership)
- Approve/Reject **membership applications only**
- Event registrations show as already "approved"
- Can delete any registration if needed

## Database Fields
```
Event Model:
- deadline: Date (deadline for registration)
- maxRegistrations: Number (capacity limit, 0=unlimited)
- currentRegistrations: Number (auto-incremented)
- registrationOpen: Boolean (auto-set based on capacity)

Registration Model:
- status: "approved" (for events) or "pending" (for membership)
- eventName: String (links to event)
- eventId: ObjectId (for event registrations)
```
