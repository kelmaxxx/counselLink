# CounselLink Setup Guide

## Problem Solved: LocalStorage Conflicts Between Systems

### The Issue
Your CounselLink application was using browser `localStorage` to store all data (users, appointments, messages, etc.). This caused conflicts when switching between different systems because:

- Each browser has its own isolated localStorage
- Data doesn't transfer automatically between computers
- Moving to a new system meant losing all your data

### The Solution
We've implemented a comprehensive data transfer system with three main components:

1. **Environment Configuration** - Flexible port and host settings
2. **Storage Utility** - Centralized storage management with export/import
3. **Settings UI** - User-friendly interface for data transfer

---

## What Was Changed

### 1. New Files Created

#### `.env` and `.env.example`
Environment configuration files that let you customize:
- Port number (default: 5173)
- Host address (default: 0.0.0.0 for network access)
- Storage type (localStorage or sessionStorage)
- Feature flags

#### `src/utils/storage.js`
A centralized storage utility that provides:
- Consistent API for all storage operations
- Export all data to JSON format
- Import data from JSON files
- Download data as a file
- Upload data from a file
- Error handling and validation

#### `DATA_TRANSFER_GUIDE.md`
Complete documentation on:
- How to transfer data between systems
- Troubleshooting common issues
- Configuration options
- Advanced features

#### `SETUP_GUIDE.md` (this file)
Quick setup and migration guide

### 2. Modified Files

#### `vite.config.js`
Added server configuration to support:
- Custom port from environment variables
- Custom host for network access
- Auto-open browser on start

#### `.gitignore`
Added entries to ignore:
- Environment files (`.env`, `.env.local`)
- Exported data files (`counsellink-data-*.json`)

#### `src/pages/Settings.jsx`
Completely redesigned with:
- Data Export section with download button
- Data Import section with file upload
- Clear Data option (danger zone)
- Status messages and loading states
- Step-by-step instructions

#### `README.md`
Updated with:
- Comprehensive project documentation
- Quick start guide
- Data transfer instructions
- Configuration options
- Troubleshooting section

---

## How to Use the New Features

### First Time Setup (New System)

1. **Clone or copy the project** to your new system

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env if needed (change port, etc.)
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Import your data (if transferring from another system):**
   - Go to Settings page
   - Click "Import" and select your exported JSON file
   - Log in with your credentials

### Transferring Data Between Systems

#### On the OLD System:
1. Open CounselLink
2. Log in with your account
3. Go to **Settings** page
4. Click **Export** button
5. Save the downloaded JSON file (e.g., `counsellink-data-2024-01-15.json`)

#### Transfer the File:
Use any method:
- Email it to yourself
- Copy to USB drive
- Upload to cloud storage (Google Drive, Dropbox, etc.)
- Use file sharing (AirDrop, Nearby Share, etc.)

#### On the NEW System:
1. Open CounselLink (no need to log in first)
2. Go to **Settings** page
3. Click **Import** button
4. Select the JSON file you transferred
5. Wait for success message
6. Log in with your credentials
7. All your data is now available!

### Changing Port Number

If port 5173 conflicts with another application:

1. Open `.env` file
2. Change the port:
   ```env
   VITE_PORT=3000
   ```
3. Restart the dev server
4. Access at `http://localhost:3000`

### Accessing from Other Devices on Network

To access CounselLink from your phone, tablet, or another computer:

1. Ensure `.env` has:
   ```env
   VITE_HOST=0.0.0.0
   ```

2. Restart the dev server

3. Find your computer's IP address:
   - **Windows**: Run `ipconfig` in Command Prompt
   - **Mac**: Run `ifconfig` in Terminal
   - **Linux**: Run `ip addr` in Terminal

4. On other devices, go to:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```
   Example: `http://192.168.1.100:5173`

---

## Configuration Options

### Environment Variables (`.env`)

```env
# Application Info
VITE_APP_NAME=CounselLink
VITE_APP_VERSION=1.0.0

# Server Settings
VITE_PORT=5173              # Port number (change if conflicts)
VITE_HOST=0.0.0.0           # Use 0.0.0.0 for network access

# Storage Configuration
VITE_STORAGE_TYPE=localStorage   # or sessionStorage

# Feature Flags
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_DATA_EXPORT=true

# Environment
VITE_ENV=development
```

### Port Configuration Examples

**Default (localhost only):**
```env
VITE_PORT=5173
VITE_HOST=localhost
```

**Network accessible:**
```env
VITE_PORT=5173
VITE_HOST=0.0.0.0
```

**Custom port:**
```env
VITE_PORT=8080
VITE_HOST=0.0.0.0
```

---

## Common Scenarios

### Scenario 1: Working on Multiple Computers
**Problem**: You have a laptop and desktop, both running CounselLink

**Solution**:
1. Export data from one computer regularly
2. Import on the other when you switch
3. Or keep one as primary and only export when needed

### Scenario 2: Sharing Data with Team Members
**Problem**: Multiple developers working on the project need the same test data

**Solution**:
1. One person creates complete test data
2. Export the data
3. Share the JSON file with team
4. Everyone imports to get the same data

### Scenario 3: Backup Your Data
**Problem**: Want to backup your data regularly

**Solution**:
1. Go to Settings
2. Click Export weekly/monthly
3. Save files with dates in filename
4. Store in cloud storage or external drive

### Scenario 4: Port Conflict
**Problem**: Another app is using port 5173

**Solution**:
1. Edit `.env`
2. Change `VITE_PORT=5173` to `VITE_PORT=3000` (or any free port)
3. Restart server
4. Access at new port

### Scenario 5: Fresh Start
**Problem**: Want to clear all data and start over

**Solution**:
1. Export current data first (for backup)
2. Go to Settings → Danger Zone
3. Click "Clear Data"
4. Confirm the action
5. Page reloads with fresh state

---

## Technical Details

### What Gets Exported/Imported

The JSON export includes:
- `users` - All user accounts
- `appointments` - All appointment data
- `messages` - All chat messages
- `conversations` - Conversation metadata
- `notifications` - All notifications
- `tests` - Test definitions
- `testResults` - Student test results
- `exportedAt` - Timestamp of export
- `version` - App version

**Note**: Current user session is NOT exported for security reasons. You must log in again after import.

### Storage Structure

```javascript
// Example of exported JSON structure
{
  "users": "[{\"id\":1,\"name\":\"Admin\",\"email\":\"admin@msu.edu.ph\",...}]",
  "appointments": "[{\"id\":1,\"studentId\":\"202329207\",...}]",
  "messages": "[...]",
  "conversations": "[...]",
  "notifications": "[...]",
  "tests": "[...]",
  "testResults": "[...]",
  "exportedAt": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### File Naming Convention

Exported files are automatically named:
```
counsellink-data-YYYY-MM-DD.json
```

Example: `counsellink-data-2024-01-15.json`

---

## Troubleshooting

### Issue: "Port already in use"
**Solution**: Change `VITE_PORT` in `.env` file

### Issue: "Cannot access from other devices"
**Solution**: 
1. Set `VITE_HOST=0.0.0.0` in `.env`
2. Check firewall settings
3. Ensure all devices on same network

### Issue: "Import failed - Invalid JSON"
**Solution**:
1. Ensure file was exported from CounselLink
2. File hasn't been manually edited
3. File isn't corrupted
4. Try exporting again

### Issue: "Data not showing after import"
**Solution**:
1. Make sure you logged in after import
2. Refresh the page
3. Check browser console for errors (F12)
4. Try clearing cache and re-importing

### Issue: "Export button doesn't work"
**Solution**:
1. Check browser console for errors
2. Ensure browser allows file downloads
3. Check if popup blocker is preventing download
4. Try different browser

---

## Best Practices

### ✅ DO:
- Export your data regularly as backup
- Test import on same system before transferring
- Keep multiple backup files (dated)
- Store backups in safe location
- Use version control for code (Git)
- Document any custom changes

### ❌ DON'T:
- Don't edit JSON files manually
- Don't share files with sensitive data publicly
- Don't rely on localStorage alone for production
- Don't forget to log in after import
- Don't skip testing after major changes

---

## Next Steps

### Immediate Actions:
1. ✅ Test the export feature on your current system
2. ✅ Transfer to your new system using import
3. ✅ Configure `.env` for your needs
4. ✅ Bookmark this guide for reference

### Future Enhancements:
- Consider adding a backend API for real data storage
- Implement automatic cloud sync
- Add encrypted exports for sensitive data
- Create mobile app version
- Add multi-tenancy support

---

## Support & Resources

- **Main README**: [README.md](./README.md)
- **Detailed Transfer Guide**: [DATA_TRANSFER_GUIDE.md](./DATA_TRANSFER_GUIDE.md)
- **Feature Documentation**: [FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md)

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

**Last Updated**: January 2024  
**Solution Version**: 1.0.0  

✨ Your CounselLink data is now portable and conflict-free!
