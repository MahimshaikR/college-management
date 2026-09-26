import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabase, seedLabExamsIfEmpty, seedApplicationsAndRequirementsIfEmpty, seedFacultyConnectIfEmpty, seedPortalEnhancementsIfEmpty } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Route imports
import authRoutes from './routes/authRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import markRoutes from './routes/markRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import lmsRoutes from './routes/lmsRoutes.js';
import examRoutes from './routes/examRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import labExamRoutes from './routes/labExamRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import { facultyRouter, questionRouter } from './routes/facultyConnectRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 5005;

// Security & Parsing Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Enable inline scripts & CDN icons (FontAwesome/Chart.js/QRCode)
  })
);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Disable caching for HTML pages and APIs so browser back button after logout re-evaluates auth
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/' || req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

// Static frontend serving - serves the pure HTML/CSS/JS frontend!
const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'NRI Institute of Technology Super App & Institutional Website',
    version: '1.0.0',
    techStack: 'HTML5, CSS3, Vanilla JS, Node.js, Express, MongoDB',
  });
});

// Mount REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/lms', lmsRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', accountRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/lab-exams', labExamRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/audit-logs', verificationRoutes);
app.use('/api/faculty', facultyRouter);
app.use('/api/questions', questionRouter);

// Catch-all for unhandled API endpoints to guarantee JSON response (never HTML fallback)
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server] Unhandled exception:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

// Bootstrapping Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    await seedLabExamsIfEmpty();
    await seedApplicationsAndRequirementsIfEmpty();
    await seedFacultyConnectIfEmpty();
    await seedPortalEnhancementsIfEmpty();

    const tryListen = (portToTry) => {
      const server = app.listen(portToTry, () => {
        console.log('=======================================================');
        console.log(`🚀 NRI Institute of Technology Super App & Website running on port ${portToTry}`);
        console.log(`🌐 Public Website:   http://localhost:${portToTry}/`);
        console.log(`🔑 Portal Login:     http://localhost:${portToTry}/login.html`);
        console.log(`📡 Backend REST API: http://localhost:${portToTry}/api`);
        console.log('=======================================================');

        // Also bind companion port (5000 or 5005) so both popular URLs work simultaneously
        const companionPort = portToTry === 5005 ? 5000 : (portToTry === 5000 ? 5005 : null);
        if (companionPort) {
          try {
            const server2 = app.listen(companionPort, () => {
              console.log(`🔗 Also seamlessly accessible on: http://localhost:${companionPort}/`);
            });
            server2.on('error', () => {
              // Gracefully ignore if companion port is occupied by another service
            });
          } catch (_) { }
        }
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`[Server] Port ${portToTry} is already in use. Retrying on port ${portToTry + 1}...`);
          tryListen(portToTry + 1);
        } else {
          console.error('[Server] Critical failure starting server:', err);
          process.exit(1);
        }
      });
    };

    tryListen(Number(PORT));
  } catch (err) {
    console.error('[Server] Critical failure starting server:', err);
    process.exit(1);
  }
};

startServer();

