import { aiTools } from './aiTools.js';

// Language configuration & metadata
export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', voiceLocale: 'en-IN' },
  te: { code: 'te', name: 'Telugu', voiceLocale: 'te-IN' },
  hi: { code: 'hi', name: 'Hindi', voiceLocale: 'hi-IN' },
  ta: { code: 'ta', name: 'Tamil', voiceLocale: 'ta-IN' },
  kn: { code: 'kn', name: 'Kannada', voiceLocale: 'kn-IN' },
  ml: { code: 'ml', name: 'Malayalam', voiceLocale: 'ml-IN' },
};

/**
 * Intent Classifier
 */
function classifyIntent(text) {
  const query = text.toLowerCase();

  if (query.match(/attendance|present|absent|shortage|bunk|హాజరు|उपस्थिति|வருகை|ಹಾಜರಾತಿ|ഹാജർ/)) {
    return 'attendance';
  }
  if (query.match(/lab|practical|code exam|coding exam|compiler|టెస్ట్|ల్యాబ్|लैब|லேப்|ಲ್ಯಾಬ್|ലാബ്/)) {
    return 'lab_exam';
  }
  if (query.match(/timetable|schedule|period|class today|today class|routine|టైంటేబుల్|సమయసారణి|समय सारणी|நேர அட்டவணை|ವೇಳಾಪಟ್ಟಿ|ടൈംടേബിൾ/)) {
    return 'timetable';
  }
  if (query.match(/mark|cgpa|sgpa|grade|score|result|gpa|మార్కులు|గ్రేడ్|अंक|रिजल्ट|மதிப்பெண்|ಅಂಕಗಳು|മാർക്കുകൾ/)) {
    return 'marks';
  }
  if (query.match(/fee|due|payment|tuition|receipt|balance|చలానా|ఫీజు|फीस|கட்டணம்|ಶುಲ್ಕ|ഫീസ്/)) {
    return 'fees';
  }

  if (query.match(/bus|transport|route|pickup|driver|రూట్|బస్సు|बस|பேருந்து|ಬಸ್ಸು|ബസ്/)) {
    return 'bus_route';
  }
  if (query.match(/rule|regulation|handbook|policy|dress code|detention|నియమాలు|నిబంధనలు|नियम|விதிகள்|ನಿಯಮಗಳು|ನಿಯಮങ്ങൾ/)) {
    return 'regulations';
  }

  if (query.match(/what document|documents do i need|documents required|required documents|visa document|scholarship document|what documents|పత్రాలు కావాలి|కావాల్సిన పత్రాలు|దస్తావేజులు|दस्तावेज़ चाहिए|आवश्यक दस्तावेज़|தேவையான ஆவணங்கள்|ಯಾವ ದಾಖಲೆಗಳು/)) {
    return 'document_requirements';
  }

  if (query.match(/my document|pending document|verification status|verifyhub|rejected document|re-upload|reupload|is my document valid|నా పత్రాలు|ధృవీకరణ స్థితి|పరిశీలన|मेरे दस्तावेज़|सत्यापन स्थिति|சரிபார்ப்பு நிலை|ದಾಖಲೆಯ ಸ್ಥಿತಿ/)) {
    return 'document_status';
  }

  if (query.match(/faculty|professor|ask faculty|doubt|teacher|mentor|cabin|office hour|లెక్చరర్|ఫ్యాకల్టీ|ప్రొఫెసర్|అధ్యాపకులు|शिक्षक|प्रोफेसर/)) {
    return 'faculty_connect';
  }

  if (query.match(/skill|typing|practice|wpm|typing speed|pomodoro|study timer|learning plan|checklist|certificate|నైపుణ్యాలు|టైపింగ్|कौशल|टाइपिंग/)) {
    return 'skills';
  }

  if (query.match(/upcoming exam|exam date|countdown|next exam|theory exam|schedule exam|ఎగ్జామ్|పరీక్ష తేదీ|परीक्षा की तारीख|अगली परीक्षा/)) {
    return 'upcoming_exams';
  }

  return 'general';
}

/**
 * Multilingual Response Formatter
 */
export const aiService = {
  async processGroundedQuery({ message, language = 'en', user }) {
    const lang = (language in SUPPORTED_LANGUAGES) ? language : 'en';
    const intent = classifyIntent(message);
    const userId = user._id;
    const role = user.role;

    let responseText = '';
    let sources = [];
    let structuredData = null;

    switch (intent) {
      case 'attendance': {
        const att = await aiTools.getAttendance(userId, role);
        sources.push('Live Attendance Ledger');
        structuredData = att;

        if (!att.available) {
          responseText = att.message;
          break;
        }

        const pct = att.overallPercentage;
        const attendedStr = `${att.presentClasses}/${att.totalClasses}`;
        const isSafe = pct >= 75;

        if (lang === 'te') {
          responseText = `📊 **హాజరు వివరాలు (${att.studentName})**:\n\nమీ ప్రస్తుత మొత్తం హాజరు శాతం **${pct}%** (${attendedStr} తరగతులకు హాజరయ్యారు).\n\n${isSafe
            ? '✅ మీ హాజరు 75% కనీస అవసరం కంటే ఎక్కువగా ఉంది. పరీక్షలకు మీరు అర్హులు.'
            : '⚠️ **హెచ్చరిక**: మీ హాజరు 75% కన్నా తక్కువగా ఉంది! పరీక్షలకు హాజరు కావడానికి రాబోయే తరగతులకు తప్పకుండా హాజరుకండి.'
            }`;
        } else if (lang === 'hi') {
          responseText = `📊 **उपस्थिति रिकॉर्ड (${att.studentName})**:\n\nआपकी वर्तमान कुल उपस्थिति **${pct}%** है (${attendedStr} कक्षाएं उपस्थित)।\n\n${isSafe
            ? '✅ आपकी उपस्थिति 75% अनिवार्य सीमा से ऊपर है। आप परीक्षाओं के लिए पात्र हैं।'
            : '⚠️ **चेतावनी**: आपकी उपस्थिति 75% से कम है! हॉल टिकट के लिए आगामी कक्षाओं में उपस्थिति दर्ज कराएं।'
            }`;
        } else if (lang === 'ta') {
          responseText = `📊 **வருகை விவரம் (${att.studentName})**:\n\nஉங்கள் தற்போதைய வருகை **${pct}%** ஆகும் (${attendedStr} வகுப்புகளில் கலந்துகொண்டவை).\n\n${isSafe
            ? '✅ உங்கள் வருகை 75% தேவைக்கு மேல் உள்ளது. நீங்கள் தேர்வுக்கு தகுதியுடையவர்.'
            : '⚠️ **எச்சரிக்கை**: உங்கள் வருகை 75% குறைவாக உள்ளது. வரவிருக்கும் வகுப்புகளில் தவறாமல் கலந்துகொள்ளவும்.'
            }`;
        } else if (lang === 'kn') {
          responseText = `📊 **ಹಾಜರಾತಿ ವಿವರ (${att.studentName})**:\n\nನಿಮ್ಮ ಪ್ರಸ್ತುತ ಒಟ್ಟು ಹಾಜರಾತಿ **${pct}%** ಆಗಿದೆ (${attendedStr} ತರಗತಿಗಳಿಗೆ ಹಾಜರಾಗಿದ್ದೀರಿ).\n\n${isSafe
            ? '✅ ನಿಮ್ಮ ಹಾಜರಾತಿ ಕನಿಷ್ಠ 75% ಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಪರೀಕ್ಷೆಗೆ ನೀವು ಅರ್ಹರಾಗಿದ್ದೀರಿ.'
            : '⚠️ **ಎಚ್ಚರಿಕೆ**: ನಿಮ್ಮ ಹಾಜರಾತಿ 75% ಕ್ಕಿಂತ ಕಡಿಮೆಯಾಗಿದೆ. ಮುಂದಿನ ತರಗತಿಗಳಿಗೆ ನಿಯಮಿತವಾಗಿ ಹಾಜರಾಗಿ.'
            }`;
        } else if (lang === 'ml') {
          responseText = `📊 **ഹാജർ രേഖ (${att.studentName})**:\n\nനിങ്ങളുടെ നിലവിലെ മൊത്തം ഹാജർ **${pct}%** ആണ് (${attendedStr} സെഷനുകൾ).\n\n${isSafe
            ? '✅ നിങ്ങളുടെ ഹാജർ 75% നിബന്ധനയ്ക്ക് മുകളിലാണ്. പരീക്ഷയ്ക്ക് നിങ്ങൾ യോഗ്യനാണ്.'
            : '⚠️ **മുന്നറിയിപ്പ്**: നിങ്ങളുടെ ഹാജർ 75% ൽ താഴെയാണ്. വരാനിരിക്കുന്ന ക്ലാസുകളിൽ കൃത്യമായി പങ്കെടുക്കുക.'
            }`;
        } else {
          // English default
          responseText = `📊 **Attendance Record (${att.studentName})**:\n\nYour current overall attendance is **${pct}%** (${attendedStr} classes attended).\n\n${isSafe
            ? '✅ Your attendance satisfies the statutory 75% requirement. You are eligible for end-semester examinations.'
            : '⚠️ **Shortage Alert**: Your attendance is currently below 75%. You must attend upcoming lectures to prevent detention.'
            }`;
        }
        break;
      }

      case 'timetable': {
        const tt = await aiTools.getTimetable(userId, role);
        sources.push('Department Academic Schedule');
        structuredData = tt;

        if (!tt.available || !tt.slots || tt.slots.length === 0) {
          responseText = lang === 'te' ? '📅 ఈరోజు మీకు తరగతులు లేవు లేదా షెడ్యూల్ అందుబాటులో లేదు.' : '📅 No scheduled lectures found for today.';
          break;
        }

        const slotLines = tt.slots.map((s) => `• **${s.time}**: ${s.subject} (${s.room})`).join('\n');

        if (lang === 'te') {
          responseText = `📅 **${tt.day} టైంటేబుల్ షెడ్యూల్**:\n\n${slotLines}`;
        } else if (lang === 'hi') {
          responseText = `📅 **${tt.day} समय सारणी (टाइमटेबल)**:\n\n${slotLines}`;
        } else if (lang === 'ta') {
          responseText = `📅 **${tt.day} வகுப்பு அட்டவணை**:\n\n${slotLines}`;
        } else if (lang === 'kn') {
          responseText = `📅 **${tt.day} ವೇಳಾಪಟ್ಟಿ ವಿವರ**:\n\n${slotLines}`;
        } else if (lang === 'ml') {
          responseText = `📅 **${tt.day} ടൈംടേബിൾ ഷെഡ്യൂൾ**:\n\n${slotLines}`;
        } else {
          responseText = `📅 **Academic Schedule for ${tt.day}**:\n\n${slotLines}`;
        }
        break;
      }

      case 'marks': {
        const marks = await aiTools.getMarks(userId, role);
        sources.push('Registrar Evaluation Ledger');
        structuredData = marks;

        if (!marks.available) {
          responseText = marks.message;
          break;
        }

        const subList = (marks.marksList || []).map((m) => `• ${m.subject}: **${m.score}** (${m.internalExam})`).join('\n') || '• Internal assessments recorded in SIS.';

        if (lang === 'te') {
          responseText = `🎓 **విద్యా రికార్డు (${marks.studentName})**:\n\n• ప్రస్తుత CGPA: **${marks.cgpa} / 10.0**\n• సక్రియ బ్యాక్‌లాగ్‌లు: **${marks.backlogs}**\n\n📝 **ఇటీవలి ఇంటర్నల్ మార్కులు**:\n${subList}`;
        } else if (lang === 'hi') {
          responseText = `🎓 **शैक्षणिक स्कोरकार्ड (${marks.studentName})**:\n\n• वर्तमान CGPA: **${marks.cgpa} / 10.0**\n• सक्रिय बैकलॉग: **${marks.backlogs}**\n\n📝 **हालिया आंतरिक अंक**:\n${subList}`;
        } else if (lang === 'ta') {
          responseText = `🎓 **கல்வி மதிப்பெண் (${marks.studentName})**:\n\n• தற்போதைய CGPA: **${marks.cgpa} / 10.0**\n• நிலுவை பாடங்கள்: **${marks.backlogs}**\n\n📝 **சமீபத்திய மதிப்பெண்கள்**:\n${subList}`;
        } else if (lang === 'kn') {
          responseText = `🎓 **ಶೈಕ್ಷಣಿಕ ಅಂಕಪಟ್ಟಿ (${marks.studentName})**:\n\n• ಪ್ರಸ್ತುತ CGPA: **${marks.cgpa} / 10.0**\n• ಸಕ್ರಿಯ ಬ್ಯಾಕ್‌ಲಾಗ್‌ಗಳು: **${marks.backlogs}**\n\n📝 **ಇತ್ತೀಚಿನ ಅಂಕಗಳು**:\n${subList}`;
        } else if (lang === 'ml') {
          responseText = `🎓 **വിദ്യാഭ്യാസ സ്കോർകാർഡ് (${marks.studentName})**:\n\n• നിലവിലെ CGPA: **${marks.cgpa} / 10.0**\n• ബാക്ക്‌ലോഗുകൾ: **${marks.backlogs}**\n\n📝 **സമീപകാല മാർക്കുകൾ**:\n${subList}`;
        } else {
          responseText = `🎓 **Academic Standing (${marks.studentName})**:\n\n• Cumulative CGPA: **${marks.cgpa} / 10.0**\n• Active Backlogs: **${marks.backlogs}**\n\n📝 **Continuous Assessment Scores**:\n${subList}`;
        }
        break;
      }

      case 'fees': {
        const fees = await aiTools.getFeeStatus(userId, role);
        sources.push('Campus Accounts Office');
        structuredData = fees;

        if (!fees.available) {
          responseText = fees.message;
          break;
        }

        const balFmt = `₹${fees.pendingBalance.toLocaleString('en-IN')}`;
        const paidFmt = `₹${fees.totalPaid.toLocaleString('en-IN')}`;

        if (lang === 'te') {
          responseText = `💳 **ఫీజు స్థితి వివరాలు (${fees.studentName})**:\n\n• మొత్తం వార్షిక రుసుము: ₹95,000\n• చెల్లించిన మొత్తం: **${paidFmt}**\n• బకాయి మొత్తం: **${balFmt}**\n\n${fees.hasPendingDues
            ? '⚠️ మీ పోర్టల్‌లోని "Fees" ట్యాబ్‌లో UPI / నెట్‌బ్యాంకింగ్ ద్వారా బకాయిలను చెల్లించవచ్చు.'
            : '✅ అన్ని ఫీజు బకాయిలు చెల్లించబడ్డాయి. ధన్యవాదాలు!'
            }`;
        } else if (lang === 'hi') {
          responseText = `💳 **शुल्क स्थिति (${fees.studentName})**:\n\n• कुल वार्षिक शुल्क: ₹95,000\n• भुगतान की गई राशि: **${paidFmt}**\n• शेष बकाया: **${balFmt}**\n\n${fees.hasPendingDues
            ? '⚠️ आप अपने पोर्टल में "Fees" टैब पर जाकर ऑनलाइन भुगतान कर सकते हैं।'
            : '✅ सभी शुल्क पूर्ण रूप से चुकाए जा चुके हैं।'
            }`;
        } else if (lang === 'ta') {
          responseText = `💳 **கட்டண விவரம் (${fees.studentName})**:\n\n• மொத்த வருடாந்திர கட்டணம்: ₹95,000\n• செலுத்தப்பட்ட தொகை: **${paidFmt}**\n• நிலுவை தொகை: **${balFmt}**\n\n${fees.hasPendingDues
            ? '⚠️ "Fees" பிரிவில் சென்று ஆன்லைனில் நிலுவையை செலுத்தலாம்.'
            : '✅ கட்டணங்கள் அனைத்தும் முறையாக செலுத்தப்பட்டுள்ளன.'
            }`;
        } else if (lang === 'kn') {
          responseText = `💳 **ಶುಲ್ಕ ಸ್ಥಿತಿ (${fees.studentName})**:\n\n• ಒಟ್ಟು ವಾರ್ಷಿಕ ಶುಲ್ಕ: ₹95,000\n• ಪಾವತಿಸಿದ ಮೊತ್ತ: **${paidFmt}**\n• ಬಾಕಿ ಮೊತ್ತ: **${balFmt}**\n\n${fees.hasPendingDues
            ? '⚠️ ನಿಮ್ಮ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ "Fees" ಟ್ಯಾಬ್ ಬಳಸಿ ಬಾಕಿ ಪಾವತಿಸಿ.'
            : '✅ ಯಾವುದೇ ಶುಲ್ಕ ಬಾಕಿ ಇಲ್ಲ.'
            }`;
        } else if (lang === 'ml') {
          responseText = `💳 **ഫീസ് നില (${fees.studentName})**:\n\n• വാർഷിക ഫീസ്: ₹95,000\n• അടച്ച തുക: **${paidFmt}**\n• ബാക്കി തുക: **${balFmt}**\n\n${fees.hasPendingDues
            ? '⚠️ "Fees" വിഭാഗം വഴി ബാക്കി ഫീസ് അടയ്ക്കാവുന്നതാണ്.'
            : '✅ എല്ലാ ഫീസുകളും പൂർണ്ണമായി അടച്ചു.'
            }`;
        } else {
          responseText = `💳 **Fee Ledger Overview (${fees.studentName})**:\n\n• Annual Tuition: ₹95,000\n• Total Amount Paid: **${paidFmt}**\n• Pending Due Balance: **${balFmt}**\n\n${fees.hasPendingDues
            ? '⚠️ You have outstanding dues. You can pay securely via UPI/NetBanking under the **Fees** tab to download your receipt.'
            : '✅ No outstanding dues found. Your academic accounts are fully cleared.'
            }`;
        }
        break;
      }

      case 'lab_exam': {
        const lab = await aiTools.getLabExams(userId, role);
        sources.push('Online Practical Examination System');
        structuredData = lab;

        const examList = (lab.exams || [])
          .map((e) => `• **${e.title}** (${e.examCode}): ${e.status.toUpperCase()} | Attempt: ${e.submissionStatus}${e.score ? ` (Score: ${e.score})` : ''}`)
          .join('\n');

        if (lang === 'te') {
          responseText = `💻 **ప్రాక్టికల్ ల్యాబ్ పరీక్షల స్థితి**:\n\n${examList || 'ఈ సమయంలో చురుకైన ల్యాబ్ పరీక్షలు ఏవీ లేవు.'}`;
        } else if (lang === 'hi') {
          responseText = `💻 **प्रैक्टिकल लैब परीक्षा विवरण**:\n\n${examList || 'वर्तमान में कोई सक्रिय लैब परीक्षा निर्धारित नहीं है।'}`;
        } else if (lang === 'ta') {
          responseText = `💻 **செய்முறை ஆய்வக தேர்வு விவரம்**:\n\n${examList || 'தற்போது எந்த ஆய்வக தேர்வும் இல்லை.'}`;
        } else if (lang === 'kn') {
          responseText = `💻 **ಪ್ರಾಯೋಗಿಕ ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳ ವಿವರ**:\n\n${examList || 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಸಕ್ರಿಯ ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳಿಲ್ಲ.'}`;
        } else if (lang === 'ml') {
          responseText = `💻 **പ്രായോഗിക ലാബ് പരീക്ഷകൾ**:\n\n${examList || 'നിലവിൽ ലാബ് പരീക്ഷകൾ ഒന്നും ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല.'}`;
        } else {
          responseText = `💻 **Practical Lab Examination Schedule**:\n\n${examList || 'No active lab exams currently scheduled.'}`;
        }
        break;
      }

      case 'bus_route': {
        const transport = await aiTools.getTransportRoutes();
        sources.push('Campus Transport Department');
        structuredData = transport;

        const busLines = (transport.routes || []).map((r) => `• **${r.routeNumber}**: ${r.name} (Driver: ${r.driver})`).join('\n');

        if (lang === 'te') {
          responseText = `🚌 **క్యాంపస్ బస్సు రూట్లు & వివరాలు**:\n\n${busLines}`;
        } else if (lang === 'hi') {
          responseText = `🚌 **परिवहन व बस रूट विवरण**:\n\n${busLines}`;
        } else if (lang === 'ta') {
          responseText = `🚌 **கல்லூரி பேருந்து வழித்தடங்கள்**:\n\n${busLines}`;
        } else if (lang === 'kn') {
          responseText = `🚌 **ಕ್ಯಾಂಪಸ್ ಬಸ್ಸು ಮಾರ್ಗಗಳು**:\n\n${busLines}`;
        } else if (lang === 'ml') {
          responseText = `🚌 **ക്യാമ്പസ് ബസ് റൂട്ടുകൾ**:\n\n${busLines}`;
        } else {
          responseText = `🚌 **Campus Transport & Bus Routes**:\n\n${busLines}`;
        }
        break;
      }

      case 'regulations': {
        const docs = await aiTools.searchRegulations(message);
        if (docs.length > 0) {
          sources.push(docs[0].title);
          responseText = `📖 **NRI Institute of Technology Regulations (${docs[0].category})**:\n\n${docs[0].content}\n\n*Reference: ${docs[0].title}*`;
        } else {
          responseText = `📖 **Institution Academic Regulations**:\n\n• Minimum 75% attendance mandatory for semester end examination eligibility.\n• Continuous Internal Assessments (CIA) carry 40% weightage, and End Semester 60%.\n• Relative 10-point GPA scale enforced (O, A+, A, B+, B, C, F).`;
        }
        break;
      }

      case 'document_requirements': {
        const reqData = await aiTools.getDocumentRequirements(message);
        if (!reqData.available) {
          responseText = reqData.message;
          break;
        }

        sources.push(`VerifyHub Registry: ${reqData.applicationName}`);
        const docList = reqData.requirements
          .map((r) => `• **${r.documentName}** (${r.required ? 'Mandatory' : 'Optional'}): ${r.reason}`)
          .join('\n');

        if (lang === 'te') {
          responseText = `📄 **${reqData.applicationName} (${reqData.country}) కొరకు అవసరమైన పత్రాలు**:\n\n${docList}\n\n🔗 అధికారిక పోర్టల్: ${reqData.officialApplyUrl}`;
        } else if (lang === 'hi') {
          responseText = `📄 **${reqData.applicationName} (${reqData.country}) के लिए आवश्यक दस्तावेज़**:\n\n${docList}\n\n🔗 आधिकारिक पोर्टल: ${reqData.officialApplyUrl}`;
        } else if (lang === 'ta') {
          responseText = `📄 **${reqData.applicationName} தேவையான ஆவணங்கள்**:\n\n${docList}\n\n🔗 அதிகாரப்பூர்வ தளம்: ${reqData.officialApplyUrl}`;
        } else if (lang === 'kn') {
          responseText = `📄 **${reqData.applicationName} ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು**:\n\n${docList}\n\n🔗 ಅಧಿಕೃತ ಪೋರ್ಟಲ್: ${reqData.officialApplyUrl}`;
        } else if (lang === 'ml') {
          responseText = `📄 **${reqData.applicationName} ആവശ്യമായ രേഖകൾ**:\n\n${docList}\n\n🔗 ഔദ്യോഗിക പോർട്ടൽ: ${reqData.officialApplyUrl}`;
        } else {
          responseText = `📄 **Required Documents for ${reqData.applicationName} (${reqData.country})**:\n\n${docList}\n\n🌐 **Official Apply URL**: ${reqData.officialApplyUrl}`;
        }
        break;
      }

      case 'document_status': {
        const myDocs = await aiTools.getMyDocumentsStatus(userId);
        if (!myDocs.hasDocuments) {
          if (lang === 'te') {
            responseText = `📄 మీరు VerifyHub లో ఇంకా ఏ పత్రాలను అప్‌లోడ్ చేయలేదు. 'Documents & Verification' విభాగంలో పత్రాలను అప్‌లోడ్ చేయవచ్చు.`;
          } else if (lang === 'hi') {
            responseText = `📄 आपने अभी तक VerifyHub में कोई दस्तावेज़ अपलोड नहीं किया है। आप 'Documents & Verification' अनुभाग से अपलोड कर सकते हैं।`;
          } else {
            responseText = `📄 You have not uploaded any documents to VerifyHub yet. Visit the 'Documents & Verification' hub to submit your credentials!`;
          }
          break;
        }

        sources.push('VerifyHub Member Ledger');
        const docSummary = myDocs.documents
          .slice(0, 5)
          .map((d) => `• **${d.title}** (v${d.version}): \`${d.status.toUpperCase()}\` — Risk: ${d.riskLevel.toUpperCase()}`)
          .join('\n');

        if (lang === 'te') {
          responseText = `🔍 **మీ పత్రాల ధృవీకరణ స్థితి (${myDocs.total} పత్రాలు)**:\n• ధృవీకరించబడినవి: ${myDocs.verified} | పరిశీలనలో ఉన్నవి: ${myDocs.pending} | రీ-అప్‌లోడ్: ${myDocs.reupload}\n\n${docSummary}`;
        } else if (lang === 'hi') {
          responseText = `🔍 **आपके दस्तावेज़ों की सत्यापन स्थिति (${myDocs.total} दस्तावेज़)**:\n• सत्यापित: ${myDocs.verified} | प्रक्रियाधीन: ${myDocs.pending} | पुनः अपलोड: ${myDocs.reupload}\n\n${docSummary}`;
        } else {
          responseText = `🔍 **Your Document Verification Status (${myDocs.total} Documents)**:\n• **Verified**: ${myDocs.verified} | **In Progress**: ${myDocs.pending} | **Re-upload Required**: ${myDocs.reupload}\n\n${docSummary}\n\n*View full audit reports and timeline on the VerifyHub dashboard.*`;
        }
        break;
      }

      case 'faculty_connect': {
        const fc = await aiTools.getFacultyConnectData(userId, role);
        sources.push('Faculty Connect Directory');
        structuredData = fc;

        const facultyList = fc.featuredFaculty.slice(0, 3).map((f) => `• **${f.name}** (${f.designation}, ${f.department}) — Cabin: ${f.officeHours}`).join('\n');
        const questionSummary = fc.questions.length > 0
          ? fc.questions.slice(0, 2).map((q) => `• ${q.subject}: "${q.title}" (\`${q.status}\`) with Prof. ${q.facultyName}`).join('\n')
          : '• You have no pending faculty questions.';

        if (lang === 'te') {
          responseText = `👨‍🏫 **ఫ్యాకల్టీ కనెక్ట్ వివరాలు**:\n\nమీ ప్రశ్నల స్థితి:\n${questionSummary}\n\nఅందుబాటులో ఉన్న ప్రముఖ అధ్యాపకులు:\n${facultyList}\n\n*మీ సందేహాలను నివృత్తి చేసుకోవడానికి పోర్టల్‌లోని "Faculty Connect" విభాగంలో నేరుగా ప్రశ్న అడగవచ్చు.*`;
        } else if (lang === 'hi') {
          responseText = `👨‍🏫 **फैकल्टी कनेक्ट विवरण**:\n\nआपके प्रश्नों की स्थिति:\n${questionSummary}\n\nउपलब्ध प्रमुख प्राध्यापक:\n${facultyList}\n\n*पोर्टल पर "Faculty Connect" टैब से आप सीधे किसी भी विषय के शिक्षक से प्रश्न पूछ सकते हैं।*`;
        } else {
          responseText = `👨‍🏫 **Faculty Connect & Mentorship**:\n\nYour Recent Questions:\n${questionSummary}\n\nFeatured Faculty Members:\n${facultyList}\n\n*Submit questions or schedule guidance sessions under the "Faculty Connect" tab.*`;
        }
        break;
      }

      case 'skills': {
        const sk = await aiTools.getEnrolledSkills(userId);
        sources.push('Skill Learning Hub');
        structuredData = sk;

        const planList = sk.activePlans.length > 0
          ? sk.activePlans.map((p) => `• **${p.title}** (${p.category}): ${p.progress} completed (Target: ${p.targetDate})`).join('\n')
          : '• No active 30-day learning track currently enrolled.';

        const typingInfo = sk.lastTypingTest
          ? `⌨️ **Typing Test Record**: Best Speed: **${sk.lastTypingTest.wpm} WPM** (Accuracy: ${sk.lastTypingTest.accuracy})`
          : '⌨️ **Typing Practice**: Start a 1, 3, or 5-minute typing speed test in the Skills Hub!';

        if (lang === 'te') {
          responseText = `💡 **స్కిల్ లెర్నింగ్ హబ్ స్థితి**:\n\nమీ 30-రోజుల లెర్నింగ్ ప్లాన్లు:\n${planList}\n\n${typingInfo}\n\n*స్కిల్స్ ట్యాబ్‌లో ఉచిత లెర్నింగ్ వనరులు, టైపింగ్ ప్రాక్టీస్ మరియు పోమోడోరో టైమర్‌ను ఉపయోగించండి.*`;
        } else if (lang === 'hi') {
          responseText = `💡 **कौशल विकास व लर्निंग हब**:\n\nआपके 30-दिवसीय लर्निंग प्लान:\n${planList}\n\n${typingInfo}\n\n*स्किल्स हब में जाकर आप नए कौशल सीख सकते हैं और प्रमाण पत्र प्राप्त कर सकते हैं।*`;
        } else {
          responseText = `💡 **Skill Learning Hub & Typing Practice**:\n\nActive 30-Day Learning Tracks:\n${planList}\n\n${typingInfo}\n\n*Explore curated free courses, interactive checklists, and Pomodoro study sessions in the Skills Hub.*`;
        }
        break;
      }

      case 'upcoming_exams': {
        const ex = await aiTools.getUpcomingExamsData();
        sources.push('Official Examination Cell');
        structuredData = ex;

        const examList = ex.upcomingExams.length > 0
          ? ex.upcomingExams.map((e) => `• **${e.subject}** (${e.name}): 📅 **${e.date}** at ${e.time} | ⏳ **${e.daysRemaining} days ${e.hoursRemaining} hours left** (Venue: ${e.venue})`).join('\n')
          : '• No formal upcoming exams scheduled in this period.';

        if (lang === 'te') {
          responseText = `📝 **రాబోయే పరీక్షల షెడ్యూల్ & కౌంట్‌డౌన్**:\n\n${examList}\n\n*పరీక్షా కేంద్రానికి మీ హాల్ టికెట్ మరియు ఐడీ కార్డు తప్పనిసరిగా తీసుకురండి.*`;
        } else if (lang === 'hi') {
          responseText = `📝 **आगामी परीक्षा समय सारणी और उलटी गिनती (काउंटडाउन)**:\n\n${examList}\n\n*कृपया परीक्षा हॉल में अपना हॉल टिकट और छात्र आईडी कार्ड साथ लाएं।*`;
        } else {
          responseText = `📝 **Upcoming Examinations & Live Countdown**:\n\n${examList}\n\n*Ensure you download your official hall ticket and carry your student identity card.*`;
        }
        break;
      }

      default: {
        // General Academic Inquiry
        const docs = await aiTools.searchRegulations(message);
        if (docs.length > 0) {
          sources.push(docs[0].title);
          responseText = `📖 **From Campus Handbook**:\n\n${docs[0].content}`;
        } else {
          sources.push('Campus AI Knowledge Base');
          if (lang === 'te') {
            responseText = `నమస్కారం ${user.name}! నేను మీ **NRIIT వాయిస్ అసిస్టెంట్**. మీరు మీ హాజరు శాతం, నేటి టైంటేబుల్, ఫీజు బకాయిలు, CIA మార్కులు, ల్యాబ్ పరీక్షలు లేదా బస్సు మార్గాల గురించి నన్ను అడగవచ్చు.`;
          } else if (lang === 'hi') {
            responseText = `नमस्ते ${user.name}! मैं आपका **NRIIT AI सहायक** हूँ। आप मुझसे अपनी उपस्थिति, आज की समय सारणी, बकाया फीस, आंतरिक अंक, प्रैक्टिकल लैब परीक्षा या बस रूट के बारे में पूछ सकते हैं।`;
          } else if (lang === 'ta') {
            responseText = `வணக்கம் ${user.name}! நான் உங்கள் **NRIIT AI குரல் உதவியாளர்**. உங்கள் வருகை, வகுப்பு அட்டவணை, கட்டண விவரங்கள், மதிப்பெண்கள் அல்லது பேருந்து வழிகள் பற்றி கேட்கலாம்.`;
          } else if (lang === 'kn') {
            responseText = `ನಮಸ್ಕಾರ ${user.name}! ನಾನು ನಿಮ್ಮ **NRIIT ಧ್ವನಿ ಸಹಾಯಕ**. ನಿಮ್ಮ ಹಾಜರಾತಿ, ಇಂದಿನ ವೇಳಾಪಟ್ಟಿ, ಶುಲ್ಕ ಬಾಕಿ, ಅಂಕಗಳು ಅಥವಾ ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಬಹುದು.`;
          } else if (lang === 'ml') {
            responseText = `നമസ്കാരം ${user.name}! ഞാൻ നിങ്ങളുടെ **NRIIT വോയ്‌സ് അസിസ്റ്റന്റാണ്**. നിങ്ങളുടെ ഹാജർ, ടൈംടേബിൾ, ഫീസ് കുടിശ്ശിക, മാർക്കുകൾ, ലാബ് പരീക്ഷകൾ എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കാം.`;
          } else {
            responseText = `Hello ${user.name}! I am your **NRI Institute of Technology Voice & Academic Assistant**. You can speak or type to ask about your attendance percentage, today's lecture schedule, fee dues, CIA marks, lab exams, or campus bus routes!`;
          }
        }
      }
    }

    // Google Gemini API Grounded Synthesis
    const geminiKey = process.env.GEMINI_API_KEY || (process.env.AI_API_KEY && process.env.AI_API_KEY.startsWith('AIza') ? process.env.AI_API_KEY : null);
    if (geminiKey) {
      try {
        const systemPrompt = `You are the official AI Academic & Smart Campus Assistant for NRI Institute of Technology (NRIIT). Answer the student or member politely, accurately, and conversationally in ${SUPPORTED_LANGUAGES[lang]?.name || 'English'}.\nUse the following verified facts from the campus database:\n- User: ${user.name} (${user.role})\n- Topic: ${intent}\n- Verified Campus Data: ${JSON.stringify(structuredData || responseText)}\n\nStrict Rules:\n1. Zero Hallucination: Ground your answer strictly on the campus database facts.\n2. Use clear markdown formatting, bullet points, and appropriate emojis.\n3. Keep the tone helpful, professional, and encouraging.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: message }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidate = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate && candidate.trim()) {
            responseText = candidate.trim();
            sources.unshift('Google Gemini (Grounded API)');
          }
        }
      } catch (err) {
        console.warn('[AI Service] Gemini API call note:', err.message);
      }
    }

    return {
      success: true,
      query: message,
      intent,
      language: lang,
      response: responseText,
      sources,
      voiceLocale: SUPPORTED_LANGUAGES[lang]?.voiceLocale || 'en-IN',
    };
  },
};
