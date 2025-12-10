# Duplicate Validation - Membership & Event Registration

## Overview
All duplicates are now handled smoothly with clear error messages across both membership applications and event registrations.

## Membership Application Validation

### Checks Performed (in order):
1. **Email Check** - Ensures email is unique
   - Error: "This email is already registered"

2. **Phone Check** - Ensures phone number is unique
   - Error: "This phone number is already registered"

3. **Roll Number Check** - Ensures roll number is unique
   - Error: "This roll number is already registered"

4. **Roll Format Check** - Validates roll number format for branch
   - Error: "[Roll] is not a valid roll number for [Branch]"

### Database Query:
```typescript
// Check for duplicates in membership table
await Registration.findOne({ 
  "members.email": email,
  eventName: "General Membership" 
});
```

## Event Registration Validation

### Checks Performed (in order):

#### 1. **Existing Event Registration**
   - Checks if any team member is already registered for THIS event
   - Error: "{Name} is already registered for this event"
   
   ```typescript
   const existingReg = await Registration.findOne({
     eventId,
     "members.rollNo": member.rollNo
   });
   ```

#### 2. **Duplicate Within Team**
   - Checks for duplicate roll numbers in team members
   - Error: "Duplicate roll numbers in team members"
   
   - Checks for duplicate emails in team members
   - Error: "Duplicate emails in team members"

#### 3. **Team Size Validation**
   - Ensures team meets min/max size requirements
   - Error: "Team must have {min}-{max} members"

#### 4. **Event Capacity Check**
   - Ensures event hasn't reached max registrations
   - Error: "Event registration is full"

## User-Friendly Messages

All error messages are displayed in a red alert box on the form:
```
❌ This email is already registered
```

Users can then:
1. Use a different email
2. Check if they already registered
3. Contact admin for duplicate issues

## Flow Diagram

### Membership:
```
User submits → Email check → Phone check → Roll check → Format check → Create
     ✓              ✓             ✓             ✓           ✓
```

### Event:
```
User submits → Parse members → Existing event check → Duplicate in team check 
     ✓              ✓                    ✓                        ✓
     
→ Team size check → Capacity check → Create
     ✓                    ✓
```

## Test Cases

### Membership Duplicates:
- ✅ User tries to register with same email → "already registered"
- ✅ User tries to register with same phone → "already registered"
- ✅ User tries to register with same roll → "already registered"
- ✅ Valid new application → success

### Event Registration Duplicates:
- ✅ Same person registers twice for event → "already registered"
- ✅ Team has duplicate roll numbers → "duplicate roll numbers"
- ✅ Team has duplicate emails → "duplicate emails"
- ✅ Individual event duplicate → "already registered"
- ✅ Valid registration → success

## Graceful Error Handling

All validations return:
```typescript
{
  success: false,
  message: "Clear error message describing the issue"
}
```

Form displays this message to user in real-time without page reload.

## Database Efficiency

All checks use indexed queries on:
- `members.email`
- `members.phone`
- `members.rollNo`
- `eventId` + `members.rollNo` combination

Ensures fast validation even with large datasets.
