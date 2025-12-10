# Debug Guide: Counselor Not Showing in Student's Upcoming Tests

## Issue Description
After a counselor accepts a psychological test request, the student dashboard should show the counselor's profile avatar and contact buttons in the "Upcoming Tests" panel. However, the counselor information is not appearing.

---

## Root Cause Analysis

The code implementation is **correct**, but there might be a few reasons why it's not showing:

### Possible Issues:

1. **Browser Cache/State Issue**
   - The student dashboard might be showing cached data
   - Need to refresh the page to see updated test data

2. **Session/Context Not Updating**
   - The TestsContext might not be re-rendering after the counselor accepts
   - Both users need to refresh to see updated data

3. **Timing Issue**
   - If testing on the same browser, localStorage updates might not propagate immediately
   - Need to refresh the student dashboard after counselor accepts

---

## How the System Works

### When Counselor Accepts a Test:

1. **Counselor Dashboard** → Clicks "Accept" on pending test
2. **TestsContext.acceptTest()** is called
3. **Updates the test object:**
   ```javascript
   {
     ...test,
     status: "accepted",
     scheduledDate: date,
     scheduledTimeSlot: timeSlot,
     counselorId: currentUser?.id  // ← SETS COUNSELOR ID
   }
   ```
4. **Saves to localStorage:** `psychTests`
5. **Sends notification** to student

### When Student Views Dashboard:

1. **StudentDashboard** loads
2. **Reads from TestsContext** → which reads from localStorage
3. **For each test:**
   ```javascript
   const counselor = users?.find(u => u.id === test.counselorId);
   ```
4. **If counselor found:**
   - Shows blue avatar with counselor's initial
   - Shows "View Profile" button
   - Shows "Message" button
5. **If counselor NOT found:**
   - Shows gray "?" avatar
   - No buttons appear

---

## Testing Steps (To Reproduce & Verify)

### Step 1: Create Test Request (As Student)

1. **Login as Student:**
   - Student ID: `202329207`
   - Password: `pass123`

2. **Request a Test:**
   - Go to: Request Psychological Test
   - Fill out the form
   - Submit request

3. **Check localStorage:**
   ```javascript
   // Open browser console (F12)
   JSON.parse(localStorage.getItem('psychTests'))
   // Should show your test with status: "pending"
   // counselorId should be undefined or null
   ```

### Step 2: Accept Test (As Counselor)

1. **Logout and Login as Counselor:**
   - Email: `counselor@msu.edu.ph`
   - Password: `counselor123`

2. **Go to Dashboard**

3. **Find the pending test in "Pending Test Requests"**

4. **Click "Accept":**
   - Set a date and time
   - Click "Accept Test"

5. **Check localStorage IMMEDIATELY:**
   ```javascript
   // Open browser console (F12)
   const tests = JSON.parse(localStorage.getItem('psychTests'));
   const acceptedTest = tests.find(t => t.status === 'accepted');
   console.log('Counselor ID:', acceptedTest.counselorId);
   // Should show counselor's ID (e.g., 2)
   ```

### Step 3: View as Student (Expected Behavior)

1. **Logout and Login as Student**

2. **Go to Dashboard**

3. **Look at "Upcoming Tests" panel**

4. **EXPECTED:**
   - ✅ Blue avatar with counselor's initial (e.g., "M")
   - ✅ Shows "Counselor: [Counselor Name]"
   - ✅ "Profile" button visible
   - ✅ "Message" button visible

5. **If NOT showing:**
   - ❌ Gray "?" avatar
   - ❌ No counselor name
   - ❌ No buttons

### Step 4: Debug Why It's Not Showing

**Run in Browser Console (F12) on Student Dashboard:**

```javascript
// 1. Check if test has counselorId
const tests = JSON.parse(localStorage.getItem('psychTests'));
const myTest = tests[0]; // or find your specific test
console.log('Test:', myTest);
console.log('Counselor ID:', myTest.counselorId);

// 2. Check if users are loaded
const users = JSON.parse(localStorage.getItem('users'));
console.log('All users:', users);

// 3. Try to find the counselor manually
const counselor = users.find(u => u.id === myTest.counselorId);
console.log('Found counselor:', counselor);

// 4. Check currentUser
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
console.log('Current user:', currentUser);
```

---

## Common Issues & Solutions

### Issue 1: counselorId is `undefined` or `null`

**Symptoms:**
```javascript
test.counselorId = undefined
```

**Cause:** The test was accepted but `counselorId` wasn't saved

**Solution:**
- Make sure you're using the latest code (we added `counselorId` assignment)
- Check that `currentUser?.id` exists when accepting test
- Try accepting the test again

**Fix:**
```javascript
// In browser console on Counselor Dashboard
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
console.log('Counselor ID:', currentUser.id); // Should be 2 or similar

// If it's there, try accepting test again
```

### Issue 2: counselorId exists but counselor not found

**Symptoms:**
```javascript
test.counselorId = 2
counselor = undefined
```

**Cause:** User lookup is failing

**Solution:**
- Check if users array has the counselor
- Verify the ID matches

**Debug:**
```javascript
const users = JSON.parse(localStorage.getItem('users'));
const counselorId = 2; // whatever the test.counselorId is
const counselor = users.find(u => u.id === counselorId);
console.log('Counselor:', counselor);

// If not found, check all user IDs
users.forEach(u => console.log(`${u.name}: id=${u.id}, role=${u.role}`));
```

### Issue 3: Data Not Refreshing

**Symptoms:** Old data showing, changes not visible

**Cause:** React component not re-rendering or browser cache

**Solution:**
1. **Hard Refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Logout/Login:** Forces state reload
3. **Clear localStorage and re-import data**

### Issue 4: Testing on Same Browser

**Symptoms:** Changes work but not immediately

**Cause:** localStorage updates synchronously but React state might not update across tabs

**Solution:**
- Close all tabs and reopen
- Use incognito/private window for second user
- Use different browsers (Chrome for counselor, Firefox for student)
- **ALWAYS refresh after switching users**

---

## Verification Checklist

Before reporting as a bug, verify:

- [ ] Test has `counselorId` field set (check localStorage)
- [ ] `counselorId` matches an actual user ID
- [ ] User with that ID has `role: "counselor"`
- [ ] Student dashboard has refreshed after counselor accepted
- [ ] Test status is "accepted" or "rescheduled"
- [ ] Not looking at "pending" tests (those don't have counselors yet)
- [ ] Using latest code changes

---

## Manual Fix (If Needed)

If a test was accepted before the code fix, you can manually add the counselorId:

```javascript
// In browser console
const tests = JSON.parse(localStorage.getItem('psychTests'));
const testToFix = tests.find(t => t.id === 1); // replace with actual test id
testToFix.counselorId = 2; // replace with actual counselor user id
localStorage.setItem('psychTests', JSON.stringify(tests));
// Refresh the page
location.reload();
```

---

## Expected Data Structure

### Test Object (After Acceptance):
```javascript
{
  id: 1,
  controlNo: "PT-1234567890",
  status: "accepted",
  studentId: "202329207",        // Student ID number
  studentUserId: 5,              // Student's user ID
  studentName: "John Doe",
  college: "CAS",
  preferredDate: "2024-01-25",
  scheduledDate: "2024-01-25",   // Set by counselor
  scheduledTimeSlot: "9:00 AM - 10:00 AM",
  testType: "Psychological Assessment",
  counselorId: 2,                // ← THIS IS KEY
  createdAt: "2024-01-20T...",
  updatedAt: "2024-01-21T..."
}
```

### Counselor User Object:
```javascript
{
  id: 2,                         // ← Matches counselorId
  role: "counselor",
  name: "Dr. Maria Santos",
  email: "counselor@msu.edu.ph",
  // ... other fields
}
```

---

## What Should Appear

### In Student Dashboard "Upcoming Tests":

```
┌────────────────────────────────────────┐
│ [M] Psychological Assessment           │
│     Date: 2024-01-25                   │
│     Status: accepted                   │
│     Counselor: Dr. Maria Santos        │
│ ───────────────────────────────────── │
│ [Profile] [Message]                    │
└────────────────────────────────────────┘
```

- **[M]** = Blue circle with counselor's initial
- **Profile** = View Profile button
- **Message** = Message button

---

## Code Flow Diagram

```
Counselor Accepts Test
        ↓
TestsContext.acceptTest()
        ↓
updateTest(id, { 
  status: "accepted",
  counselorId: currentUser?.id  ← Sets counselor
})
        ↓
localStorage.setItem('psychTests', ...)
        ↓
Student Dashboard Loads
        ↓
getTestsForCurrentUser()
        ↓
tests.filter(t => t.studentUserId === currentUser.id)
        ↓
For each test:
  const counselor = users.find(u => u.id === test.counselorId)
        ↓
If counselor found:
  - Show avatar with initial
  - Show Profile button
  - Show Message button
```

---

## Next Steps

1. **Test the current implementation** using the steps above
2. **Check browser console** for any errors
3. **Verify localStorage data** matches expected structure
4. **Try accepting a NEW test** (not old ones from before the fix)
5. **Refresh the student dashboard** after counselor accepts
6. **Report back** with console log outputs if still not working

---

## Contact Debugging Info to Provide

If still not working, provide:

1. **Console output of:**
   ```javascript
   JSON.parse(localStorage.getItem('psychTests'))
   JSON.parse(localStorage.getItem('users'))
   JSON.parse(localStorage.getItem('currentUser'))
   ```

2. **Screenshot of:**
   - Student dashboard "Upcoming Tests" panel
   - Browser console (F12)

3. **Steps you took:**
   - Did you refresh after accepting?
   - Are you testing in same browser or different browsers?
   - Did you accept a new test or using old data?

---

**Status:** Implementation is correct, likely a data refresh or cache issue  
**Last Updated:** January 2024
