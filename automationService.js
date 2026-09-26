import { Student, AttendanceSession, Notification, FeePayment, FeeStructure } from '../models/index.js';

export const automationService = {
  // Evaluates attendance shortage <75% and pushes automated notifications
  async runAttendanceAudit() {
    try {
      const students = await Student.find().populate('userId');
      for (const student of students) {
        if (student.attendancePercentage < 75) {
          await Notification.create({
            recipientId: student.userId?._id,
            recipientRole: 'student',
            title: 'Urgent: Attendance Shortage Alert',
            message: `Your aggregate attendance is currently ${student.attendancePercentage}%, which is below the mandatory 75% limit. Attend next consecutive classes immediately to avoid hall ticket detention.`,
            category: 'Attendance',
            priority: 'URGENT',
          });

          // Also alert parent if parentUserId exists
          if (student.parentUserId) {
            await Notification.create({
              recipientId: student.parentUserId,
              recipientRole: 'parent',
              title: `Attendance Warning: Ward ${student.rollNumber}`,
              message: `Your ward ${student.userId?.name} (${student.rollNumber}) attendance has fallen to ${student.attendancePercentage}%. Please contact their department advisor.`,
              category: 'Attendance',
              priority: 'URGENT',
            });
          }
        }
      }
    } catch (err) {
      console.error('[Automation] runAttendanceAudit error:', err);
    }
  },

  // Fee due alerts
  async runFeeReminders() {
    try {
      const students = await Student.find().populate('userId');
      for (const student of students) {
        const payment = await FeePayment.findOne({ studentId: student._id, status: 'Success' });
        if (!payment) {
          await Notification.create({
            recipientId: student.userId?._id,
            recipientRole: 'student',
            title: 'Upcoming Fee Due Reminder',
            message: 'Semester tuition fees are due on the 25th of this month. Pay online to prevent registration holds.',
            category: 'Fees',
            priority: 'IMPORTANT',
          });
        }
      }
    } catch (err) {
      console.error('[Automation] runFeeReminders error:', err);
    }
  },
};

