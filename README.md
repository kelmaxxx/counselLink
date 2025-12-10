# CounselLink

A comprehensive student counseling management system for MSU (Mindanao State University) built with React and Vite.

## Features

- 🔐 **Multi-role Authentication** - Students, Counselors, College Representatives, and Admins
- 📅 **Appointment Management** - Request, schedule, and manage counseling appointments
- 💬 **Messaging System** - Real-time chat between students and counselors
- 🔔 **Notifications** - Stay updated with appointment status and announcements
- 📊 **Reports & Analytics** - Track counseling activities and student progress
- 🧠 **Psychological Testing** - Request and manage psychological tests
- 👥 **User Management** - Admin controls for managing users
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd counsellink
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Default Login Credentials

### Admin
- Email: `admin@msu.edu.ph`
- Password: `admin123`

### Counselor
- Email: `counselor@msu.edu.ph`
- Password: `counselor123`

### College Representative
- Email: `rep@msu.edu.ph`
- Password: `rep123`

### Student
- Student ID: `202329207`
- Password: `pass123`

## Configuration

### Port Configuration

If port 5173 conflicts with another application, change it in `.env`:

```env
VITE_PORT=3000
VITE_HOST=localhost
```

### Network Access

To access the app from other devices on your network:

1. Set `VITE_HOST=0.0.0.0` in `.env`
2. Restart the dev server
3. Access via `http://YOUR_IP_ADDRESS:5173`

## Data Transfer Between Systems

**Problem**: CounselLink uses browser localStorage, which doesn't sync between different systems.

**Solution**: Use the built-in Export/Import feature:

1. **Export Data**: Go to Settings → Export (downloads a JSON file)
2. **Transfer File**: Move the file to your new system (email, USB, cloud, etc.)
3. **Import Data**: Go to Settings → Import (select the JSON file)
4. **Log In**: Use your credentials to access your data

📖 **Detailed Guide**: See [DATA_TRANSFER_GUIDE.md](./DATA_TRANSFER_GUIDE.md) for complete instructions.

## Project Structure

```
counsellink/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React Context providers
│   ├── data/           # Mock data and constants
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin-specific pages
│   │   ├── counselor/  # Counselor-specific pages
│   │   ├── dashboard/  # Dashboard pages by role
│   │   ├── rep/        # College rep pages
│   │   └── student/    # Student-specific pages
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── .env.example        # Example environment file
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7 (using rolldown-vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Storage**: Browser localStorage (with export/import)

## Key Features Explained

### 1. Role-Based Access Control
Different dashboards and features for each user role:
- **Students**: Request appointments, chat with counselors, view test results
- **Counselors**: Manage appointments, chat with students, conduct tests
- **College Reps**: View counseling data for their college
- **Admins**: Manage users, view all data, create announcements

### 2. Appointment System
- Students request appointments with preferred dates/times
- Auto-assignment to counselors based on college
- Counselors can accept, reject, or reschedule
- Urgent appointment flagging
- Complete appointment history

### 3. Messaging System
- One-on-one chat between users
- Real-time message display
- Unread message indicators
- Message history

### 4. Notification System
- System notifications for important events
- Announcement broadcasts to all users
- Role-specific notifications
- Mark as read functionality

### 5. Data Transfer
- Export all data as JSON
- Import data on any system
- No data loss when switching systems
- Easy backup and restore

## Troubleshooting

### Port Already in Use
Change the port in `.env` file and restart the server.

### Data Not Syncing Between Systems
Use the Export/Import feature in Settings to transfer your data.

### Can't Access on Network
Ensure `VITE_HOST=0.0.0.0` in `.env` and check firewall settings.

### Import Failed
Make sure you're using a valid CounselLink export file and it hasn't been modified.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please refer to:
- [DATA_TRANSFER_GUIDE.md](./DATA_TRANSFER_GUIDE.md) - Complete data transfer documentation
- [FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md) - Detailed feature documentation

---

**Built with ❤️ for MSU Students**
