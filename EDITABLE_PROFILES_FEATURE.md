# Editable User Profiles Feature

## Overview
All user profiles in CounselLink are now fully editable, allowing users to update their personal and professional information. Students can now add their year level and course/program information.

---

## ✅ What Was Implemented

### 1. **AuthContext Enhancement**
- Added `updateUser()` function to update user profiles
- Updates both localStorage and React state
- Automatically syncs currentUser when editing own profile

### 2. **Student Profile** (`src/pages/student/StudentProfile.jsx`)
**Editable Fields:**
- ✅ Name *
- ✅ Email *
- ✅ Phone Number
- ✅ College (Dropdown)
- ✅ **Program/Course** (e.g., BS Computer Science) ← NEW
- ✅ **Year Level** (1st-5th Year) ← NEW
- ✅ Bio/About Me
- 📌 Student ID (Read-only)

**New Features:**
- 3-column layout with Academic Information section
- Year level dropdown (1st Year - 5th Year)
- Program/Course text field
- Edit/Save/Cancel buttons with validation

### 3. **Counselor Profile** (`src/pages/counselor/CounselorProfile.jsx`)
**Editable Fields:**
- ✅ Name *
- ✅ Email *
- ✅ Phone Number
- ✅ Department (Dropdown)
- ✅ Specialization
- ✅ Bio/About Me
- 📌 Employee ID (Read-only)
- 📌 Role (Read-only)

**New Features:**
- Professional Information section
- Statistics cards (Sessions, Active Students, Pending Requests)
- Department dropdown selection

### 4. **Admin Profile** (`src/pages/admin/AdminProfile.jsx`)
**Editable Fields:**
- ✅ Name *
- ✅ Email *
- ✅ Phone Number
- 📌 Employee ID (Read-only)
- 📌 Role (Read-only)
- 📌 Access Level (Read-only)

**Features:**
- Simplified admin information editing
- Admin permissions display
- Full system access indicator

### 5. **College Rep Profile** (`src/pages/rep/RepProfile.jsx`)
**Editable Fields:**
- ✅ Name *
- ✅ Email *
- ✅ Phone Number
- ✅ College (Dropdown)
- 📌 Employee ID (Read-only)
- 📌 Role (Read-only)

**Features:**
- College assignment
- Responsibilities display
- College-specific access

---

## 🎨 UI/UX Design

### View Mode (Default)
```
┌────────────────────────────────────┐
│ My Profile    [Edit Profile Button]│
├────────────────────────────────────┤
│ Personal Info │ Academic Info │ Bio│
│               │               │    │
│ 👤 Name       │ 🎓 College    │    │
│ John Doe      │ CICS          │ Bio│
│               │               │text│
│ 📧 Email      │ 📚 Program    │    │
│ john@msu...   │ BS CS         │    │
│               │               │    │
│ 📱 Phone      │ 📅 Year Level │    │
│ 123-456-7890  │ 3rd Year      │    │
└────────────────────────────────────┘
```

### Edit Mode
```
┌────────────────────────────────────┐
│ My Profile                          │
├────────────────────────────────────┤
│ [Input Fields with Icons]           │
│                                     │
│ 👤 Name *                           │
│ [John Doe____________]              │
│                                     │
│ 🎓 College                          │
│ [CICS ▼]                           │
│                                     │
│ [Save Button] [Cancel Button]      │
└────────────────────────────────────┘
```

---

## 📋 Field Descriptions

### Student Fields

| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| Name | Text | Yes | - | Full name of the student |
| Email | Email | Yes | - | Contact email address |
| Phone | Tel | No | - | Phone number |
| Student ID | Text | - | Read-only | Assigned student ID |
| College | Dropdown | No | 7 colleges | Academic college |
| Program/Course | Text | No | - | Degree program (e.g., BS Computer Science) |
| Year Level | Dropdown | No | 1st-5th Year | Current year level |
| Bio | Textarea | No | - | Personal information |

### Counselor Fields

| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| Name | Text | Yes | - | Full name |
| Email | Email | Yes | - | Contact email |
| Phone | Tel | No | - | Phone number |
| Employee ID | Text | - | Read-only | Staff ID |
| Department | Dropdown | No | 6 departments | Work department |
| Specialization | Text | No | - | Counseling specialization |
| Bio | Textarea | No | - | Professional background |

### Colleges List
1. CAS - College of Arts and Sciences
2. COE - College of Engineering
3. CICS - College of Information and Computing Sciences
4. COB - College of Business
5. CED - College of Education
6. COL - College of Law
7. COM - College of Medicine

### Counselor Departments
1. Guidance Office
2. Psychology Department
3. Student Affairs
4. Health Services
5. Academic Counseling
6. Career Development

---

## 🔄 User Flow

### Editing Profile

1. **Click "Edit Profile"** button (top right)
2. **Form fields become editable** with current values
3. **Make changes** to any fields
4. **Click "Save"** to save changes
   - ✅ Success message appears
   - ✅ Profile updates immediately
   - ✅ Changes saved to localStorage
   - ✅ Changes visible to other users
5. **Or click "Cancel"** to discard changes
   - ⚠️ Form resets to original values
   - ⚠️ No changes are saved

### Validation

- **Required fields** marked with *
- **Name cannot be empty**
- **Email cannot be empty**
- **Email must be valid format**
- **Error message** shows if validation fails

---

## 💾 Data Persistence

### How It Works

1. **User edits profile** → Clicks Save
2. **updateUser() called** in AuthContext
3. **Updates users array** in state
4. **Saves to localStorage** (`users` key)
5. **Updates currentUser** if editing own profile
6. **Saves to localStorage** (`currentUser` key)
7. **All components re-render** with new data

### Data Flow Diagram

```
User Clicks "Save"
      ↓
handleSave()
      ↓
updateUser(userId, updates)
      ↓
┌─────────────────────────────────┐
│ Update users array in state     │
│ Save to localStorage("users")   │
└─────────────────────────────────┘
      ↓
Is current user? → Yes
      ↓
┌─────────────────────────────────┐
│ Update currentUser in state     │
│ Save to localStorage("current") │
└─────────────────────────────────┘
      ↓
Success! Profile Updated
```

---

## 🔍 Viewing Updated Profiles

### In Profile Modals

When counselors/students click on profile avatars:

```javascript
// ProfileViewModal.jsx already shows:
- program (for students)
- yearLevel (for students)
- department (for counselors)
- specialization (for counselors)
- bio (for all users)
- phone (for all users)
```

**Example: Student Profile in Modal**
```
┌──────────────────────────────────┐
│ 👤 John Doe                      │
│ Student • CICS                   │
├──────────────────────────────────┤
│ 📧 john@msu.edu.ph              │
│ 📱 123-456-7890                 │
│ 🎓 Student ID: 202329207        │
│ 📚 Program: BS Computer Science  │
│ 📅 Year Level: 3rd Year         │
├──────────────────────────────────┤
│ Bio: Passionate about tech...   │
│                                  │
│ [Send Message]                   │
└──────────────────────────────────┘
```

**Example: Counselor Profile in Modal**
```
┌──────────────────────────────────┐
│ 👤 Dr. Maria Santos              │
│ Counselor • Psychology Dept.     │
├──────────────────────────────────┤
│ 📧 counselor@msu.edu.ph         │
│ 📱 987-654-3210                 │
│ 💼 Department: Psychology        │
│ 🏆 Specialization: Academic      │
├──────────────────────────────────┤
│ Bio: Experienced counselor...   │
│                                  │
│ [Send Message]                   │
└──────────────────────────────────┘
```

---

## 🧪 Testing Guide

### Test Scenario 1: Student Edits Profile

1. **Login as Student**
   - Student ID: `202329207`
   - Password: `pass123`

2. **Go to "My Profile"** page

3. **Click "Edit Profile"**

4. **Update Information:**
   - Change name to "Juan Dela Cruz"
   - Select college: "CICS - College of Information and Computing Sciences"
   - Enter program: "BS Computer Science"
   - Select year level: "3rd Year"
   - Add phone: "09123456789"
   - Add bio: "I love programming!"

5. **Click "Save"**

6. **Expected Result:**
   - ✅ Success message appears
   - ✅ Fields update immediately
   - ✅ Edit mode closes

7. **Verify Changes:**
   - Logout and login again
   - Check if changes persisted
   - Have counselor view your profile
   - Verify they see updated info

### Test Scenario 2: Counselor Edits Profile

1. **Login as Counselor**
   - Email: `counselor@msu.edu.ph`
   - Password: `counselor123`

2. **Go to "My Profile"**

3. **Click "Edit Profile"**

4. **Update Information:**
   - Change name
   - Select department: "Psychology Department"
   - Enter specialization: "Academic Counseling, Career Guidance"
   - Add phone number
   - Add bio about counseling approach

5. **Click "Save"**

6. **Verify:**
   - Changes saved
   - Have student view your profile in appointment
   - Check if new info appears

### Test Scenario 3: Cross-User Visibility

1. **As Student:** Update profile with program and year level

2. **As Counselor:** 
   - Go to Dashboard
   - View pending appointment
   - Click student's profile avatar
   - ✅ Verify you see: program, year level, bio

3. **As Student:**
   - Update counselor's specialization
   - View counselor profile
   - ✅ Verify you see updated specialization

---

## 🔧 Technical Implementation

### Files Modified

1. **`src/context/AuthContext.jsx`**
   - Added `updateUser()` function
   - Updates localStorage and state
   - Syncs currentUser automatically

2. **`src/pages/student/StudentProfile.jsx`**
   - Complete redesign with edit mode
   - Added Academic Information section
   - Added program and yearLevel fields
   - Form validation and state management

3. **`src/pages/counselor/CounselorProfile.jsx`**
   - Added Professional Information section
   - Department and specialization fields
   - Statistics cards
   - Edit/save/cancel functionality

4. **`src/pages/admin/AdminProfile.jsx`**
   - Editable admin information
   - Form validation
   - Maintains admin permissions display

5. **`src/pages/rep/RepProfile.jsx`**
   - Editable rep information
   - College selection dropdown
   - Responsibilities display

### Code Structure

```javascript
// State management
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({ ...initialData });
const [message, setMessage] = useState(null);

// Functions
const handleSave = () => {
  // Validate
  // Update
  // Show success
};

const handleCancel = () => {
  // Reset form
  // Close edit mode
};
```

---

## 🎯 Benefits

### For Students:
✅ Update personal information anytime  
✅ Add year level and course for better counselor matching  
✅ Share bio with counselors  
✅ Keep contact info up to date  

### For Counselors:
✅ Update professional information  
✅ Add specializations  
✅ Share counseling approach via bio  
✅ Students see accurate information  

### For Admins:
✅ Update contact information  
✅ Maintain profile accuracy  
✅ Professional presence  

### For College Reps:
✅ Update college assignment  
✅ Keep contact info current  
✅ Professional profile  

---

## 📊 Data Visibility Matrix

| User Type | Can See Student | Can See Counselor | Can See Admin | Can See Rep |
|-----------|----------------|-------------------|---------------|-------------|
| **Student** | Own profile + program/year | All fields when viewing | Limited | Limited |
| **Counselor** | All fields (profile modal) | Own profile | Limited | Limited |
| **Admin** | All fields | All fields | Own profile | All fields |
| **Rep** | College-specific | All fields | Limited | Own profile |

---

## 🚀 Future Enhancements

Possible improvements:

1. **Profile Picture Upload** - Add avatar upload functionality
2. **Password Change** - Allow users to change passwords
3. **Email Verification** - Verify email changes
4. **Activity Log** - Track profile changes
5. **Admin Approval** - Require admin approval for certain changes
6. **Field History** - Show edit history
7. **Social Links** - Add LinkedIn, etc.
8. **Certifications** - For counselors to add credentials

---

## ✅ Summary

**What's New:**
- ✅ All user profiles are editable
- ✅ Students can add year level and program/course
- ✅ Counselors can add department and specialization
- ✅ Real-time updates across the system
- ✅ Data persists in localStorage
- ✅ Visible to other users when viewing profiles

**Key Features:**
- 📝 Edit button with toggle mode
- ✅ Form validation
- 💾 Auto-save to localStorage
- 🔄 Instant UI updates
- 🎨 Clean, modern design
- 📱 Responsive layout

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: ✅ Fully Implemented
