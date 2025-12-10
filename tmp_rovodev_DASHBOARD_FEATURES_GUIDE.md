# Student Dashboard - Profile & Messaging Features Guide

## ✅ Implemented Features

### 1. Upcoming Appointment Panel

When a student has an **accepted** or **rescheduled** appointment, the dashboard shows:

- **Counselor Name**: Displayed as "with [Counselor Name]"
- **Two Action Buttons**:
  - 🔵 **View Profile** - Opens counselor profile modal
  - 🟣 **Message** - Opens chat modal directly

**Location**: Left panel under "Upcoming Appointment"

**Code Reference**: `StudentDashboard.jsx` lines 178-204

```jsx
{nextAppt.counselorId && (nextAppt.status === 'Confirmed' || nextAppt.status === 'Rescheduled') && (
  <div className="mt-4 pt-4 border-t border-maroon-200">
    <p className="text-xs text-maroon-700 mb-2 font-medium">Contact your counselor:</p>
    <div className="flex gap-2">
      <button onClick={() => setSelectedProfile(counselor)}>
        View Profile
      </button>
      <button onClick={() => setChatRecipient(counselor)}>
        Message
      </button>
    </div>
  </div>
)}
```

---

### 2. Upcoming Tests Panel

Each test item shows:

- **Counselor Name**: "Counselor: [Name]"
- **Two Buttons** (for accepted tests):
  - 👤 **Profile** - Opens counselor profile modal
  - 💬 **Message** - Opens chat modal

**Location**: Right panel under "Upcoming Tests"

**Code Reference**: `StudentDashboard.jsx` lines 259-276

```jsx
{counselor && isAccepted && (
  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
    <button onClick={() => setSelectedProfile(counselor)}>
      Profile
    </button>
    <button onClick={() => setChatRecipient(counselor)}>
      Message
    </button>
  </div>
)}
```

---

### 3. Profile View Modal (SPA-Style)

**Component**: `ProfileViewModal.jsx`

When clicking "View Profile" or "Profile" button:
- Modal opens without page reload (SPA behavior)
- Shows counselor information:
  - Profile avatar (initials)
  - Name and role
  - Contact information (email, phone)
  - Professional information (Employee ID, Department, Specialization)
  - Bio/About section
- **"Send Message" button** inside modal
  - Closes profile modal
  - Opens chat modal automatically

**Features**:
- Click outside or X button to close
- Smooth transition animations
- Responsive design

---

### 4. Chat Modal (SPA-Style)

**Component**: `ChatModal.jsx`

When clicking "Message" button (from dashboard or profile modal):
- Chat modal opens without page reload
- Real-time messaging interface
- Shows conversation history
- Features:
  - Message input with textarea
  - Send button
  - Enter key to send
  - Auto-scroll to latest message
  - Timestamps for each message
  - Different styling for sent/received messages

**Message Context**: Uses `MessagesContext` for state management

---

## User Flow Examples

### Flow 1: View Profile → Send Message
1. Student sees upcoming appointment with counselor
2. Clicks "View Profile" button
3. Profile modal opens showing counselor details
4. Clicks "Send Message" inside profile
5. Profile closes, chat modal opens
6. Student can send messages

### Flow 2: Direct Message
1. Student sees upcoming test with counselor
2. Clicks "Message" button directly
3. Chat modal opens immediately
4. Student can send messages

---

## Testing Instructions

### As a Student User:

1. **Login**: Use `student1@msu.edu.ph` / `pass123`

2. **Create Test Data**:
   - The dashboard needs appointments/tests with `status: 'accepted'` or `status: 'rescheduled'`
   - These need a `counselorId` assigned

3. **Test Profile View**:
   - Click "View Profile" on appointment panel
   - Verify counselor details show correctly
   - Click "Send Message" inside profile

4. **Test Direct Messaging**:
   - Click "Message" button directly
   - Send a test message
   - Verify it appears in chat

---

## Technical Implementation

### State Management:
```jsx
const [selectedProfile, setSelectedProfile] = useState(null);
const [chatRecipient, setChatRecipient] = useState(null);
```

### Modals Rendering:
```jsx
{selectedProfile && (
  <ProfileViewModal
    user={selectedProfile}
    onClose={() => setSelectedProfile(null)}
    onOpenChat={(user) => {
      setSelectedProfile(null);
      setChatRecipient(user);
    }}
  />
)}

{chatRecipient && (
  <ChatModal
    recipientUser={chatRecipient}
    onClose={() => setChatRecipient(null)}
  />
)}
```

### Key Features:
- ✅ SPA behavior (no page reloads)
- ✅ Modal overlays with backdrop
- ✅ Proper z-index layering
- ✅ Click-outside-to-close
- ✅ Smooth transitions
- ✅ Responsive design

---

## Current Status

🎉 **All requested features are fully implemented and functional!**

The student dashboard already has:
- Profile viewing for counselors on accepted appointments
- Profile viewing for counselors on accepted tests
- Direct messaging from dashboard
- Messaging from within profile modal
- Full SPA experience (no page reloads)

No additional changes needed!
