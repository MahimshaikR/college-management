import bcrypt from 'bcryptjs';
import {
  User,
  Student,
  Faculty,
  Parent,
  Department,
  Course,
  Subject,
  Section,
  AttendanceSession,
  Mark,
  Result,
  TimetableSlot,
  Assignment,
  Submission,
  StudyMaterial,
  Quiz,
  QuestionBank,
  Exam,
  HallTicket,
  FeeStructure,
  FeePayment,
  PlacementJob,
  LibraryBook,
  HostelRoom,
  HostelOutpass,
  TransportRoute,
  Grievance,
  CampusEvent,
  CollegeDocument,
  Notification,
  Holiday,
  Inquiry,
  LabExam,
  LabQuestionBank,
  Application,
  ApplicationRequirement,
  FacultyProfile,
  FacultyQuestion,
  QuestionMessage,
  Skill,
  SkillResource,
  Announcement,
  UpcomingExam,
} from './models/index.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already contains records. Skipping initial seeding.');
      return;
    }

    console.log('[Seed] Fresh database detected. Seeding comprehensive college ERP & Super App data...');

    const defaultPassword = 'Admin@123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // 1. Departments
    const cseDept = await Department.create({
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Center of excellence in computing systems, artificial intelligence, and software engineering.',
    });

    const eceDept = await Department.create({
      name: 'Electronics & Communication',
      code: 'ECE',
      description: 'Embedded systems, IoT, and high-frequency communication.',
    });

    // 2. Courses
    const btechCse = await Course.create({
      departmentId: cseDept._id,
      name: 'B.Tech in Computer Science and Engineering',
      code: 'BT-CSE',
      durationYears: 4,
      degree: 'B.Tech',
    });

    // 3. Sections
    const secA = await Section.create({
      departmentId: cseDept._id,
      name: 'A',
      semester: 5,
      academicYear: '2025-2026',
    });

    // 4. Subjects
    const dbms = await Subject.create({
      departmentId: cseDept._id,
      courseId: btechCse._id,
      name: 'Database Management Systems',
      code: 'CS501',
      semester: 5,
      credits: 4,
      type: 'Theory',
    });

    const os = await Subject.create({
      departmentId: cseDept._id,
      courseId: btechCse._id,
      name: 'Operating Systems',
      code: 'CS502',
      semester: 5,
      credits: 4,
      type: 'Theory',
    });

    const cn = await Subject.create({
      departmentId: cseDept._id,
      courseId: btechCse._id,
      name: 'Computer Networks',
      code: 'CS503',
      semester: 5,
      credits: 4,
      type: 'Theory',
    });

    const ai = await Subject.create({
      departmentId: cseDept._id,
      courseId: btechCse._id,
      name: 'Artificial Intelligence & Machine Learning',
      code: 'CS504',
      semester: 5,
      credits: 4,
      type: 'Theory',
    });

    const webLab = await Subject.create({
      departmentId: cseDept._id,
      courseId: btechCse._id,
      name: 'Full Stack Web Development Lab',
      code: 'CS505',
      semester: 5,
      credits: 2,
      type: 'Practical',
    });

    // 5. Create Demo Users for All 13 Roles
    const usersToCreate = [
      { name: 'Alexander Wright', email: 'admin@nexcampus.edu', role: 'super_admin', phone: '+91 9876500001' },
      { name: 'Marcus Vance', email: 'admin.college@nexcampus.edu', role: 'admin', phone: '+91 9876500002' },
      { name: 'Dr. Eleanor Vance', email: 'principal@nexcampus.edu', role: 'principal', phone: '+91 9876500003' },
      { name: 'Dr. Arvind Verma', email: 'hod.cse@nexcampus.edu', role: 'hod', phone: '+91 9876500004' },
      { name: 'Dr. Radhika Sharma', email: 'radhika.cse@nexcampus.edu', role: 'faculty', phone: '+91 9876500005' },
      { name: 'Aarav Kapoor', email: 'aarav.kapoor@nexcampus.edu', role: 'student', phone: '+91 9876500006' },
      { name: 'Rajesh Kapoor', email: 'parent.aarav@nexcampus.edu', role: 'parent', phone: '+91 9876500007' },
      { name: 'Vikram Joshi', email: 'accounts@nexcampus.edu', role: 'accountant', phone: '+91 9876500008' },
      { name: 'Suresh Menon', email: 'examcell@nexcampus.edu', role: 'exam_cell', phone: '+91 9876500009' },
      { name: 'Ananya Rao', email: 'placements@nexcampus.edu', role: 'placement_officer', phone: '+91 9876500010' },
      { name: 'Sunita Rao', email: 'library@nexcampus.edu', role: 'librarian', phone: '+91 9876500011' },
      { name: 'Kishan Lal', email: 'hostel@nexcampus.edu', role: 'hostel_warden', phone: '+91 9876500012' },
      { name: 'Mahesh Rawat', email: 'transport@nexcampus.edu', role: 'transport_staff', phone: '+91 9876500013' },
      { name: 'Priya Sharma', email: 'events@nexcampus.edu', role: 'event_coordinator', phone: '+91 9876500014' },
    ];

    const createdUsers = {};
    for (const u of usersToCreate) {
      const user = await User.create({
        ...u,
        passwordHash,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name.replace(' ', '')}`,
      });
      createdUsers[u.role] = user;
    }

    // Set HOD on Department
    cseDept.hodId = createdUsers['hod']._id;
    await cseDept.save();

    // 6. Student Profile (Aarav Kapoor - 21CS042)
    const primaryStudent = await Student.create({
      userId: createdUsers['student']._id,
      rollNumber: '21CS042',
      studentId: 'STU-1042',
      departmentId: cseDept._id,
      courseId: btechCse._id,
      branch: 'Computer Science & Engineering',
      year: 3,
      semester: 5,
      section: 'A',
      batch: '2022-2026',
      cgpa: 8.12,
      sgpa: 8.4,
      backlogs: 0,
      attendancePercentage: 78.5,
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Docker'],
      projects: [
        {
          title: 'Autonomous Drone Navigation System',
          description: 'Computer vision guided navigation using OpenCV and ROS.',
          link: 'https://github.com/aaravkapoor/drone-nav',
        },
        {
          title: 'Distributed Transaction Engine',
          description: 'High-throughput 2-phase commit consensus protocol in Go.',
          link: 'https://github.com/aaravkapoor/distributed-tx',
        },
      ],
      certifications: [
        {
          title: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          issueDate: new Date('2024-05-15'),
          link: 'https://aws.amazon.com/verify',
        },
      ],
      placementStatus: 'Applied',
      parentUserId: createdUsers['parent']._id,
      emergencyContact: '+91 9876500007',
      address: '742 Evergreen Terrace, Tech District, City - 560001',
    });

    // 4 other peer students in the same class
    const peerNames = ['Ananya Sen', 'Rohan Mehta', 'Sneha Iyer', 'Kabir Patel'];
    const peerStudents = [];
    for (let i = 0; i < peerNames.length; i++) {
      const u = await User.create({
        name: peerNames[i],
        email: `student${i + 1}@nexcampus.edu`,
        passwordHash,
        role: 'student',
        phone: `+91 987654321${i}`,
      });
      const s = await Student.create({
        userId: u._id,
        rollNumber: `21CS04${i + 3}`,
        studentId: `STU-104${i + 3}`,
        departmentId: cseDept._id,
        courseId: btechCse._id,
        branch: 'Computer Science & Engineering',
        year: 3,
        semester: 5,
        section: 'A',
        cgpa: 7.8 + i * 0.3,
        attendancePercentage: 72 + i * 5,
      });
      peerStudents.push(s);
    }

    // Faculty Profile
    await Faculty.create({
      userId: createdUsers['faculty']._id,
      employeeId: 'FAC-301',
      departmentId: cseDept._id,
      designation: 'Associate Professor',
      specialization: 'Cloud Computing & Database Systems',
      assignedSubjects: [dbms._id, os._id],
      cabinNumber: 'CS-304',
    });

    // Parent Profile
    await Parent.create({
      userId: createdUsers['parent']._id,
      linkedStudentIds: [primaryStudent._id],
      relationship: 'Father',
      occupation: 'Senior Software Architect',
    });

    // 7. Seed Attendance Sessions (Aarav has 70% in DBMS -> shortage!)
    const allStudents = [primaryStudent, ...peerStudents];

    // Conduct 10 DBMS sessions
    for (let i = 1; i <= 10; i++) {
      const date = new Date(Date.now() - (10 - i) * 86400000);
      const isAaravPresent = i <= 7; // 7 out of 10 = 70% in DBMS!

      const records = allStudents.map((st) => ({
        studentId: st._id,
        rollNumber: st.rollNumber,
        status: String(st._id) === String(primaryStudent._id) ? (isAaravPresent ? 'Present' : 'Absent') : 'Present',
      }));

      await AttendanceSession.create({
        subjectId: dbms._id,
        facultyId: createdUsers['faculty']._id,
        departmentId: cseDept._id,
        semester: 5,
        section: 'A',
        date,
        period: 2,
        topicCovered: `DBMS Unit ${Math.ceil(i / 2)} - Relational Algebra & Indexing Lecture ${i}`,
        records,
        totalStudents: records.length,
        presentCount: records.filter((r) => r.status === 'Present').length,
        absentCount: records.filter((r) => r.status === 'Absent').length,
      });
    }

    // Conduct 10 OS sessions (Aarav attended 9 out of 10 = 90%)
    for (let i = 1; i <= 10; i++) {
      const date = new Date(Date.now() - (10 - i) * 86400000);
      const isAaravPresent = i !== 4; // 9 out of 10

      const records = allStudents.map((st) => ({
        studentId: st._id,
        rollNumber: st.rollNumber,
        status: String(st._id) === String(primaryStudent._id) ? (isAaravPresent ? 'Present' : 'Absent') : 'Present',
      }));

      await AttendanceSession.create({
        subjectId: os._id,
        facultyId: createdUsers['faculty']._id,
        departmentId: cseDept._id,
        semester: 5,
        section: 'A',
        date,
        period: 1,
        topicCovered: `OS Unit ${Math.ceil(i / 2)} - Virtual Memory & Scheduling ${i}`,
        records,
        totalStudents: records.length,
        presentCount: records.filter((r) => r.status === 'Present').length,
        absentCount: records.filter((r) => r.status === 'Absent').length,
      });
    }

    // 8. Continuous Internal Assessments (CIA Marks)
    await Mark.create({
      studentId: primaryStudent._id,
      subjectId: dbms._id,
      semester: 5,
      examType: 'CIA-1',
      maxMarks: 50,
      obtainedMarks: 42,
      facultyId: createdUsers['faculty']._id,
      remarks: 'Strong understanding of ER diagrams',
    });

    await Mark.create({
      studentId: primaryStudent._id,
      subjectId: os._id,
      semester: 5,
      examType: 'CIA-1',
      maxMarks: 50,
      obtainedMarks: 46,
      facultyId: createdUsers['faculty']._id,
      remarks: 'Excellent analysis of semaphore synchronization',
    });

    // 9. Semester Results History
    await Result.create({
      studentId: primaryStudent._id,
      semester: 4,
      academicYear: '2024-2025',
      sgpa: 8.35,
      cgpa: 8.12,
      totalCredits: 24,
      earnedCredits: 24,
      status: 'PASS',
      subjectGrades: [
        { subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', credits: 4, internalMarks: 45, externalMarks: 44, totalMarks: 89, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'CS402', subjectName: 'Computer Architecture', credits: 4, internalMarks: 40, externalMarks: 42, totalMarks: 82, grade: 'A', gradePoint: 8 },
        { subjectCode: 'CS403', subjectName: 'Software Engineering & Agile', credits: 4, internalMarks: 44, externalMarks: 45, totalMarks: 89, grade: 'A+', gradePoint: 9 },
        { subjectCode: 'CS404', subjectName: 'Object Oriented Programming with Java', credits: 4, internalMarks: 48, externalMarks: 47, totalMarks: 95, grade: 'O', gradePoint: 10 },
      ],
    });

    // 10. Weekly Timetable Matrix
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
      { start: '09:00 AM', end: '09:50 AM', sub: os },
      { start: '10:00 AM', end: '10:50 AM', sub: dbms },
      { start: '11:10 AM', end: '12:00 PM', sub: cn },
      { start: '01:00 PM', end: '01:50 PM', sub: ai },
      { start: '02:00 PM', end: '02:50 PM', sub: webLab },
    ];

    for (const day of days) {
      for (let p = 1; p <= 5; p++) {
        const slot = timeSlots[p - 1];
        await TimetableSlot.create({
          departmentId: cseDept._id,
          semester: 5,
          section: 'A',
          dayOfWeek: day,
          period: p,
          startTime: slot.start,
          endTime: slot.end,
          subjectId: slot.sub._id,
          facultyId: createdUsers['faculty']._id,
          room: p === 5 ? 'Lab CS-1' : 'Hall 501',
          isLab: p === 5,
        });
      }
    }

    // 11. LMS: Assignments & Study Materials
    const assignment1 = await Assignment.create({
      subjectId: dbms._id,
      facultyId: createdUsers['faculty']._id,
      title: 'B+ Tree Indexing & Transaction Concurrency Analysis',
      description: 'Implement a simulation showing B+ Tree insertion with node splitting, followed by 2PL conflict serializability checks.',
      unit: 3,
      semester: 5,
      section: 'A',
      deadline: new Date(Date.now() + 86400000 * 2), // Due in 2 days
      maxMarks: 20,
    });

    await Assignment.create({
      subjectId: os._id,
      facultyId: createdUsers['faculty']._id,
      title: 'Multithreaded Banker Algorithm Simulation in C/C++',
      description: 'Implement safety state verification and resource-request algorithm handling 5 processes and 3 resource types.',
      unit: 2,
      semester: 5,
      section: 'A',
      deadline: new Date(Date.now() + 86400000 * 5),
      maxMarks: 20,
    });

    // Student Aarav already submitted assignment 1
    await Submission.create({
      assignmentId: assignment1._id,
      studentId: primaryStudent._id,
      fileUrl: 'https://storage.nexcampus.edu/submissions/aarav_bplus_tree.pdf',
      status: 'Submitted',
    });

    // Study Materials
    await StudyMaterial.create({
      subjectId: dbms._id,
      uploadedBy: createdUsers['faculty']._id,
      title: 'Complete Unit 3 Lecture Notes: Normalization (1NF to BCNF)',
      unit: 3,
      topic: 'Database Design Theory',
      fileType: 'PDF',
      fileUrl: 'https://storage.nexcampus.edu/materials/dbms_unit3.pdf',
    });

    await StudyMaterial.create({
      subjectId: os._id,
      uploadedBy: createdUsers['faculty']._id,
      title: 'Process Synchronization & Semaphore Cheatsheet',
      unit: 2,
      topic: 'Deadlock & Concurrency',
      fileType: 'PDF',
      fileUrl: 'https://storage.nexcampus.edu/materials/os_sync.pdf',
    });

    // Quiz
    await Quiz.create({
      subjectId: dbms._id,
      facultyId: createdUsers['faculty']._id,
      title: 'Unit 1 & 2 Flash Assessment: Relational Algebra & SQL',
      unit: 1,
      durationMinutes: 15,
      totalMarks: 5,
      endTime: new Date(Date.now() + 86400000 * 7),
      questions: [
        { questionText: 'Which normal form eliminates partial dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctOptionIndex: 1, explanation: '2NF requires relation to be in 1NF with no partial functional dependencies on candidate key.', marks: 1 },
        { questionText: 'Which property ensures all operations in a transaction execute or none do?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], correctOptionIndex: 0, explanation: 'Atomicity ensures all or nothing execution.', marks: 1 },
        { questionText: 'What is the default index type used in MySQL InnoDB tables?', options: ['Hash Index', 'B+ Tree', 'R-Tree', 'Bitmap'], correctOptionIndex: 1, explanation: 'InnoDB uses clustered B+ Tree indices.', marks: 1 },
      ],
    });

    // Question Bank Items
    await QuestionBank.create({
      subjectId: dbms._id,
      unit: 4,
      topic: 'Concurrency Control',
      difficulty: 'Medium',
      type: '10 Marks',
      questionText: 'Explain the Two-Phase Locking (2PL) protocol. Differentiate between Strict 2PL and Rigorous 2PL with concurrency graphs.',
      marks: 10,
    });

    // 12. Examination & Digital Hall Ticket
    const exam = await Exam.create({
      title: 'Autumn End-Semester Regular Examinations 2026',
      semester: 5,
      academicYear: '2025-2026',
      type: 'Semester-End',
      startDate: new Date(Date.now() + 86400000 * 14),
      endDate: new Date(Date.now() + 86400000 * 25),
      isPublished: true,
      schedules: [
        { subjectId: dbms._id, date: new Date(Date.now() + 86400000 * 14), session: 'FN (09:30 AM - 12:30 PM)', roomNumber: 'Hall-A' },
        { subjectId: os._id, date: new Date(Date.now() + 86400000 * 16), session: 'FN (09:30 AM - 12:30 PM)', roomNumber: 'Hall-B' },
        { subjectId: cn._id, date: new Date(Date.now() + 86400000 * 18), session: 'FN (09:30 AM - 12:30 PM)', roomNumber: 'Hall-C' },
      ],
    });

    await HallTicket.create({
      studentId: primaryStudent._id,
      examId: exam._id,
      hallTicketNumber: `HT-${primaryStudent.rollNumber}-S5`,
      qrVerificationCode: `VERIFIED-NEXCAMPUS-${primaryStudent.rollNumber}-2026`,
      isEligible: true,
    });

    // 13. Fee Structure & Payment Ledger
    const feeStructure = await FeeStructure.create({
      courseId: btechCse._id,
      semester: 5,
      academicYear: '2025-2026',
      tuitionFee: 45000,
      labFee: 5000,
      libraryFee: 2500,
      examFee: 2500,
      totalAmount: 55000,
      dueDate: new Date(Date.now() + 86400000 * 10),
    });

    await FeePayment.create({
      studentId: primaryStudent._id,
      feeStructureId: feeStructure._id,
      transactionId: 'TXN-UPI-9872634011',
      amountPaid: 30000,
      paymentMethod: 'UPI',
      status: 'Success',
      receiptNumber: 'REC-2026-004289',
      paymentDate: new Date(Date.now() - 86400000 * 10),
      remarks: 'Semester 5 Tuition Fee (Installment 1)',
    });

    // 14. Placement Drives
    await PlacementJob.create({
      companyName: 'Google',
      role: 'Software Development Engineer - 1',
      ctc: '₹44.0 LPA',
      baseSalary: 2400000,
      location: 'Bangalore / Hyderabad',
      minCgpa: 8.0,
      maxBacklogs: 0,
      allowedBranches: ['Computer Science & Engineering', 'Electronics & Communication'],
      driveDate: new Date(Date.now() + 86400000 * 8),
      deadline: new Date(Date.now() + 86400000 * 4),
      description: 'Developing high-performance distributed cloud infrastructure and client-facing apps.',
    });

    await PlacementJob.create({
      companyName: 'Microsoft',
      role: 'Software Engineer (Azure Platform)',
      ctc: '₹38.5 LPA',
      baseSalary: 2000000,
      location: 'Hyderabad / Noida',
      minCgpa: 7.5,
      maxBacklogs: 0,
      allowedBranches: ['Computer Science & Engineering'],
      driveDate: new Date(Date.now() + 86400000 * 12),
      deadline: new Date(Date.now() + 86400000 * 6),
      description: 'Building next-generation distributed systems and enterprise infrastructure.',
    });

    // 15. Campus Services (Library, Hostel, Transport, Grievance, Events)
    await LibraryBook.create({
      title: 'Database System Concepts (7th Edition)',
      author: 'Abraham Silberschatz, Henry Korth, S. Sudarshan',
      isbn: '978-0078022159',
      department: 'Computer Science',
      totalCopies: 8,
      availableCopies: 6,
      shelfLocation: 'Rack CS-04',
    });

    await LibraryBook.create({
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      department: 'Computer Science',
      totalCopies: 5,
      availableCopies: 4,
      shelfLocation: 'Rack CS-01',
    });

    await HostelRoom.create({
      block: 'Aryabhatta Block (Men)',
      roomNumber: 'B-304',
      capacity: 3,
      occupiedBeds: 1,
      inmates: [primaryStudent._id],
    });

    await HostelOutpass.create({
      studentId: primaryStudent._id,
      reason: 'Attending Hackathon Grand Finale at IIT',
      destination: 'IIT Technology Park',
      fromTime: new Date(Date.now() + 86400000),
      toTime: new Date(Date.now() + 86400000 * 3),
      status: 'Approved',
      wardenRemarks: 'Verified with departmental coordinator. Approved.',
      qrVerificationCode: `OUTPASS-${primaryStudent.rollNumber}-VERIFIED`,
    });

    await TransportRoute.create({
      routeNumber: 'Route 14',
      routeName: 'City Center Express → Campus Gate 1',
      busNumber: 'KA-01-EA-9922',
      driverName: 'Ramesh Kumar',
      driverPhone: '+91 9845012345',
      stops: [
        { stopName: 'Central Metro Terminal', pickupTime: '07:45 AM', dropTime: '05:30 PM' },
        { stopName: 'Indiranagar Junction', pickupTime: '08:05 AM', dropTime: '05:10 PM' },
        { stopName: 'University Campus Gate', pickupTime: '08:40 AM', dropTime: '04:45 PM' },
      ],
    });

    await Grievance.create({
      submittedBy: createdUsers['student']._id,
      title: 'Lab 3 Ethernet Drop Speed Degradation',
      category: 'Infrastructure',
      description: 'Terminals 15 to 22 experience packet drop during concurrent socket compile sessions.',
      status: 'In Progress',
      assignedTo: 'Campus IT Infrastructure Cell',
    });

    await CampusEvent.create({
      title: 'NexHacks 2026: National Level 36-Hour Hackathon',
      category: 'Hackathon',
      organizingClub: 'Google Developer Student Clubs & Coding Society',
      eventDate: new Date(Date.now() + 86400000 * 18),
      venue: 'University High-Performance Computing Center',
      description: 'Build breakthrough generative AI, Web3, and sustainability solutions. ₹5,00,000 cash prizes.',
      registrationDeadline: new Date(Date.now() + 86400000 * 10),
      registeredStudents: [primaryStudent._id],
    });

    // 16. Official College Documents for AI Assistant RAG
    await CollegeDocument.create({
      title: 'NexCampus Academic Attendance & Detainee Ordinance',
      category: 'Attendance Policy',
      content: 'A minimum aggregate attendance of 75% across all registered theory and laboratory courses is statutory for sitting in end-semester examinations. A relaxation of up to 10% (i.e., between 65% and 74%) may be granted exclusively on documented medical grounds or authorized institutional representation. Students below 65% are categorically detained and must re-register.',
      keywords: ['attendance', '75%', 'shortage', 'medical leave', 'detained'],
    });

    await CollegeDocument.create({
      title: 'Grading System & Semester Examination Guidelines',
      category: 'Exam Rules',
      content: 'Continuous Internal Assessment (CIA) accounts for 40% weightage, and End-Semester Examinations account for 60%. A 10-point relative grading scale is enforced: Grade O (90-100%, 10 points), A+ (80-89%, 9 points), A (70-79%, 8 points), B+ (60-69%, 7 points). The minimum passing grade point in any subject is 5 (Grade C).',
      keywords: ['grades', 'cgpa', 'sgpa', 'grading scale', 'cia'],
    });

    // 17. Notifications & Holidays
    await Notification.create({
      recipientRole: 'student',
      title: '⚠️ Mandatory Attendance Verification',
      message: 'Students with attendance below 75% in DBMS must meet the Department HOD by Friday.',
      category: 'Attendance',
      priority: 'URGENT',
    });

    await Notification.create({
      recipientRole: 'all',
      title: '🚀 Google On-Campus Recruitment Drive Open',
      message: 'Registration is live for B.Tech Final and Pre-Final years. CGPA Cutoff: 8.0.',
      category: 'Placement',
      priority: 'IMPORTANT',
    });

    await Holiday.create({
      title: 'Gandhi Jayanti',
      startDate: new Date('2026-10-02'),
      endDate: new Date('2026-10-02'),
      type: 'Public Holiday',
      description: 'National Holiday.',
    });

    // 18. Sample Public Website Inquiries
    await Inquiry.create({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@gmail.com',
      phone: '+91 9876543219',
      courseInterested: 'B.Tech in Computer Science and Engineering',
      city: 'Delhi',
      message: 'I would like to inquire about direct admission through JEE Main rank and scholarship criteria.',
      status: 'New',
    });

    console.log('[Seed] Database successfully seeded with comprehensive academic, portal, and website records!');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  }
};

export const seedLabExamsIfEmpty = async () => {
  try {
    const examCount = await LabExam.countDocuments();
    if (examCount > 0) {
      console.log(`[Seed] Lab exams already exist (${examCount} found).`);
      return;
    }

    console.log('[Seed] Seeding practical lab examination suite and question bank...');

    let facultyUser = await User.findOne({ role: 'faculty' });
    if (!facultyUser) {
      facultyUser = await User.findOne({ role: 'admin' });
    }
    const facultyId = facultyUser?._id || new (await import('mongoose')).default.Types.ObjectId();

    // 1. Seed Question Bank
    const q1Bank = await LabQuestionBank.create({
      title: 'Two Sum Target Pair Finder',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Assume each input has exactly one solution, and you may not use the same element twice. Return the indices as a sorted array [i, j].',
      questionType: 'programming',
      subjectCode: 'CS201L',
      subjectName: 'Data Structures Lab',
      topic: 'Arrays & Hashing',
      difficulty: 'Easy',
      marks: 20,
      allowedLanguages: ['javascript', 'python'],
      starterCode: {
        javascript: '// Write your solution below\nfunction solution(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) {\n      return [map.get(comp), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
        python: '# Write your solution below\ndef solution(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in lookup:\n            return [lookup[comp], i]\n        lookup[num] = i\n    return []',
      },
      testCases: [
        { input: '[[2, 7, 11, 15], 9]', expectedOutput: '[0, 1]', isHidden: false, explanation: 'nums[0] + nums[1] == 9, return [0, 1].' },
        { input: '[[3, 2, 4], 6]', expectedOutput: '[1, 2]', isHidden: false, explanation: 'nums[1] + nums[2] == 6, return [1, 2].' },
        { input: '[[3, 3], 6]', expectedOutput: '[0, 1]', isHidden: true },
        { input: '[[1, 5, 8, 12, 19], 20]', expectedOutput: '[0, 4]', isHidden: true },
      ],
      createdBy: facultyId,
    });

    const q2Bank = await LabQuestionBank.create({
      title: 'Binary Search Element Finder',
      description: 'Given a sorted array of integers nums and a target integer target, write a function to search for target in nums. If target exists, return its 0-based index. Otherwise, return -1. Algorithm must have O(log n) runtime complexity.',
      questionType: 'programming',
      subjectCode: 'CS201L',
      subjectName: 'Data Structures Lab',
      topic: 'Divide & Conquer',
      difficulty: 'Medium',
      marks: 20,
      allowedLanguages: ['javascript', 'python'],
      starterCode: {
        javascript: 'function solution(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
        python: 'def solution(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
      },
      testCases: [
        { input: '[[-1, 0, 3, 5, 9, 12], 9]', expectedOutput: '4', isHidden: false, explanation: '9 exists in nums and its index is 4' },
        { input: '[[-1, 0, 3, 5, 9, 12], 2]', expectedOutput: '-1', isHidden: false, explanation: '2 does not exist in nums so return -1' },
        { input: '[[5], 5]', expectedOutput: '0', isHidden: true },
        { input: '[[2, 4, 6, 8, 10, 12, 14], 10]', expectedOutput: '4', isHidden: true },
      ],
      createdBy: facultyId,
    });

    // 2. Create Active Lab Exam: DSA Practical Examination
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    await LabExam.create({
      title: 'Data Structures & Algorithms Practical Lab Exam',
      examCode: 'CS201L-LAB-2026',
      description: 'End-semester autonomous practical examination covering Array manipulation, Two Pointers, Divide & Conquer algorithms, and Asymptotic analysis.',
      subjectCode: 'CS201L',
      subjectName: 'Data Structures & Algorithms Laboratory',
      department: 'Computer Science & Engineering',
      semester: 4,
      academicYear: '2025-2026',
      facultyId,
      scheduledStart: oneHourAgo,
      scheduledEnd: twoDaysLater,
      durationMinutes: 60,
      totalMarks: 50,
      status: 'active',
      allowedLanguages: ['javascript', 'python'],
      randomizeQuestions: false,
      assignedTarget: { type: 'all' },
      instructions: [
        'Read all problem descriptions and constraint limits carefully before writing code.',
        'You may execute your code against sample test cases as many times as needed using the "Run Code" button.',
        'Hidden test cases will be validated automatically upon final submission.',
        'Auto-save automatically records your draft code every 30 seconds.',
        'Browser tab switching is monitored. Exceeding 5 tab switches flags your attempt for invigilator review.',
        'The timer runs persistently. On reaching 00:00, the exam automatically finalizes and submits your work.',
      ],
      settings: {
        allowRunCode: true,
        maxTabSwitches: 5,
        autoSubmitOnExpiry: true,
        showResultImmediately: true,
      },
      questions: [
        {
          title: 'Two Sum Target Pair Finder',
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Assume each input has exactly one solution, and you may not use the same element twice. Return the indices as a sorted 2-element array [i, j].',
          questionType: 'programming',
          subjectCode: 'CS201L',
          subjectName: 'Data Structures Lab',
          topic: 'Arrays & Two Pointers',
          difficulty: 'Easy',
          marks: 20,
          allowedLanguages: ['javascript', 'python'],
          starterCode: {
            javascript: 'function solution(nums, target) {\n  // Return [index1, index2]\n  \n}',
            python: 'def solution(nums, target):\n    # Return [index1, index2]\n    pass',
          },
          testCases: [
            { input: '[[2, 7, 11, 15], 9]', expectedOutput: '[0, 1]', isHidden: false, explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
            { input: '[[3, 2, 4], 6]', expectedOutput: '[1, 2]', isHidden: false, explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
            { input: '[[3, 3], 6]', expectedOutput: '[0, 1]', isHidden: true },
            { input: '[[1, 5, 8, 12, 19], 20]', expectedOutput: '[0, 4]', isHidden: true },
          ],
        },
        {
          title: 'Binary Search Element Finder',
          description: 'Given a sorted array of integers nums and a target integer target, write a function to search for target in nums. If target exists, return its 0-based index. Otherwise, return -1. Your solution must run in O(log n) time complexity.',
          questionType: 'programming',
          subjectCode: 'CS201L',
          subjectName: 'Data Structures Lab',
          topic: 'Binary Search',
          difficulty: 'Medium',
          marks: 20,
          allowedLanguages: ['javascript', 'python'],
          starterCode: {
            javascript: 'function solution(nums, target) {\n  // Return 0-based index or -1\n  \n}',
            python: 'def solution(nums, target):\n    # Return 0-based index or -1\n    pass',
          },
          testCases: [
            { input: '[[-1, 0, 3, 5, 9, 12], 9]', expectedOutput: '4', isHidden: false },
            { input: '[[-1, 0, 3, 5, 9, 12], 2]', expectedOutput: '-1', isHidden: false },
            { input: '[[5], 5]', expectedOutput: '0', isHidden: true },
            { input: '[[2, 4, 6, 8, 10], 8]', expectedOutput: '3', isHidden: true },
          ],
        },
        {
          title: 'Hash Table Lookup Complexity',
          description: 'What is the average case time complexity of looking up an element by key in a properly dimensioned hash table with a uniform hash distribution?',
          questionType: 'mcq',
          subjectCode: 'CS201L',
          subjectName: 'Data Structures Lab',
          topic: 'Hashing',
          difficulty: 'Easy',
          marks: 10,
          mcqOptions: [
            { id: 'opt_a', text: 'O(1) - Constant Time', isCorrect: true },
            { id: 'opt_b', text: 'O(log N) - Logarithmic Time', isCorrect: false },
            { id: 'opt_c', text: 'O(N) - Linear Time', isCorrect: false },
            { id: 'opt_d', text: 'O(N log N) - Linearithmic Time', isCorrect: false },
          ],
        },
      ],
    });

    // 3. Create Upcoming Lab Exam: Database Systems Lab
    await LabExam.create({
      title: 'Database Management Systems & SQL Lab Examination',
      examCode: 'CS202L-DBMS-2026',
      description: 'Practical evaluation covering DDL, DML, aggregate functions, complex joins, subqueries, and transaction isolation.',
      subjectCode: 'CS202L',
      subjectName: 'Database Management Systems Laboratory',
      department: 'Computer Science & Engineering',
      semester: 4,
      academicYear: '2025-2026',
      facultyId,
      scheduledStart: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      scheduledEnd: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      totalMarks: 40,
      status: 'published',
      allowedLanguages: ['sql', 'javascript'],
      randomizeQuestions: false,
      assignedTarget: { type: 'all' },
      questions: [
        {
          title: 'Second Highest Salary Query',
          description: 'Write an SQL query to select the second highest distinct salary from the Employee table. If there is no second highest salary, return NULL.',
          questionType: 'sql',
          subjectCode: 'CS202L',
          subjectName: 'DBMS Lab',
          topic: 'Subqueries & Offsets',
          difficulty: 'Medium',
          marks: 20,
          starterCode: {
            sql: '-- Write your SQL query below:\nSELECT DISTINCT salary \nFROM Employee \nORDER BY salary DESC \nLIMIT 1 OFFSET 1;',
          },
        },
        {
          title: 'ACID Properties in Banking Transactions',
          description: 'Explain the Atomicity and Isolation properties in DBMS transactions with a concrete bank fund transfer scenario. Mention what occurs if a node crashes mid-transfer.',
          questionType: 'viva_short',
          subjectCode: 'CS202L',
          subjectName: 'DBMS Lab',
          topic: 'Transactions',
          difficulty: 'Medium',
          marks: 20,
        },
      ],
    });

    console.log('[Seed] Successfully seeded Lab Exams and Question Bank!');
  } catch (err) {
    console.error('[Seed] Error in seedLabExamsIfEmpty:', err);
  }
};

/**
 * Seed realistic applications with verified official URLs & rich document requirements
 */
export const seedApplicationsAndRequirementsIfEmpty = async () => {
  try {
    const existing = await Application.countDocuments();
    if (existing > 0) {
      return;
    }

    console.log('[Seed] Seeding VerifyHub Applications and Requirements catalogue...');

    // 1. US F-1 Student Visa
    const appUS = await Application.create({
      name: 'US Higher Education Student Visa (F-1 Academic)',
      code: 'US-VISA-F1',
      country: 'United States',
      category: 'Student Visa',
      purpose: 'Full-time Academic Study at SEVP-Certified Universities & Colleges',
      authority: 'U.S. Department of State - Bureau of Consular Affairs',
      description: 'The F-1 non-immigrant visa category allows foreign nationals to enter the United States as full-time students at accredited universities, seminaries, or language training programs.',
      eligibility: 'Must be accepted by an SEVP-certified institution, issued Form I-20, demonstrated financial sufficiency, and intent to depart after degree completion.',
      officialWebsite: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',
      officialApplyUrl: 'https://ceac.state.gov/genniv/',
      requirementsUrl: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html#overview',
      trackingUrl: 'https://ceac.state.gov/CEACStatTracker/Status.aspx',
      guidanceSteps: [
        { stepNumber: 1, title: 'Check SEVP Eligibility & Receive Form I-20', description: 'Secure admission from an SEVP-approved U.S. university and obtain Form I-20 Certificate of Eligibility.', requiresDocuments: true, relatedDocTypes: ['Form I-20'] },
        { stepNumber: 2, title: 'Pay SEVIS I-901 Fee', description: 'Pay mandatory $350 SEVIS fee to U.S. Immigration and Customs Enforcement before consular interview.', externalActionUrl: 'https://www.fmjfee.com/' },
        { stepNumber: 3, title: 'Gather Required Identification & Academic Documents', description: 'Assemble Passport, Academic Transcripts, Standardized Test Scores, and Proof of Funds.', requiresDocuments: true, relatedDocTypes: ['Passport Bio Page', 'Financial Affidavit & Bank Statements', 'Academic Transcripts'] },
        { stepNumber: 4, title: 'Verify Credentials on VerifyHub', description: 'Upload your Passport, Financial Affidavit, and Transcripts for tamper-evident cryptographic validation.', requiresDocuments: true },
        { stepNumber: 5, title: 'Complete Online Form DS-160', description: 'Fill out Nonimmigrant Visa Electronic Application on the official CEAC portal.', externalActionUrl: 'https://ceac.state.gov/genniv/' },
        { stepNumber: 6, title: 'Pay MRV Visa Application Fee', description: 'Pay Machine Readable Visa (MRV) fee at designated banking partner.' },
        { stepNumber: 7, title: 'Schedule VAC Biometrics & Consular Interview', description: 'Book biometric collection and consular interview appointments at official visa portal.' },
        { stepNumber: 8, title: 'Attend Interview & Track Visa Status', description: 'Present verified documents at U.S. Embassy/Consulate and monitor passport delivery status.', externalActionUrl: 'https://ceac.state.gov/CEACStatTracker/Status.aspx' },
      ],
    });

    await ApplicationRequirement.insertMany([
      {
        applicationId: appUS._id,
        documentType: 'Passport Bio Page',
        documentName: 'Current Valid International Passport',
        required: true,
        description: 'Original passport bio page with machine-readable zone (MRZ) clearly legible.',
        reason: 'Mandatory foreign travel authorization valid for at least 6 months beyond intended stay.',
        acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 6,
        mandatoryFields: ['fullName', 'documentNumber', 'expiryDate'],
      },
      {
        applicationId: appUS._id,
        documentType: 'Certificate of Eligibility (Form I-20)',
        documentName: 'SEVP Form I-20 Certificate of Eligibility',
        required: true,
        description: 'Official multi-page Form I-20 digitally signed by the Designated School Official (DSO).',
        reason: 'Statutory proof of acceptance into a certified SEVP academic institution.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 12,
        mandatoryFields: ['fullName', 'documentNumber', 'issueDate'],
      },
      {
        applicationId: appUS._id,
        documentType: 'Financial Affidavit & Bank Statements',
        documentName: 'Proof of Liquid Financial Support & Bank Statements',
        required: true,
        description: 'Official bank statements, loan sanction letter, or financial affidavit of support.',
        reason: 'Demonstrates sufficient liquid funds to cover 1st year tuition, health insurance, and living expenses.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 15 * 1024 * 1024,
        validityPeriodMonths: 3,
        mandatoryFields: ['fullName', 'issuingAuthority', 'issueDate'],
      },
      {
        applicationId: appUS._id,
        documentType: 'Academic Transcripts',
        documentName: 'Official College / University Transcripts',
        required: true,
        description: 'Semester-wise consolidated marks sheets or transcripts bearing institutional seal.',
        reason: 'Demonstrates scholastic preparation and academic continuity.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 15 * 1024 * 1024,
        validityPeriodMonths: 60,
        mandatoryFields: ['fullName', 'institution'],
      },
      {
        applicationId: appUS._id,
        documentType: 'Standardized Test Score Card',
        documentName: 'IELTS / TOEFL / GRE Official Score Report',
        required: false,
        description: 'Official test taker score report downloaded directly from ETS or British Council.',
        reason: 'Validates language proficiency and graduate aptitude required by selective universities.',
        acceptedFormats: ['application/pdf', 'image/jpeg'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 24,
      },
    ]);

    // 2. Germany DAAD Master's & Uni-Assist
    const appDE = await Application.create({
      name: "Germany DAAD Master's & Uni-Assist Admission",
      code: 'DE-UNI-DAAD',
      country: 'Germany',
      category: 'Higher Education',
      purpose: 'Postgraduate Degree Enrollment at German Public & Technical Universities',
      authority: 'DAAD (German Academic Exchange Service) & Uni-Assist e.V.',
      description: 'Centralized admission and credential evaluation pathway for international applicants applying to top German TU9 and public universities with zero or low tuition fees.',
      eligibility: 'Recognized bachelor degree in related discipline, minimum German GPA equivalency, and certified APS certificate for Indian applicants.',
      officialWebsite: 'https://www.daad.de/en/',
      officialApplyUrl: 'https://my.uni-assist.de/',
      requirementsUrl: 'https://www.uni-assist.de/en/how-to-apply/assemble-your-documents/',
      trackingUrl: 'https://india.diplo.de/in-en/service/visa',
      guidanceSteps: [
        { stepNumber: 1, title: 'Select University Program on DAAD Database', description: 'Explore over 2,000 international degree courses on the official DAAD study catalogue.', externalActionUrl: 'https://www.daad.de/en/study-and-research-in-germany/courses-of-study-in-germany/' },
        { stepNumber: 2, title: 'Obtain APS India Verification Certificate', description: 'Submit academic documents to the Academic Evaluation Centre (APS) New Delhi for mandatory verification.', externalActionUrl: 'https://aps-india.info/', requiresDocuments: true },
        { stepNumber: 3, title: 'Assemble & Translate Certified Academic Documents', description: 'Gather Bachelor Degree, Transcripts, English/German Language Proof, CV, and SOP.', requiresDocuments: true, relatedDocTypes: ['Bachelor Degree Certificate', 'Transcript of Records', 'APS Certificate'] },
        { stepNumber: 4, title: 'Verify Credentials on VerifyHub', description: 'Run optical character recognition, SHA-256 integrity, and format checks across all admission documents.', requiresDocuments: true },
        { stepNumber: 5, title: 'Create Uni-Assist Account & Pay Processing Fee', description: 'Submit electronic application dossier and pay €75 basic fee per semester application.', externalActionUrl: 'https://my.uni-assist.de/' },
        { stepNumber: 6, title: 'Receive Preliminary Documentation (VPD)', description: 'Uni-Assist evaluates credentials under the Bavarian Formula and issues VPD report.' },
        { stepNumber: 7, title: 'Open German Blocked Bank Account', description: 'Deposit legally mandated annual maintenance funds (€11,904/year) into a recognized blocked account.', externalActionUrl: 'https://www.fintiba.com/' },
        { stepNumber: 8, title: 'Apply for German National Student Visa (Category D)', description: 'Book appointment via VFS Global / German Consular Mission and track issuance.', externalActionUrl: 'https://india.diplo.de/in-en/service/visa' },
      ],
    });

    await ApplicationRequirement.insertMany([
      {
        applicationId: appDE._id,
        documentType: 'Bachelor Degree Certificate',
        documentName: 'Undergraduate Degree / Provisional Passing Certificate',
        required: true,
        description: 'Degree diploma certifying award of 3 or 4-year Bachelor of Technology or Science.',
        reason: 'Verifies completion of undergraduate coursework complying with European ECTS Bologna standards.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 120,
        mandatoryFields: ['fullName', 'institution', 'issueDate'],
      },
      {
        applicationId: appDE._id,
        documentType: 'Transcript of Records',
        documentName: 'Consolidated Academic Transcript & Grading Scale',
        required: true,
        description: 'Official university transcript listing all semester courses, credits, and grades.',
        reason: 'Required by Uni-Assist to compute the official German GPA using Bavarian Formula.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 15 * 1024 * 1024,
        validityPeriodMonths: 120,
        mandatoryFields: ['fullName', 'institution'],
      },
      {
        applicationId: appDE._id,
        documentType: 'APS Certificate',
        documentName: 'Academic Evaluation Centre (APS) Certificate',
        required: true,
        description: 'Verification certificate issued by the German Embassy New Delhi APS Centre.',
        reason: 'Statutory prerequisite for all Indian applicants applying for German university admission and student visa.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 36,
        mandatoryFields: ['fullName', 'documentNumber'],
      },
      {
        applicationId: appDE._id,
        documentType: 'Language Proficiency Proof',
        documentName: 'IELTS / TOEFL / Goethe-Zertifikat Certificate',
        required: true,
        description: 'English proficiency test score (min IELTS 6.5) or German language certificate (min B1/B2/C1).',
        reason: 'Statutory demonstration of ability to complete academic coursework in target language.',
        acceptedFormats: ['application/pdf', 'image/jpeg'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 24,
      },
      {
        applicationId: appDE._id,
        documentType: 'Curriculum Vitae',
        documentName: 'Europass Format Academic Curriculum Vitae (CV)',
        required: true,
        description: 'Structured CV detailing educational milestones, projects, internships, and technical skills.',
        reason: 'Standard European academic CV format mandated for university applicant screening.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 12,
      },
      {
        applicationId: appDE._id,
        documentType: 'Statement of Purpose',
        documentName: 'Statement of Purpose (Letter of Motivation)',
        required: false,
        description: '1 to 2-page essay explaining academic background, research interests, and program fit.',
        reason: 'Faculty selection committees evaluate motivation and alignment with department research foci.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 12,
      },
    ]);

    // 3. India National Scholarship Portal (AICTE / UGC)
    const appIN = await Application.create({
      name: 'National Scholarship Portal (AICTE & UGC Central Schemes)',
      code: 'IN-NSP-AICTE',
      country: 'India',
      category: 'Government Scholarship',
      purpose: 'Financial Aid, Pragati Scholarship, Saksham & Post-Matric Schemes',
      authority: 'Ministry of Electronics and Information Technology (MeitY) & AICTE',
      description: 'Single digital window for delivery of government educational scholarships directly into beneficiary bank accounts (DBT) across central and state schemes.',
      eligibility: 'Enrolled students in AICTE/UGC approved technical institutions with family annual income within stipulated ceiling.',
      officialWebsite: 'https://scholarships.gov.in/',
      officialApplyUrl: 'https://scholarships.gov.in/fresh/newstdRegfrmInstruction',
      requirementsUrl: 'https://scholarships.gov.in/public/faq/FAQ_General.pdf',
      trackingUrl: 'https://scholarships.gov.in/renewal/loginPage.action',
      guidanceSteps: [
        { stepNumber: 1, title: 'Check Scheme Guidelines & Eligibility Criteria', description: 'Review AICTE Pragati, Saksham, Swanath, or Post-Matric income and merit criteria.' },
        { stepNumber: 2, title: 'Aadhaar Demographic & Mobile Linking Verification', description: 'Ensure Aadhaar number is active, seeded with active bank account, and mobile number linked.' },
        { stepNumber: 3, title: 'Obtain Bonafide Certificate from College Registrar', description: 'Acquire official bonafide student certificate signed by institution head with current semester stamp.', requiresDocuments: true, relatedDocTypes: ['Bonafide Student Certificate'] },
        { stepNumber: 4, title: 'Verify Required Certificates on VerifyHub', description: 'Cryptographically validate Aadhaar card, income certificate, and marks sheets for verification readiness.', requiresDocuments: true },
        { stepNumber: 5, title: 'Register on National Scholarship Portal (NSP)', description: 'Generate One-Time Registration (OTR) credentials using face-authentication or Aadhaar OTP.', externalActionUrl: 'https://scholarships.gov.in/fresh/newstdRegfrmInstruction' },
        { stepNumber: 6, title: 'Fill Scheme Application & Upload Documents', description: 'Select target scheme, input academic details, and attach attested documents.' },
        { stepNumber: 7, title: 'Submit Application to Institute Nodal Officer', description: 'Submit digital application for Institute Level (L1) scrutiny and verification.' },
        { stepNumber: 8, title: 'Track DBT Scholarship Disbursement Status', description: 'Monitor Ministry (L2) approval and direct PFMS bank transfer credit status.', externalActionUrl: 'https://scholarships.gov.in/renewal/loginPage.action' },
      ],
    });

    await ApplicationRequirement.insertMany([
      {
        applicationId: appIN._id,
        documentType: 'Aadhaar Card',
        documentName: 'Aadhaar Card / e-Aadhaar Digital Copy',
        required: true,
        description: 'Official UIDAI issued identity card or password-free e-Aadhaar PDF.',
        reason: 'Mandatory for Aadhaar-based biometric Direct Benefit Transfer (DBT) authentication.',
        acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 120,
        mandatoryFields: ['fullName', 'documentNumber'],
      },
      {
        applicationId: appIN._id,
        documentType: 'Bonafide Student Certificate',
        documentName: 'Current Academic Year Bonafide Student Certificate',
        required: true,
        description: 'Issued and sealed by the Registrar/Principal of NexCampus confirming full-time enrollment.',
        reason: 'Statutory verification confirming active student status in approved academic program.',
        acceptedFormats: ['application/pdf', 'image/jpeg'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 12,
        mandatoryFields: ['fullName', 'institution', 'issueDate'],
      },
      {
        applicationId: appIN._id,
        documentType: 'Income Certificate',
        documentName: 'Competent Authority Annual Income Certificate',
        required: true,
        description: 'Issued by Tahsildar, Sub-Divisional Magistrate (SDM), or Revenue Department.',
        reason: 'Statutory requirement demonstrating gross family income is below ₹8,00,000 per annum.',
        acceptedFormats: ['application/pdf', 'image/jpeg'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 12,
        mandatoryFields: ['fullName', 'issuingAuthority', 'issueDate'],
      },
      {
        applicationId: appIN._id,
        documentType: 'Previous Year Marksheet',
        documentName: 'Previous Qualifying Examination Marksheet / Grade Card',
        required: true,
        description: 'Authenticated marksheet showing minimum 60% or equivalent CGPA in qualifying exam.',
        reason: 'Evaluates scholastic merit requirement under Central Sector Scheme regulations.',
        acceptedFormats: ['application/pdf', 'image/jpeg'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 24,
      },
      {
        applicationId: appIN._id,
        documentType: 'Bank Passbook Copy',
        documentName: 'Aadhaar-Seeded Bank Passbook / Cancelled Cheque',
        required: true,
        description: 'First page of savings bank passbook clearly showing account number, IFSC code, and holder name.',
        reason: 'Validates bank account details for direct PFMS government funds transfer without intermediary fees.',
        acceptedFormats: ['application/pdf', 'image/jpeg'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 36,
      },
    ]);

    // 4. SERB & DST Faculty Research Fellowship & International Grant
    const appSERB = await Application.create({
      name: 'SERB & DST Faculty International Research Fellowship & Grant',
      code: 'IN-SERB-DST',
      country: 'India',
      category: 'Faculty Fellowship',
      purpose: 'Extramural Research Funding, Core Research Grants (CRG), and International Mobility',
      authority: 'Science and Engineering Research Board (SERB) & Department of Science and Technology (DST)',
      description: 'Competitive research grants and bilateral mobility fellowships awarded to university professors and researchers to conduct pioneering scientific investigations and international collaborations.',
      eligibility: 'Permanent or tenure-track faculty members holding Ph.D. in Science or Engineering with an active institutional laboratory.',
      officialWebsite: 'https://www.serbonline.in/',
      officialApplyUrl: 'https://www.serbonline.in/SERB/Registration',
      requirementsUrl: 'https://www.serbonline.in/SERB/crg_instructions',
      trackingUrl: 'https://www.serbonline.in/SERB/Proposal_Status',
      guidanceSteps: [
        { stepNumber: 1, title: 'Draft Comprehensive Scientific Research Proposal', description: 'Formulate hypotheses, state of the art, methodology, and 36-month deliverable timeline.', requiresDocuments: true, relatedDocTypes: ['Detailed Research Proposal'] },
        { stepNumber: 2, title: 'Obtain Institutional Endorsement & Head Approval', description: 'Acquire official certificate from Dean (Research) pledging administrative and infrastructure support.', requiresDocuments: true, relatedDocTypes: ['Institutional Endorsement Certificate'] },
        { stepNumber: 3, title: 'Compile Academic Credentials & Publication Index', description: 'Collate Doctoral Degree diploma, Scopus/Web of Science citation records, and patent portfolio.', requiresDocuments: true, relatedDocTypes: ['Doctoral Degree (Ph.D.) Certificate', 'Publications Record'] },
        { stepNumber: 4, title: 'Verify Documents on VerifyHub', description: 'Run cryptographic verification on academic certificates, endorsement declarations, and proposal briefs.', requiresDocuments: true },
        { stepNumber: 5, title: 'Submit Extramural Proposal on SERB Online Portal', description: 'Upload completed documentation package under active Call for Proposals on SERB Online portal.', externalActionUrl: 'https://www.serbonline.in/SERB/Registration' },
        { stepNumber: 6, title: 'Program Advisory Committee (PAC) Peer Review', description: 'Expert domain specialists evaluate technical merits, originality, and budget reasonableness.' },
        { stepNumber: 7, title: 'Present Proposal in Defense Session', description: 'Principal Investigator defends project objectives before the expert evaluation committee.' },
        { stepNumber: 8, title: 'Receive Sanction Order & Fund Disbursement', description: 'Monitor grant sanction status and release of capital and recurring grant installments.', externalActionUrl: 'https://www.serbonline.in/SERB/Proposal_Status' },
      ],
    });

    await ApplicationRequirement.insertMany([
      {
        applicationId: appSERB._id,
        documentType: 'Doctoral Degree (Ph.D.) Certificate',
        documentName: 'Doctor of Philosophy (Ph.D.) Degree Diploma',
        required: true,
        description: 'Authenticated doctorate degree certificate issued by recognized university.',
        reason: 'Statutory eligibility credential confirming highest level of academic and scientific training.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 240,
        mandatoryFields: ['fullName', 'institution', 'issueDate'],
      },
      {
        applicationId: appSERB._id,
        documentType: 'Detailed Research Proposal',
        documentName: 'Original Technical Research Project Proposal & Methodology',
        required: true,
        description: 'Comprehensive research plan formatted in SERB prescribed template (max 25 pages).',
        reason: 'Primary document evaluated by PAC peer reviewers for scientific novelty and feasibility.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 25 * 1024 * 1024,
        validityPeriodMonths: 12,
      },
      {
        applicationId: appSERB._id,
        documentType: 'Institutional Endorsement Certificate',
        documentName: 'Certificate from Head of Institution / Registrar (Endorsement Form)',
        required: true,
        description: 'Signed and sealed declaration affirming institutional lab access and financial management compliance.',
        reason: 'Statutory guarantee that the host university will administer grant funds transparently.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 12,
        mandatoryFields: ['issuingAuthority', 'issueDate'],
      },
      {
        applicationId: appSERB._id,
        documentType: 'Publications Record',
        documentName: 'List of Peer-Reviewed Indexed Publications & Patents',
        required: true,
        description: 'Complete bibliographic list of papers in SCI/Scopus indexed journals with citation metrics.',
        reason: 'Demonstrates Principal Investigator research track record and domain leadership.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 12,
      },
      {
        applicationId: appSERB._id,
        documentType: 'Detailed Budget Justification',
        documentName: 'Itemized Budget Table (Capital Equipment, Consumables & Manpower)',
        required: true,
        description: 'Year-wise breakdown of estimated expenses with formal vendor quotations for major equipment.',
        reason: 'Required by government audit to justify financial allocation and grant value.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 12,
      },
    ]);

    // 5. UK Student Visa
    const appUK = await Application.create({
      name: 'UK Student Visa (Student Route & Chevening Scholarships)',
      code: 'UK-STUDENT-VISA',
      country: 'United Kingdom',
      category: 'Student Visa',
      purpose: 'Undergraduate and Postgraduate Study at Licensed UK Higher Education Sponsors',
      authority: 'UK Visas and Immigration (UKVI) & Home Office',
      description: 'Official route for international students who have been offered an unconditional place on an approved course of study by a licensed Student sponsor in the United Kingdom.',
      eligibility: 'Confirmed CAS statement from licensed university sponsor, sufficient financial maintenance funds, and English language proficiency.',
      officialWebsite: 'https://www.gov.uk/student-visa',
      officialApplyUrl: 'https://www.gov.uk/apply-to-come-to-the-uk',
      requirementsUrl: 'https://www.gov.uk/student-visa/documents-you-must-provide',
      trackingUrl: 'https://www.gov.uk/view-prove-immigration-status',
      guidanceSteps: [
        { stepNumber: 1, title: 'Obtain Unconditional Offer & CAS Number', description: 'Accept offer of admission and receive Confirmation of Acceptance for Studies (CAS) from university.', requiresDocuments: true, relatedDocTypes: ['Confirmation of Acceptance for Studies (CAS)'] },
        { stepNumber: 2, title: 'Complete Tuberculosis (TB) Medical Screening', description: 'Undergo chest x-ray at an approved IOM clinic and obtain TB clearance certificate.', requiresDocuments: true, relatedDocTypes: ['Tuberculosis (TB) Test Certificate'] },
        { stepNumber: 3, title: 'Fulfill Financial Maintenance Requirements (28-Day Rule)', description: 'Hold required living maintenance funds continuously in bank account for at least 28 consecutive days.', requiresDocuments: true, relatedDocTypes: ['Financial Maintenance Evidence'] },
        { stepNumber: 4, title: 'Verify Credentials on VerifyHub', description: 'Pre-validate CAS credentials, financial statements, and passport validity before visa submission.', requiresDocuments: true },
        { stepNumber: 5, title: 'Submit UKVI Online Visa Application', description: 'Complete official UKVI application form online and pay £490 visa application fee.', externalActionUrl: 'https://www.gov.uk/apply-to-come-to-the-uk' },
        { stepNumber: 6, title: 'Pay Immigration Health Surcharge (IHS)', description: 'Pay statutory NHS health surcharge (£776 per year of study) for full access to British healthcare.' },
        { stepNumber: 7, title: 'Book & Attend VFS Global Biometric Appointment', description: 'Submit digital fingerprints and facial photograph at nearest UK Visa Application Centre.' },
        { stepNumber: 8, title: 'Receive Decision & eVisa / Biometric Residence Permit (BRP)', description: 'Collect passport with entry vignette or access digital UK immigration status online.', externalActionUrl: 'https://www.gov.uk/view-prove-immigration-status' },
      ],
    });

    await ApplicationRequirement.insertMany([
      {
        applicationId: appUK._id,
        documentType: 'Confirmation of Acceptance for Studies (CAS)',
        documentName: 'CAS Statement Issued by Licensed Sponsor University',
        required: true,
        description: 'Official electronic confirmation statement containing unique 14-digit CAS reference code.',
        reason: 'Statutory proof of unconditional university admission and course registration.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 6,
        mandatoryFields: ['fullName', 'documentNumber', 'institution'],
      },
      {
        applicationId: appUK._id,
        documentType: 'Current Valid International Passport',
        documentName: 'Current Passport with Minimum 1 Blank Page',
        required: true,
        description: 'Scanned bio-data page and signature page of valid passport.',
        reason: 'Statutory primary identification and biometric entry vignette stamp recipient.',
        acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
        maxFileSize: 10 * 1024 * 1024,
        validityPeriodMonths: 6,
        mandatoryFields: ['fullName', 'documentNumber', 'expiryDate'],
      },
      {
        applicationId: appUK._id,
        documentType: 'Tuberculosis (TB) Test Certificate',
        documentName: 'IOM Approved Tuberculosis Clearance Medical Certificate',
        required: true,
        description: 'Certificate from an approved Home Office diagnostic clinic certifying freedom from infectious TB.',
        reason: 'Mandatory health screening clearance for residents of designated countries staying > 6 months.',
        acceptedFormats: ['application/pdf', 'image/jpeg'],
        maxFileSize: 5 * 1024 * 1024,
        validityPeriodMonths: 6,
        mandatoryFields: ['fullName', 'issueDate'],
      },
      {
        applicationId: appUK._id,
        documentType: 'Financial Maintenance Evidence',
        documentName: 'Bank Statements Demonstrating 28-Day Maintenance Funds',
        required: true,
        description: 'Statements showing required living costs plus outstanding course fees held for 28 consecutive days.',
        reason: 'Strict UKVI financial threshold test ensuring student self-sufficiency during studies.',
        acceptedFormats: ['application/pdf'],
        maxFileSize: 15 * 1024 * 1024,
        validityPeriodMonths: 1,
        mandatoryFields: ['fullName', 'issuingAuthority', 'issueDate'],
      },
    ]);

    console.log('[Seed] Successfully seeded 5 VerifyHub applications and 24 document requirements!');
  } catch (err) {
    console.error('[Seed] Error in seedApplicationsAndRequirementsIfEmpty:', err);
  }
};

export const seedFacultyConnectIfEmpty = async () => {
  try {
    const profileCount = await FacultyProfile.countDocuments();
    if (profileCount > 0) {
      console.log('[Seed] Faculty Connect directory already seeded. Skipping.');
      return;
    }

    console.log('[Seed] Seeding Faculty Connect directory, faculty profiles, and student questions...');

    const defaultPassword = 'Admin@123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // Helper to get or create faculty user
    const getOrCreateUser = async (data) => {
      let u = await User.findOne({ email: data.email.toLowerCase() });
      if (!u) {
        u = await User.create({
          ...data,
          email: data.email.toLowerCase(),
          passwordHash,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
          isActive: true,
        });
      }
      return u;
    };

    // 1. Dr. Radhika Sharma (CSE - Lead Java & Systems)
    const userRadhika = await getOrCreateUser({
      name: 'Dr. Radhika Sharma',
      email: 'radhika.cse@nexcampus.edu',
      role: 'faculty',
      phone: '+91 9876500005',
    });

    // 2. Dr. Arvind Verma (CSE HOD)
    const userArvind = await getOrCreateUser({
      name: 'Dr. Arvind Verma',
      email: 'hod.cse@nexcampus.edu',
      role: 'hod',
      phone: '+91 9876500004',
    });

    // 3. Dr. Meenakshi Sundaram (AI & Data Science)
    const userMeenakshi = await getOrCreateUser({
      name: 'Dr. Meenakshi Sundaram',
      email: 'meenakshi.ai@nriit.ac.in',
      role: 'faculty',
      phone: '+91 9876510011',
    });

    // 4. Prof. Suresh Nambiar (ECE - Embedded & IoT)
    const userSuresh = await getOrCreateUser({
      name: 'Prof. Suresh Nambiar',
      email: 'suresh.ece@nriit.ac.in',
      role: 'faculty',
      phone: '+91 9876510012',
    });

    // 5. Prof. Rajeshwari V (IT - Full Stack & Web)
    const userRajeshwari = await getOrCreateUser({
      name: 'Prof. Rajeshwari V',
      email: 'rajeshwari.it@nriit.ac.in',
      role: 'faculty',
      phone: '+91 9876510013',
    });

    // 6. Dr. K. Venkat Rao (Mechanical & Mechatronics)
    const userVenkat = await getOrCreateUser({
      name: 'Dr. K. Venkat Rao',
      email: 'venkat.mech@nriit.ac.in',
      role: 'faculty',
      phone: '+91 9876510014',
    });

    // Create Faculty Profiles
    const profiles = [
      {
        userId: userRadhika._id,
        name: 'Dr. Radhika Sharma',
        email: userRadhika.email,
        designation: 'Associate Professor',
        department: 'Computer Science & Engineering',
        departmentCode: 'CSE',
        qualification: 'Ph.D. in Computer Science (IIT Delhi)',
        experienceYears: 8,
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        subjects: ['Java', 'Data Structures', 'Database Management Systems', 'Object Oriented Programming'],
        expertise: ['Full Stack Development', 'Cloud Computing', 'Enterprise Architecture', 'Distributed Systems'],
        bio: 'Senior faculty mentor and researcher with 8+ years experience specializing in high-throughput database systems, distributed systems, and modern Java backend architectures. Passionate about project-based student learning.',
        officeLocation: 'Academic Block-B, Cabin 304',
        officeHours: '02:00 PM - 04:30 PM',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        isAvailable: true,
        stats: {
          questionsAnswered: 142,
          avgResponseTime: '< 3 hours',
          activeDiscussions: 3,
          rating: 4.9,
          studentSatisfaction: '98%',
        },
        officeSchedule: [
          { day: 'Monday', timeSlot: '02:00 PM - 04:00 PM', room: 'Cabin 304', status: 'Available' },
          { day: 'Wednesday', timeSlot: '02:00 PM - 04:30 PM', room: 'Cabin 304', status: 'Available' },
          { day: 'Friday', timeSlot: '03:00 PM - 05:00 PM', room: 'Computing Lab 2', status: 'Available' },
        ],
      },
      {
        userId: userArvind._id,
        name: 'Dr. Arvind Verma',
        email: userArvind.email,
        designation: 'Professor & Head of Department',
        department: 'Computer Science & Engineering',
        departmentCode: 'CSE',
        qualification: 'Ph.D. in Systems & Cybersecurity',
        experienceYears: 16,
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
        subjects: ['Operating Systems', 'Computer Networks', 'Linux Kernel Internals', 'Information Security'],
        expertise: ['Systems Programming', 'Cyber Security', 'Network Protocols', 'Virtualization Architecture'],
        bio: 'HOD of Computer Science & Engineering with 16+ years in academia and research. Author of 24 publications in IEEE/ACM transactions on secure kernel scheduling and container isolation.',
        officeLocation: 'HOD Suite, Tech Complex Room 101',
        officeHours: '11:00 AM - 01:00 PM',
        availableDays: ['Monday', 'Tuesday', 'Thursday'],
        isAvailable: true,
        stats: {
          questionsAnswered: 98,
          avgResponseTime: '< 5 hours',
          activeDiscussions: 1,
          rating: 4.8,
          studentSatisfaction: '96%',
        },
        officeSchedule: [
          { day: 'Tuesday', timeSlot: '11:00 AM - 01:00 PM', room: 'HOD Office 101', status: 'Available' },
          { day: 'Thursday', timeSlot: '11:00 AM - 01:00 PM', room: 'HOD Office 101', status: 'Available' },
        ],
      },
      {
        userId: userMeenakshi._id,
        name: 'Dr. Meenakshi Sundaram',
        email: userMeenakshi.email,
        designation: 'Professor',
        department: 'Artificial Intelligence & Data Science',
        departmentCode: 'AI&DS',
        qualification: 'Ph.D. in Machine Learning (IISc Bangalore)',
        experienceYears: 12,
        photo: 'https://images.unsplash.com/photo-1580894732454-defbe4fe8b7c?w=400&auto=format&fit=crop&q=80',
        subjects: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Python for AI'],
        expertise: ['Computer Vision', 'Generative AI', 'Large Language Models', 'PyTorch & TensorFlow'],
        bio: 'Lead researcher in applied deep learning and medical imaging informatics. Mentored over 40 graduate research projects and runs the NRIIT Center for AI Innovation.',
        officeLocation: 'AI Innovation Lab, Block-D Room 202',
        officeHours: '03:00 PM - 05:00 PM',
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
        isAvailable: true,
        stats: {
          questionsAnswered: 210,
          avgResponseTime: '< 2 hours',
          activeDiscussions: 2,
          rating: 5.0,
          studentSatisfaction: '99%',
        },
        officeSchedule: [
          { day: 'Monday', timeSlot: '03:00 PM - 05:00 PM', room: 'AI Lab 202', status: 'Available' },
          { day: 'Wednesday', timeSlot: '03:00 PM - 05:00 PM', room: 'AI Lab 202', status: 'Available' },
          { day: 'Thursday', timeSlot: '03:30 PM - 05:00 PM', room: 'AI Lab 202', status: 'Available' },
        ],
      },
      {
        userId: userSuresh._id,
        name: 'Prof. Suresh Nambiar',
        email: userSuresh.email,
        designation: 'Assistant Professor',
        department: 'Electronics & Communication',
        departmentCode: 'ECE',
        qualification: 'M.Tech in VLSI & Embedded Systems',
        experienceYears: 7,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        subjects: ['Digital Signal Processing', 'Embedded Systems', 'Microprocessors 8086/ARM', 'Internet of Things (IoT)'],
        expertise: ['ARM Cortex Architecture', 'FPGA Prototyping', 'Embedded C', 'Robotics Systems'],
        bio: 'Embedded hardware architect and coordinator of the NRIIT Robotics and IoT Club. Regular mentor for national smart hardware hackathons.',
        officeLocation: 'Electronics Block, Cabin E-12',
        officeHours: '01:30 PM - 03:30 PM',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        isAvailable: true,
        stats: {
          questionsAnswered: 84,
          avgResponseTime: '< 4 hours',
          activeDiscussions: 1,
          rating: 4.7,
          studentSatisfaction: '95%',
        },
        officeSchedule: [
          { day: 'Monday', timeSlot: '01:30 PM - 03:30 PM', room: 'Cabin E-12', status: 'Available' },
          { day: 'Wednesday', timeSlot: '01:30 PM - 03:30 PM', room: 'IoT Lab', status: 'Available' },
        ],
      },
      {
        userId: userRajeshwari._id,
        name: 'Prof. Rajeshwari V',
        email: userRajeshwari.email,
        designation: 'Assistant Professor',
        department: 'Information Technology',
        departmentCode: 'IT',
        qualification: 'M.Tech in Software Engineering',
        experienceYears: 6,
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        subjects: ['Web Technologies', 'JavaScript & Frameworks', 'Software Testing & Agile', 'Cloud DevOps'],
        expertise: ['React', 'Node.js & Express', 'REST & GraphQL APIs', 'Docker & CI/CD'],
        bio: 'Passionate software engineering educator with hands-on industry background in full stack web development and cloud-native applications.',
        officeLocation: 'IT Wing, Cabin 208',
        officeHours: '10:00 AM - 12:30 PM',
        availableDays: ['Monday', 'Tuesday', 'Friday'],
        isAvailable: false,
        stats: {
          questionsAnswered: 115,
          avgResponseTime: '< 3 hours',
          activeDiscussions: 0,
          rating: 4.9,
          studentSatisfaction: '97%',
        },
        officeSchedule: [
          { day: 'Monday', timeSlot: '10:00 AM - 12:30 PM', room: 'Cabin 208', status: 'Available' },
          { day: 'Tuesday', timeSlot: '10:00 AM - 12:30 PM', room: 'Web Dev Lab', status: 'Available' },
        ],
      },
      {
        userId: userVenkat._id,
        name: 'Dr. K. Venkat Rao',
        email: userVenkat.email,
        designation: 'Associate Professor',
        department: 'Mechanical Engineering',
        departmentCode: 'MECH',
        qualification: 'Ph.D. in Computational Mechanics',
        experienceYears: 11,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        subjects: ['Finite Element Analysis', 'CAD/CAM Modeling', 'Thermodynamics', 'Kinematics & Dynamics of Machines'],
        expertise: ['ANSYS Simulations', 'SolidWorks CAD', 'Mechatronics', 'Drone Airframe Design'],
        bio: 'Mechanical design consultant and researcher in computational simulations and drone aerodynamic modeling. Guides senior year capstone fabrication teams.',
        officeLocation: 'Mechanical Block, Room M-05',
        officeHours: '02:00 PM - 04:00 PM',
        availableDays: ['Tuesday', 'Wednesday', 'Thursday'],
        isAvailable: true,
        stats: {
          questionsAnswered: 65,
          avgResponseTime: '< 6 hours',
          activeDiscussions: 1,
          rating: 4.8,
          studentSatisfaction: '94%',
        },
        officeSchedule: [
          { day: 'Tuesday', timeSlot: '02:00 PM - 04:00 PM', room: 'CAD Center', status: 'Available' },
          { day: 'Thursday', timeSlot: '02:00 PM - 04:00 PM', room: 'Room M-05', status: 'Available' },
        ],
      },
    ];

    for (const p of profiles) {
      await FacultyProfile.create(p);
    }

    // Seed Sample Questions from Student Aarav
    const studentAarav = await User.findOne({ email: 'aarav.kapoor@nexcampus.edu' }) || await User.findOne({ role: 'student' });
    if (studentAarav) {
      // Question 1: Answered Question with Dr. Radhika Sharma
      const q1Id = 'QST-2026-10492';
      const q1 = await FacultyQuestion.create({
        questionId: q1Id,
        studentId: studentAarav._id,
        studentName: studentAarav.name,
        studentEmail: studentAarav.email,
        studentRollNo: '21CS042',
        studentDepartment: 'Computer Science & Engineering',
        facultyId: userRadhika._id,
        facultyName: 'Dr. Radhika Sharma',
        facultyDepartment: 'Computer Science & Engineering',
        subject: 'Database Management Systems',
        category: 'Concept Clarification',
        priority: 'Important',
        title: 'Clarification on BCNF vs 3NF decomposition with functional dependency loss',
        body: "Good morning Ma'am! During the Unit 3 lecture on normalization, I was solving problem 4.2. In what specific circumstances does decomposing a relation into BCNF fail to preserve dependencies, and why does 3NF preserve it while allowing slight redundancy? Could you provide a clear canonical example?",
        attachments: [],
        isPrivate: false,
        status: 'Answered',
        lastReplyAt: new Date(Date.now() - 3600000 * 4),
      });

      await QuestionMessage.create([
        {
          questionId: q1Id,
          senderId: studentAarav._id,
          senderName: studentAarav.name,
          senderRole: 'student',
          senderAvatar: studentAarav.avatar || '',
          message: q1.body,
          isFacultyAnswer: false,
          createdAt: new Date(Date.now() - 3600000 * 24),
        },
        {
          questionId: q1Id,
          senderId: userRadhika._id,
          senderName: 'Dr. Radhika Sharma',
          senderRole: 'faculty',
          senderAvatar: userRadhika.avatar || '',
          message: "Hello Aarav! Excellent question. A relation R is in BCNF if for every non-trivial functional dependency X -> Y, X is a superkey. Consider R(A, B, C) with dependencies AB -> C and C -> B. Here both {A, B} and {A, C} are candidate keys. If we decompose into (B, C) to satisfy C -> B, the dependency AB -> C cannot be verified without an expensive JOIN operation across decomposed tables! In contrast, 3NF relaxes this constraint by permitting dependencies where Y is a prime attribute (part of any candidate key). Hence, 3NF guarantees dependency preservation while BCNF guarantees zero redundancy at the cost of potential dependency loss.",
          isFacultyAnswer: true,
          createdAt: new Date(Date.now() - 3600000 * 18),
        },
        {
          questionId: q1Id,
          senderId: studentAarav._id,
          senderName: studentAarav.name,
          senderRole: 'student',
          senderAvatar: studentAarav.avatar || '',
          message: "Thank you so much Ma'am! That canonical example of R(A, B, C) made it completely clear. In university exams, should we explicitly highlight this trade-off if dependency preservation is requested?",
          isFacultyAnswer: false,
          createdAt: new Date(Date.now() - 3600000 * 6),
        },
        {
          questionId: q1Id,
          senderId: userRadhika._id,
          senderName: 'Dr. Radhika Sharma',
          senderRole: 'faculty',
          senderAvatar: userRadhika.avatar || '',
          message: "Yes, absolutely Aarav! Explicitly noting that 3NF preserves all functional dependencies whereas BCNF eliminates all redundancy will earn full marks in schema design questions.",
          isFacultyAnswer: false,
          createdAt: new Date(Date.now() - 3600000 * 4),
        },
      ]);

      // Question 2: Resolved Question with Dr. Meenakshi Sundaram
      const q2Id = 'QST-2026-38291';
      const q2 = await FacultyQuestion.create({
        questionId: q2Id,
        studentId: studentAarav._id,
        studentName: studentAarav.name,
        studentEmail: studentAarav.email,
        studentRollNo: '21CS042',
        studentDepartment: 'Computer Science & Engineering',
        facultyId: userMeenakshi._id,
        facultyName: 'Dr. Meenakshi Sundaram',
        facultyDepartment: 'Artificial Intelligence & Data Science',
        subject: 'Artificial Intelligence & Machine Learning',
        category: 'Lab / Practical Doubt',
        priority: 'Normal',
        title: 'Vanishing gradient issue during backpropagation in deep MLP lab experiment',
        body: 'Respected Madam, while running Lab Experiment 4 with a 6-layer MLP using sigmoid activations on MNIST, the training loss saturates after epoch 2. Is replacing sigmoid with LeakyReLU and applying He normal initialization the recommended solution?',
        attachments: [],
        isPrivate: true,
        status: 'Resolved',
        resolvedAt: new Date(Date.now() - 3600000 * 12),
        lastReplyAt: new Date(Date.now() - 3600000 * 12),
      });

      await QuestionMessage.create([
        {
          questionId: q2Id,
          senderId: studentAarav._id,
          senderName: studentAarav.name,
          senderRole: 'student',
          senderAvatar: studentAarav.avatar || '',
          message: q2.body,
          isFacultyAnswer: false,
          createdAt: new Date(Date.now() - 3600000 * 48),
        },
        {
          questionId: q2Id,
          senderId: userMeenakshi._id,
          senderName: 'Dr. Meenakshi Sundaram',
          senderRole: 'faculty',
          senderAvatar: userMeenakshi.avatar || '',
          message: "Dear Aarav, precisely! The derivative of the sigmoid function caps at 0.25, causing gradients in layers 1-3 to vanish exponentially as (0.25)^n. Use LeakyReLU(negative_slope=0.01) and initialize weights with torch.nn.init.kaiming_normal_. You can also add nn.BatchNorm1d between linear layers.",
          isFacultyAnswer: true,
          createdAt: new Date(Date.now() - 3600000 * 20),
        },
        {
          questionId: q2Id,
          senderId: studentAarav._id,
          senderName: studentAarav.name,
          senderRole: 'student',
          senderAvatar: studentAarav.avatar || '',
          message: "Implemented LeakyReLU + Kaiming normal init and validation accuracy hit 98.2% on epoch 5! Marking this as resolved. Thank you Madam!",
          isFacultyAnswer: false,
          createdAt: new Date(Date.now() - 3600000 * 12),
        },
      ]);

      // Question 3: In Progress Question with Dr. Arvind Verma
      const q3Id = 'QST-2026-72819';
      await FacultyQuestion.create({
        questionId: q3Id,
        studentId: studentAarav._id,
        studentName: studentAarav.name,
        studentEmail: studentAarav.email,
        studentRollNo: '21CS042',
        studentDepartment: 'Computer Science & Engineering',
        facultyId: userArvind._id,
        facultyName: 'Dr. Arvind Verma',
        facultyDepartment: 'Computer Science & Engineering',
        subject: 'Operating Systems',
        category: 'Assignment Doubt',
        priority: 'Urgent',
        title: "Deadlock handling in assignment 2: Banker's safety state edge cases",
        body: "Sir, in Assignment 2 question 3, if multiple processes can simultaneously satisfy Need <= Work, does the sequence order impact whether a safe state is achieved?",
        attachments: [],
        isPrivate: false,
        status: 'In Progress',
        lastReplyAt: new Date(Date.now() - 3600000 * 2),
      });

      await QuestionMessage.create([
        {
          questionId: q3Id,
          senderId: studentAarav._id,
          senderName: studentAarav.name,
          senderRole: 'student',
          senderAvatar: studentAarav.avatar || '',
          message: "Sir, in Assignment 2 question 3, if multiple processes can simultaneously satisfy Need <= Work, does the sequence order impact whether a safe state is achieved?",
          isFacultyAnswer: false,
          createdAt: new Date(Date.now() - 3600000 * 8),
        },
        {
          questionId: q3Id,
          senderId: userArvind._id,
          senderName: 'Dr. Arvind Verma',
          senderRole: 'hod',
          senderAvatar: userArvind.avatar || '',
          message: "Reviewing your query Aarav. In Banker's algorithm, if a system is in a safe state, exploring any valid process sequence where Need <= Work will safely release its Allocation into Work. Exploring valid orderings may yield different sequence paths, but will never turn a safe state into an unsafe state. I am reviewing your simulation edge cases.",
          isFacultyAnswer: false,
          createdAt: new Date(Date.now() - 3600000 * 2),
        },
      ]);
    }

    console.log('[Seed] Successfully seeded 6 faculty profiles and active student questions!');
  } catch (err) {
    console.error('[Seed] Error in seedFacultyConnectIfEmpty:', err);
  }
};

export const seedPortalEnhancementsIfEmpty = async () => {
  try {
    // 1. Seed Skills Catalog
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      console.log('[Seed] Seeding curated Skills Catalog & Free Resources...');

      const skillsToSeed = [
        {
          title: 'Modern Full-Stack Web Development',
          slug: 'fullstack-web-dev',
          category: 'Technical',
          level: 'Beginner',
          description: 'Master HTML5, CSS3, JavaScript ES6+, Node.js, Express, and React to build enterprise-grade modern web applications.',
          estimatedDays: 30,
          icon: 'fas fa-code',
          tags: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express', 'React', 'MongoDB'],
          modules: [
            { day: 1, title: 'HTML5 Semantic Structure & Responsive Viewports', description: 'Semantic elements, accessibilities, viewport meta tags.' },
            { day: 2, title: 'CSS3 Flexbox, Grid & Modern Layouts', description: 'Two-dimensional alignment, mobile-first design.' },
            { day: 3, title: 'Modern JavaScript ES6+ Syntaxes & Data Types', description: 'Destructuring, arrow functions, template literals.' },
            { day: 4, title: 'DOM Manipulation & Dynamic Event Handling', description: 'Event listeners, delegation, dynamic DOM rendering.' },
            { day: 5, title: 'Asynchronous JavaScript: Promises & Async/Await', description: 'Fetch API, microtask queues, error handling.' },
            { day: 10, title: 'Node.js Architecture & Express REST APIs', description: 'Middleware, routing, HTTP response formatting.' },
            { day: 15, title: 'MongoDB & Mongoose Schema Modeling', description: 'Data modeling, indexes, relationships, CRUD pipelines.' },
            { day: 20, title: 'JWT Authentication & Security Best Practices', description: 'Tokens, bcrypt hashing, cookie security, authorization.' },
            { day: 25, title: 'React Fundamentals: Components, Props & State', description: 'Hooks (useState, useEffect), reactive state trees.' },
            { day: 30, title: 'Full-Stack Capstone Project Deployment', description: 'Docker containerization, cloud hosting, CI/CD pipeline.' },
          ],
        },
        {
          title: 'Python for Data Structures & Algorithms',
          slug: 'python-dsa',
          category: 'Technical',
          level: 'Intermediate',
          description: 'Comprehensive DSA track covering algorithmic complexity, recursion, trees, graphs, dynamic programming and competitive coding.',
          estimatedDays: 30,
          icon: 'fab fa-python',
          tags: ['Python', 'DSA', 'Algorithms', 'Big-O', 'LeetCode', 'Interview Prep'],
          modules: [
            { day: 1, title: 'Asymptotic Analysis & Big-O Notation', description: 'Time and space complexity profiling.' },
            { day: 3, title: 'Two Pointers & Sliding Window Patterns', description: 'Array optimization and subarray problems.' },
            { day: 7, title: 'Linked Lists & Pointer Manipulations', description: 'Singly, doubly linked lists and cycle detection.' },
            { day: 12, title: 'Stacks, Queues & Monotonic Sequences', description: 'LIFO, FIFO patterns, expression parsing.' },
            { day: 18, title: 'Binary Trees & Binary Search Trees (BST)', description: 'In-order, pre-order, post-order, BFS/DFS traversal.' },
            { day: 24, title: 'Graph Algorithms: BFS, DFS, Dijkstra', description: 'Adjacency list, shortest paths, topological sort.' },
            { day: 30, title: 'Dynamic Programming & Memoization', description: 'Overlapping subproblems and optimal substructure.' },
          ],
        },
        {
          title: 'Campus Placement & Technical Interview Mastery',
          slug: 'interview-mastery',
          category: 'Career',
          level: 'All Levels',
          description: 'Land dream corporate placement offers with structured aptitude, coding problem-solving patterns, system design basics, and HR mock rounds.',
          estimatedDays: 30,
          icon: 'fas fa-user-tie',
          tags: ['Aptitude', 'System Design', 'Mock Interview', 'HR Prep', 'Resume Building'],
          modules: [
            { day: 1, title: 'ATS-Compliant Resume & LinkedIn Optimization', description: 'Crafting high-impact STAR resume bullets.' },
            { day: 5, title: 'Quantitative Aptitude: Speed Math & Algebra', description: 'Percentages, ratios, time-speed-distance shortcuts.' },
            { day: 10, title: 'Logical Reasoning & Data Interpretation', description: 'Seating arrangements, syllogisms, graph analysis.' },
            { day: 15, title: 'Verbal Ability & Technical Communication', description: 'Grammar nuances, sentence correction, comprehension.' },
            { day: 22, title: 'Core CS Concepts Review: OS, DBMS, Networks', description: 'ACID properties, indexing, process vs thread.' },
            { day: 30, title: 'Behavioral Interviews (STAR Method) & Salary Negotiation', description: 'Handling behavioral rounds with executive confidence.' },
          ],
        },
        {
          title: 'Deep Work & Time Management for Engineers',
          slug: 'deep-work-productivity',
          category: 'Productivity',
          level: 'All Levels',
          description: 'Science-backed focus routines, Pomodoro intervals, time blocking, and digital decluttering to maximize cognitive output.',
          estimatedDays: 30,
          icon: 'fas fa-stopwatch',
          tags: ['Pomodoro', 'Time Blocking', 'Focus', 'Productivity', 'Habit Building'],
          modules: [
            { day: 1, title: 'Auditing Your Attention & Distraction Traps', description: 'Identify digital cognitive leaks.' },
            { day: 5, title: 'The Pomodoro Technique: 25/5 & 50/10 Cycles', description: 'Ultradian rhythms and cognitive focus.' },
            { day: 12, title: 'Time Blocking & Energy Scheduling', description: 'Designing deep work versus shallow work windows.' },
            { day: 20, title: 'Eliminating Procrastination with Micro-Commitments', description: 'Activation energy reduction.' },
            { day: 30, title: 'Sustained Academic & Professional Mastery System', description: 'Weekly review and long-term goal alignment.' },
          ],
        },
        {
          title: 'Engineering Leadership & Agile Collaboration',
          slug: 'agile-engineering-leadership',
          category: 'Professional',
          level: 'Intermediate',
          description: 'Master Agile Scrum frameworks, constructive code review practices, cross-functional team communication, and project leadership.',
          estimatedDays: 30,
          icon: 'fas fa-chalkboard-teacher',
          tags: ['Agile', 'Scrum', 'Git Flow', 'Code Review', 'Leadership'],
          modules: [
            { day: 1, title: 'Agile Manifesto & Scrum Ceremonies', description: 'Sprints, standups, retrospectives, backlogs.' },
            { day: 10, title: 'Professional Git Flow & Trunk-Based Development', description: 'Branching strategies, conflict resolution.' },
            { day: 20, title: 'Effective Code Reviews & Mentorship', description: 'Giving constructive feedback and maintaining quality.' },
            { day: 30, title: 'Technical Leadership & High-Performing Teams', description: 'Inspiring teams and resolving technical deadlock.' },
          ],
        },
        {
          title: 'Cloud Computing & DevOps Fundamentals',
          slug: 'cloud-devops-fundamentals',
          category: 'Technical',
          level: 'Intermediate',
          description: 'Learn Docker containers, Linux server administration, AWS cloud fundamentals, and automated GitHub Actions CI/CD.',
          estimatedDays: 30,
          icon: 'fas fa-cloud',
          tags: ['Docker', 'AWS', 'Linux', 'DevOps', 'CI/CD', 'GitHub Actions'],
          modules: [
            { day: 1, title: 'Linux Command Line & Bash Shell Scripting', description: 'File systems, permissions, process management.' },
            { day: 10, title: 'Docker Containers & Multi-Stage Builds', description: 'Images, containers, Docker Compose.' },
            { day: 20, title: 'AWS Core Services: EC2, S3, RDS, IAM', description: 'Cloud infrastructure provisioning and IAM roles.' },
            { day: 30, title: 'Automated CI/CD Pipelines with GitHub Actions', description: 'Testing, linting, building, and automated deploy.' },
          ],
        },
      ];

      const createdSkills = await Skill.create(skillsToSeed);

      // Seed Curated Free Resources
      const webDevSkill = createdSkills.find((s) => s.slug === 'fullstack-web-dev');
      const dsaSkill = createdSkills.find((s) => s.slug === 'python-dsa');
      const placementSkill = createdSkills.find((s) => s.slug === 'interview-mastery');
      const productivitySkill = createdSkills.find((s) => s.slug === 'deep-work-productivity');

      await SkillResource.create([
        {
          skillId: webDevSkill?._id,
          title: 'Full Stack Open — University of Helsinki (Free)',
          category: 'Technical',
          url: 'https://fullstackopen.com/en/',
          type: 'Course',
          provider: 'University of Helsinki',
          isFree: true,
          description: 'World-renowned free course on React, Redux, Node.js, REST APIs, GraphQL, and TypeScript.',
        },
        {
          skillId: webDevSkill?._id,
          title: 'freeCodeCamp Full-Stack Developer Curriculum',
          category: 'Technical',
          url: 'https://www.freecodecamp.org/learn/',
          type: 'Interactive',
          provider: 'freeCodeCamp',
          isFree: true,
          description: 'Hands-on interactive challenges and verified certificates in Responsive Web Design and JavaScript.',
        },
        {
          skillId: webDevSkill?._id,
          title: 'MDN Web Docs (Mozilla Official Guides)',
          category: 'Technical',
          url: 'https://developer.mozilla.org/',
          type: 'Documentation',
          provider: 'Mozilla',
          isFree: true,
          description: 'The definitive open documentation for web standards and APIs.',
        },
        {
          skillId: dsaSkill?._id,
          title: 'Harvard CS50: Introduction to Computer Science',
          category: 'Technical',
          url: 'https://cs50.harvard.edu/x/',
          type: 'Course',
          provider: 'Harvard University',
          isFree: true,
          description: 'Harvard University entry-level course on algorithms, data structures, and computational thinking.',
        },
        {
          skillId: dsaSkill?._id,
          title: 'NeetCode 150 Problem Roadmap',
          category: 'Technical',
          url: 'https://neetcode.io/roadmap',
          type: 'Interactive',
          provider: 'NeetCode',
          isFree: true,
          description: 'Structured curated list of 150 essential LeetCode coding patterns with video explanations.',
        },
        {
          skillId: placementSkill?._id,
          title: 'IndiaBIX Quantitative Aptitude & Reasoning Tests',
          category: 'Career',
          url: 'https://www.indiabix.com/',
          type: 'Interactive',
          provider: 'IndiaBIX',
          isFree: true,
          description: 'Comprehensive practice questions with formula sheets for campus recruitment exams.',
        },
        {
          skillId: placementSkill?._id,
          title: 'Tech Interview Handbook by Yangshun Tay',
          category: 'Career',
          url: 'https://www.techinterviewhandbook.org/',
          type: 'Article',
          provider: 'GitHub Open Source',
          isFree: true,
          description: 'Curated free study plans, behavioral cheatsheets, and coding checklists.',
        },
        {
          skillId: productivitySkill?._id,
          title: 'The Pomodoro Technique Guide & Focus Principles',
          category: 'Productivity',
          url: 'https://francescocirillo.com/products/the-pomodoro-technique',
          type: 'Article',
          provider: 'Cirillo Consulting',
          isFree: true,
          description: 'Foundational framework for overcoming mental friction and tracking uninterrupted focus.',
        },
      ]);

      console.log('[Seed] Curated Skills & Free Resources seeded successfully!');
    }

    // 2. Seed Upcoming Exams (for live countdown)
    const examCount = await UpcomingExam.countDocuments();
    if (examCount === 0) {
      console.log('[Seed] Seeding Upcoming Exams for real-time countdown...');
      const targetDate1 = new Date();
      targetDate1.setDate(targetDate1.getDate() + 4);
      targetDate1.setHours(9, 30, 0, 0);

      const targetDate2 = new Date();
      targetDate2.setDate(targetDate2.getDate() + 9);
      targetDate2.setHours(14, 0, 0, 0);

      await UpcomingExam.create([
        {
          subject: 'Design & Analysis of Algorithms',
          subjectCode: 'CS502PC',
          examName: 'End-Semester Theory Examination',
          examDate: targetDate1,
          startTime: '09:30 AM',
          endTime: '12:30 PM',
          durationMinutes: 180,
          venue: 'Examination Block B - Hall 301',
          maxMarks: 100,
          category: 'Semester-End',
          targetSemester: 5,
          targetDepartment: 'Computer Science & Engineering',
          instructions: [
            'Physical Hall Ticket & NRIIT Student ID Card are mandatory for entry.',
            'Report to Examination Hall 20 minutes prior to commencement.',
            'Programmable calculators and mobile phones are strictly prohibited.',
          ],
        },
        {
          subject: 'Web Technologies & Cloud Computing Lab',
          subjectCode: 'CS508PC',
          examName: 'Practical Examination & Viva Voce',
          examDate: targetDate2,
          startTime: '02:00 PM',
          endTime: '05:00 PM',
          durationMinutes: 180,
          venue: 'Main Computer Centre - Lab 4',
          maxMarks: 50,
          category: 'Lab Practical',
          targetSemester: 5,
          targetDepartment: 'Computer Science & Engineering',
          instructions: [
            'Bring your signed Laboratory Record Notebook.',
            'Code execution and test case verification will be conducted online.',
          ],
        },
      ]);
      console.log('[Seed] Upcoming Exams seeded successfully!');
    }

    // 3. Seed College Announcements
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0) {
      console.log('[Seed] Seeding Official College Announcements...');
      const adminUser = await User.findOne({ role: { $in: ['admin', 'super_admin'] } });

      await Announcement.create([
        {
          title: 'End-Semester Theory & Practical Examination Schedule Declared',
          content: 'The official timetable for B.Tech Semester V End-Semester Examinations (Nov/Dec 2026) has been published. All students must download their verified Hall Tickets and verify exam halls.',
          category: 'Exam',
          priority: 'URGENT',
          targetAudience: ['all', 'student', 'faculty'],
          publishedBy: adminUser?._id,
          publisherName: 'Office of Controller of Examinations',
        },
        {
          title: 'NRIIT Annual Hackathon 2026 — Register Your Teams',
          content: 'Registrations are now open for NRIIT Smart Campus Hackathon 2026! Cash prizes worth ₹2,50,000 for winning projects in AI/ML, CleanTech, and Web3. Submit your problem statement proposals before the deadline.',
          category: 'General',
          priority: 'IMPORTANT',
          targetAudience: ['student', 'faculty'],
          publishedBy: adminUser?._id,
          publisherName: 'Dean of Student Affairs',
        },
        {
          title: 'TCS & Cognizant Joint Mega Placement Drive 2026',
          content: 'Eligible students of CSE, ECE, and IT with CGPA >= 7.0 and no active backlogs are instructed to register on the Placements portal before Saturday 5:00 PM for the upcoming campus recruitment drive.',
          category: 'Placement',
          priority: 'IMPORTANT',
          targetAudience: ['student'],
          publishedBy: adminUser?._id,
          publisherName: 'Training & Placement Cell',
        },
      ]);
      console.log('[Seed] College Announcements seeded successfully!');
    }
  } catch (err) {
    console.error('[Seed] Error in seedPortalEnhancementsIfEmpty:', err);
  }
};



