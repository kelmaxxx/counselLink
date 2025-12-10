# CounselLink Data Transfer Guide

## Problem: LocalStorage Conflicts Between Systems

CounselLink uses browser localStorage to store all application data (users, appointments, messages, notifications, etc.). This means:

- **Data is browser-specific**: Data saved on one computer/browser won't appear on another
- **System conflicts**: Moving between different systems results in lost data
- **No automatic sync**: Each browser has its own isolated storage

## Solution: Export/Import Data Feature

We've implemented a data transfer system that allows you to move your CounselLink data between different systems easily.

---

## How to Transfer Data Between Systems

### Step 1: Export Your Data (Original System)

1. Open CounselLink on your current system
2. Log in with your account
3. Navigate to **Settings** page (click Settings in the sidebar)
4. Under "Data Transfer" section, click the **Export** button
5. A JSON file will be downloaded (e.g., `counsellink-data-2024-01-15.json`)
6. Save this file in a safe location

### Step 2: Transfer the File

Transfer the downloaded JSON file to your new system using any of these methods:
- **Email**: Send it to yourself
- **Cloud Storage**: Upload to Google Drive, Dropbox, OneDrive, etc.
- **USB Drive**: Copy the file to a USB stick
- **Network Share**: Use shared folders
- **Messaging Apps**: Send via WhatsApp, Telegram, etc.

### Step 3: Import Your Data (New System)

1. Open CounselLink on your new system
2. Navigate to **Settings** page (you don't need to log in first)
3. Under "Data Transfer" section, click the **Import** button
4. Select the JSON file you transferred
5. Wait for the success message
6. The page will automatically reload
7. **Log in** with your credentials

🎉 Your data is now available on the new system!

---

## What Data Gets Transferred?

The export/import feature transfers ALL application data:

- ✅ **Users** - All user accounts (admin, counselors, students, reps)
- ✅ **Appointments** - All appointment requests and history
- ✅ **Messages** - All chat conversations
- ✅ **Notifications** - All notifications
- ✅ **Tests** - Psychological test definitions
- ✅ **Test Results** - Student test results
- ✅ **Metadata** - Export timestamp and version info

**Note**: The current user session is NOT imported. You'll need to log in again after importing data.

---

## Configuration Options

### Environment Variables

You can customize the application behavior using environment variables in the `.env` file:

```env
# Server Configuration
VITE_PORT=5173              # Port number (change if 5173 conflicts)
VITE_HOST=0.0.0.0           # Host address (0.0.0.0 allows network access)

# Storage Configuration
VITE_STORAGE_TYPE=localStorage   # Options: localStorage, sessionStorage

# Feature Flags
VITE_ENABLE_MOCK_DATA=true       # Enable/disable mock data
VITE_ENABLE_DATA_EXPORT=true     # Enable/disable export feature
```

### Change Port Number

If port 5173 conflicts with another application:

1. Open `.env` file
2. Change `VITE_PORT=5173` to another port (e.g., `VITE_PORT=3000`)
3. Restart the dev server
4. Access the app at `http://localhost:3000` (or your chosen port)

### Allow Network Access

To access CounselLink from other devices on your network:

1. Open `.env` file
2. Ensure `VITE_HOST=0.0.0.0` is set
3. Restart the dev server
4. Find your computer's IP address:
   - **Windows**: Run `ipconfig` in command prompt
   - **Mac/Linux**: Run `ifconfig` or `ip addr`
5. Access from other devices using: `http://YOUR_IP_ADDRESS:5173`

---

## Troubleshooting

### Import Failed: Invalid JSON File
**Problem**: The file you're trying to import is corrupted or not a valid CounselLink export.

**Solution**: 
- Make sure you're using a file that was exported from CounselLink
- Check that the file wasn't modified manually
- Try exporting again from the original system

### Data Not Showing After Import
**Problem**: Data was imported but not visible in the application.

**Solution**:
- Make sure you logged in after importing
- Try clearing your browser cache and refreshing
- Check browser console for errors (F12 → Console tab)

### Port Already in Use
**Problem**: Error message saying port 5173 is already in use.

**Solution**:
1. Change the port in `.env` file (see Configuration Options above)
2. Or stop the other application using that port
3. Restart the dev server

### Can't See App on Network
**Problem**: Other devices can't access the app using your IP address.

**Solution**:
1. Make sure `VITE_HOST=0.0.0.0` in `.env` file
2. Check your firewall settings (allow port 5173)
3. Make sure all devices are on the same network
4. Try restarting the dev server

---

## Advanced: Clear All Data

⚠️ **Warning**: This permanently deletes all data from the current browser!

If you need to start fresh or clear corrupted data:

1. Go to **Settings** page
2. Scroll to "Danger Zone" section
3. Click **Clear Data** button
4. Confirm the action
5. The page will reload with empty data

**Important**: Always export your data before clearing if you want to keep it!

---

## Development Notes

### Storage Utility

All localStorage operations go through `src/utils/storage.js`, which provides:

- Centralized storage management
- Easy switching between localStorage and sessionStorage
- Error handling
- Export/import functionality
- Data download/upload helpers

### File Structure

```
src/
  utils/
    storage.js          # Storage utility with export/import
  pages/
    Settings.jsx        # Settings page with data transfer UI
.env                    # Environment configuration
.env.example           # Example environment file
vite.config.js         # Vite config with port/host settings
```

### For Developers: Using the Storage Utility

Instead of directly using `localStorage`, import the storage utility:

```javascript
import storage from '../utils/storage';

// Use storage methods
storage.setItem('key', 'value');
const value = storage.getItem('key');
storage.removeItem('key');

// Export/import
const data = storage.exportData();
storage.importData(data);
```

---

## Recommended Workflow

### For Regular Use
1. Work on your primary system
2. Export data at the end of each session (optional, for backup)
3. When switching systems, export → transfer → import

### For Development/Testing
1. Create test data on one system
2. Export it
3. Import on other systems for consistent testing
4. Use version control for the codebase, export files for data

### For Backup
1. Export your data regularly (weekly or monthly)
2. Store exports in a safe location (cloud storage)
3. Keep at least 2-3 recent backup files

---

## Future Enhancements

Possible improvements for future versions:

- 🔄 **Auto-sync**: Automatic cloud synchronization
- 🗄️ **Backend API**: Centralized database instead of localStorage
- 🔐 **Encrypted Exports**: Password-protected export files
- ⚡ **Selective Import**: Choose what data to import
- 📱 **Mobile App**: Native mobile applications
- 🌐 **Multi-device Support**: Real-time sync across devices

---

## Support

If you encounter any issues with data transfer:

1. Check this guide's Troubleshooting section
2. Verify your `.env` configuration
3. Check browser console for error messages
4. Try exporting and re-importing on the same system first
5. Contact the development team for assistance

---

**Last Updated**: January 2024  
**Version**: 1.0.0
