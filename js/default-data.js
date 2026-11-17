/**
 * ==============================================================================
 * قاعدة البيانات الافتراضية لمنصة ArabSecurity (Default Database)
 * ==============================================================================
 * يحتوي هذا الملف على كافة الكورسات، المسارات، الأدوات، والإعدادات الافتراضية.
 * يتم تحميل هذه البيانات ومزامنتها تلقائياً مع LocalStorage لتمكين لوحة الأدمن
 * من التعديل والإضافة والحذف الفوري دون لمس الأكواد البرمجية.
 * ==============================================================================
 */

const DEFAULT_SITE_DATA = {
    // إعدادات الموقع العامة
    settings: {
        siteName: "arabsecurity",
        siteTitle: "منصة ArabSecurity | المرجع العربي الأول للأمن السيبراني",
        heroHeadline: "بوابة التميز السيبراني العربية 2027",
        heroSubheadline: "طريقك الشامل لاحتراف اختبار الاختراق (Red Team) والدفاع السيبراني (Blue Team) وأساسيات أمن المعلومات بأقوى الكورسات المعتمدة وأحدث أدوات الأمن السيبراني.",
        designerName: "Mostafa Ahmed",
        supportEmail1: "sa7amostafaahmed@gmail.com",
        supportEmail2: "mostafasecurity@gmail.com",
        primaryColor: "#8b5cf6",
        secondaryColor: "#6d28d9",
        accentColor: "#a855f7",
        bgColor: "#090514",
        bgType: "kali-blend", // 'kali-blend', 'kali-emblem', 'cyber-grid', 'custom'
        customBgUrl: ""
    },

    // إحصائيات وزيارات الموقع (تظهر فقط في لوحة تحكم الأدمن)
    statistics: {
        totalViews: 1420,
        uniqueVisitors: 685,
        todayViews: 84,
        redTeamViews: 520,
        blueTeamViews: 410,
        basicsViews: 375,
        toolsViews: 615,
        lastUpdated: new Date().toLocaleDateString('ar-EG')
    },

    // الكورسات التعليمية مقسمة حسب المسارات والمستويات
    courses: [
        // ==================== مسار الريد تيم (Red Team) ====================
        {
            id: "red-01",
            track: "red-team",
            level: "beginner",
            levelTitle: "المستوى المبتدئ",
            title: "Penetration Testing Student (PTS) / كورس اختبار الاختراق للمبتدئين",
            abbreviation: "PTS / eJPT v2",
            instructor: "أكاديمية نت رايدرز (Netriders Academy) / م. طارق الجيلاني",
            duration: "دورة مكثفة مع لابات وتطبيق عملي",
            url: "https://netriders.academy/all-courses/penetration-testing-student/",
            description: "كورس معتمد ومصمم خصيصاً لتأسيس الراغبين في دخول مجال الـ Red Team، يغطي منهجية اختبار الاختراق، فحص الشبكات واستكشاف الثغرات وتأهيلك العملي لاجتياز شهادة eJPT العالمية.",
            badge: "eJPT v2 Prep",
            tags: ["Red Team", "eJPT", "مبتدئ", "اختبار اختراق"]
        },
        {
            id: "red-02",
            track: "red-team",
            level: "intermediate",
            levelTitle: "المستوى المتوسط",
            title: "دورة التحضير لشهادة OSCP / OSCP+ (PEN-200) باللغة العربية",
            abbreviation: "OSCP / PEN-200",
            instructor: "MrLimbo | أمن سيبراني واختراق أخلاقي (@Limbo0x01)",
            duration: "سلسلة فيديوهات شاملة ولابات متقدمة",
            url: "https://www.youtube.com/watch?v=7gXkwAmLCzI&list=PL5dZpxpUkHPOeYRHNLOCapZssjgwG6lVr",
            description: "الدورة العربية المتكاملة للتحضير لأقوى وأشهر شهادة عملية في اختبار الاختراق عالمياً (OSCP PEN-200)، تشمل استغلال الثغرات، رفع الصلاحيات (Privilege Escalation)، ومحاكاة هجمات Active Directory الواقعية.",
            badge: "OSCP+ 2025",
            tags: ["OSCP", "PEN-200", "متوسط", "Red Team", "Active Directory"]
        },
        {
            id: "red-03",
            track: "red-team",
            level: "advanced",
            levelTitle: "المستوى المتقدم",
            title: "اختبار اختراق تطبيقات الويب واصطياد الثغرات (Web Pentesting & Bug Bounty)",
            abbreviation: "Web Pentest / Bug Bounty",
            instructor: "المهندس إبراهيم حجازي (Eng. Ibrahim Hegazy)",
            duration: "دورة عملية متقدمة مع أمثلة حية وحالات واقعية",
            url: "https://www.youtube.com/watch?v=BjfCWSFmIFI&list=PLFp3U4AOU6ACPUGth26yLFOMNIVuE67u4",
            description: "دورة احترافية متقدمة من أحد أبرز خبراء أمن الويب في العالم العربي، تشرح تفاصيل استغلال ثغرات الويب الخطيرة (OWASP Top 10)، فحص منطق التطبيقات، احتراف Burp Suite، وكيفية اصطياد الثغرات الأمنية وكتابة تقارير احترافية.",
            badge: "Bug Bounty Hunter",
            tags: ["Web Pentest", "OWASP", "Burp Suite", "متقدم", "Bug Bounty"]
        },

        // ==================== مسار البلو تيم (Blue Team) ====================
        {
            id: "blue-01",
            track: "blue-team",
            level: "beginner",
            levelTitle: "المستوى المبتدئ",
            title: "أساسيات الفريق الأزرق ومحلل مركز العمليات الأمنية (Blue Team Fundamentals & SOC Analyst)",
            abbreviation: "SOC Analyst L1",
            instructor: "المهندس عبد العظيم محمد (Abdalazim Mohamed / @Tanahso)",
            duration: "مسار تأسيسي شامل مع شرح تطبيقي",
            url: "https://www.youtube.com/watch?v=-OUfp-QsZ4c&list=PL45hqlgY25vxRneFoD_9OWmI-x8tAnz42&pp=0gcJCW8DOCosWNin",
            description: "كورس تأسيسي يدخلك عالم الدفاع السيبراني من الباب الأوسع، يشرح دور محلل الـ SOC، كيفية قراءة ومراقبة سجلات الأنظمة (Log Analysis)، رصد وتتبع الهجمات السيبرانية والتصدي لها.",
            badge: "SOC Tier 1",
            tags: ["Blue Team", "SOC", "مبتدئ", "دفاع سيبراني", "Log Analysis"]
        },
        {
            id: "blue-02",
            track: "blue-team",
            level: "intermediate",
            levelTitle: "المستوى المتوسط",
            title: "التحقيق الجنائي الرقمي وحل تحديات سايبر ديفندرز (Digital Forensics & CyberDefenders)",
            abbreviation: "DFIR / CyberDefenders",
            instructor: "قناة Techno Hub (تكنو هب)",
            duration: "تحديات ولابات عملية وتطبيقات واقعية",
            url: "https://www.youtube.com/watch?v=CpplfTqcd5I&list=PLzA_9WOhI7Ve3ZMmtXq3gyGSmiuoxQGQj&pp=0gcJCW8DOCosWNin",
            description: "شروحات عملية وحلول لتحديات منصة CyberDefenders العالمية، تشمل التحقيق الجنائي الرقمي (DFIR)، تحليل إخفاء البيانات (Steganography)، تتبع مسار الاختراق واستخراج الأدلة الرقمية.",
            badge: "DFIR Specialist",
            tags: ["DFIR", "Forensics", "متوسط", "CyberDefenders", "Steganography"]
        },
        {
            id: "blue-03",
            track: "blue-team",
            level: "advanced",
            levelTitle: "المستوى المتقدم",
            title: "الاستجابة للحوادث المتقدمة وصيد التهديدات (Threat Hunting & Advanced Incident Response)",
            abbreviation: "Threat Hunting & IR",
            instructor: "نخبة مهندسي الدفاع السيبراني العربي (Cyber Blue Team Specialists)",
            duration: "مسار تدريبي عالي المستوى لغرف العمليات الأمنية",
            url: "https://www.youtube.com/watch?v=6P8N7VW21MQ&list=PLgKWvRMsdLZ4N_okwVWqB6cgqeVQtZNC4",
            description: "تقنيات متقدمة لصيد التهديدات السيبرانية المعقدة (Threat Hunting)، إدارة ومراقبة منصات SIEM و EDR الحديثة، التحقيق في هجمات الفدية والبرمجيات الخبيثة المتقدمة (APTs) وتطبيق إطار العمل MITRE ATT&CK.",
            badge: "Senior Threat Hunter",
            tags: ["Threat Hunting", "SIEM", "EDR", "متقدم", "Incident Response"]
        },

        // ==================== مسار الأساسيات (Basics) مقسم 4 خطوات ====================
        // الخطوة 1: البرمجة
        {
            id: "basics-01",
            track: "basics",
            level: "step-1",
            stepTitle: "الخطوة الأولى: البرمجة",
            title: "دورة تعلم لغة بايثون كاملة من الصفر (Mastering Python)",
            abbreviation: "Python Fundamentals",
            instructor: "المهندس أسامة الزيرو (Elzero Web School)",
            duration: "دورة تدريبية متكاملة تزيد عن 150 درساً تطبيقياً",
            url: "https://www.youtube.com/watch?v=mvZHDpCHphk&list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs",
            description: "أقوى دورة عربية لتعلم بايثون من الصفر لغير المبرمجين وحتى المستويات الاحترافية، تشمل هياكل البيانات، البرمجة كائنية التوجه (OOP)، الخوارزميات، والتعامل مع الملفات ومكتبات بايثون الأساسية.",
            badge: "Python Core",
            tags: ["بايثون", "الزيرو", "برمجة", "الأساسيات"]
        },
        {
            id: "basics-02",
            track: "basics",
            level: "step-1",
            stepTitle: "الخطوة الأولى: البرمجة",
            title: "بايثون للهكر واختبار الاختراق (Python for Ethical Hackers)",
            abbreviation: "Python For Hackers",
            instructor: "أكاديمية البرمجة الأمنية (CyberSec Academy)",
            duration: "شروحات عملية وتطبيقات أمنية متخصصة",
            url: "https://www.youtube.com/watch?v=KMOS1aPgpgo&list=PLQecpJ5wKrfsF7mZVJxvy53I7FimkGxzZ",
            description: "توظيف بايثون في الهكر الأخلاقي واختبار الاختراق، بناء أدوات فحص الشبكة، أدوات سحب الحزم، سكربتات التخمين، وأتمتة المهام الأمنية وكتابة استغلالات مخصصة.",
            badge: "Offensive Python",
            tags: ["بايثون", "هكر أخلاقي", "أتمتة أمنية", "سكربتات"]
        },

        // الخطوة 2: أنظمة التشغيل
        {
            id: "basics-03",
            track: "basics",
            level: "step-2",
            stepTitle: "الخطوة الثانية: أنظمة التشغيل",
            title: "ويندوز لمحترفي الأمن السيبراني (Windows for Cybersecurity Professionals)",
            abbreviation: "Windows Internals & Sec",
            instructor: "المهندس محمد خريشة (Mohammad Khreesha / تخناوي Technawi)",
            duration: "دورة تأسيسية متعمقة في معمارية الويندوز",
            url: "https://www.youtube.com/watch?v=OpYXo_wrLXk&list=PLroS9tRyoUGrC8GOzQRhyYOfwnub2bvQv",
            description: "فهم عميق لبنية نظام التشغيل ويندوز، إدارة الخدمات والصلاحيات، سجل الأحداث (Event Viewer)، الريجستري (Windows Registry)، وأوامر سطر الأوامر PowerShell للأمان السيبراني.",
            badge: "Windows Architecture",
            tags: ["Windows", "تخناوي", "أنظمة تشغيل", "PowerShell"]
        },
        {
            id: "basics-04",
            track: "basics",
            level: "step-2",
            stepTitle: "الخطوة الثانية: أنظمة التشغيل",
            title: "أساسيات كالي لينكس للمخترقين (Kali Linux Basics for Hackers)",
            abbreviation: "Kali Linux Basics",
            instructor: "قناة Cyber Guy (مستوحى من Linux Basics for Hackers)",
            duration: "سلسلة حلقات تطبيقية تبدأ من سطر الأوامر",
            url: "https://www.youtube.com/watch?v=ZVAddIMB3mg&list=PLDRMxi70CdSD48OPJbsDZRt4l0GvWJ2iG",
            description: "شرح متكامل لأوامر كالي لينكس الأساسية والمتقدمة، إدارة الملفات، التحكم في الصلاحيات والمستخدمين، إعدادات الشبكة، والتعامل الاحترافي مع واجهة سطر الأوامر (Terminal).",
            badge: "Linux Terminal Master",
            tags: ["Kali Linux", "لينكس", "أنظمة تشغيل", "أوامر لينكس"]
        },

        // الخطوة 3: الشبكات
        {
            id: "basics-05",
            track: "basics",
            level: "step-3",
            stepTitle: "الخطوة الثالثة: الشبكات",
            title: "دورة شبكات CompTIA Network+ بالعربي الشاملة",
            abbreviation: "CompTIA Network+",
            instructor: "المهندس سامح رمضان (Eng. Sameh Ramadan)",
            duration: "شرح أكاديمي وعملي شامل لمنهج Network+",
            url: "https://www.youtube.com/watch?v=RFK4Kc_aJYg&list=PLH-n8YK76vIiuIZoWvHL7AvtrDV7hR3He&pp=0gcJCZQGa94AFGB0",
            description: "تأسيس شبكات احترافي يشرح بروتوكولات الإنترنت (TCP/IP, UDP, DNS, DHCP)، نماذج OSI السبعة، تقسيم الشبكات والعنونة IPv4 / IPv6، وأجهزة التوجيه والتبديل وطرق حمايتها.",
            badge: "Network+ Certified",
            tags: ["Network+", "سامح رمضان", "شبكات", "تأسيس شبكي"]
        },
        {
            id: "basics-06",
            track: "basics",
            level: "step-3",
            stepTitle: "الخطوة الثالثة: الشبكات",
            title: "دورة شبكات سيسكو Cisco CCNA 200-301",
            abbreviation: "Cisco CCNA 200-301",
            instructor: "المهندس أحمد نظمي (Eng. Ahmed Nazmy)",
            duration: "أقوى كورس عربي لشهادة CCNA المعيارية",
            url: "https://www.youtube.com/watch?v=J2xws7u7ZeM&list=PL77yNtB4-LjnN2FU3h1v5hIJOHZfW9ugq",
            description: "الدورة المرجعية لشهادة CCNA، تشرح إعداد وتكوين أجهزة سيسكو (Routers & Switches)، مفاهيم الـ VLANs، التوجيه (Routing Protocols)، وتأمين بيئات الشبكات الحقيقية للشركات.",
            badge: "Cisco CCNA",
            tags: ["CCNA", "سيسكو", "أحمد نظمي", "شبكات سيسكو"]
        },

        // الخطوة 4: أساسيات الأمن السيبراني
        {
            id: "basics-07",
            track: "basics",
            level: "step-4",
            stepTitle: "الخطوة الرابعة: أساسيات الأمن السيبراني",
            title: "مدخل شهادات ومفاهيم أمن المعلومات (Introduction to CompTIA Certifications)",
            abbreviation: "Cybersecurity Intro",
            instructor: "المهندس سامح رمضان (Eng. Sameh Ramadan)",
            duration: "سلسلة توجيهية تأسيسية للطلاب والمبتدئين",
            url: "https://www.youtube.com/watch?v=zIpF33NCgrA&list=PLH-n8YK76vIiDdOMRB-ylvns-_8Zl1euV",
            description: "خريطة طريق واضحة ومبسطة لفهم مجالات أمن المعلومات والشهادات المهنية المعتمدة عالمياً، ومفاهيم السرية والنزاهة والتوفر (CIA Triad)، وأنواع التهديدات السيبرانية.",
            badge: "Cyber Fundamentals",
            tags: ["CompTIA", "أمن معلومات", "سامح رمضان", "خارطة طريق"]
        },
        {
            id: "basics-08",
            track: "basics",
            level: "step-4",
            stepTitle: "الخطوة الرابعة: أساسيات الأمن السيبراني",
            title: "دورة شهادة CompTIA Security+ (SY0-601/SY0-701) الشاملة",
            abbreviation: "CompTIA Security+",
            instructor: "المهندس أحمد سلطان (أكاديمية نت رايدرز Netriders)",
            duration: "أشمل كورس عربي لشهادة Security+ العالمية",
            url: "https://www.youtube.com/watch?v=dyKg_bQOXfU&list=PLky4bd7_03m8o1NB0j96OsxZs0KcKlgMO",
            description: "الكورس المعتمد عالمياً كنقطة انطلاق لأي متخصص أمن سيبراني، يغطي التهديدات والهجمات، إدارة الهوية والوصول (IAM)، التشفير، وأمن الشبكات وإدارة المخاطر والامتثال الأمني.",
            badge: "Security+ SY0-601",
            tags: ["Security+", "أحمد سلطان", "نت رايدرز", "شهادات دولية"]
        }
    ],

    // أدوات الأمن السيبراني مقسمة حسب الفئات الخمس
    tools: [
        // ==================== 1. اختبار اختراق الويب ====================
        {
            id: "tool-web-01",
            category: "web",
            categoryName: "اختبار اختراق الويب",
            name: "Burp Suite",
            description: "المنصة الرائدة عالمياً لاختبار أمان تطبيقات الويب، تعمل كـ Proxy لاعتراض حزم HTTP/S وفحص ثغرات الويب المتقدمة وتحليل الطلبات البرمجية.",
            url: "https://portswigger.net/burp",
            badge: "Web Proxy & Scanner",
            tags: ["Web", "Proxy", "Vulnerability Scanner", "OWASP"]
        },
        {
            id: "tool-web-02",
            category: "web",
            categoryName: "اختبار اختراق الويب",
            name: "SQLmap",
            description: "أداة آلية مفتوحة المصدر فائقة القوة لاكتشاف واستغلال ثغرات حقن قواعد البيانات (SQL Injection) وسحب قواعد البيانات والتحكم في الخوادم.",
            url: "https://sqlmap.org/",
            badge: "Database Exploitation",
            tags: ["SQLi", "Database", "Automated Exploitation"]
        },
        {
            id: "tool-web-03",
            category: "web",
            categoryName: "اختبار اختراق الويب",
            name: "Nikto",
            description: "ماسح أمني شامل لخوادم الويب يفحص أكثر من 6700 ملف خطير ومحتمل، والبرمجيات غير المحدثة، وتكوينات الخوادم الخاطئة ومشاكل الأمان.",
            url: "https://cirt.net/Nikto2",
            badge: "Server Vulnerability Scanner",
            tags: ["Web Server", "Scanner", "Configuration"]
        },
        {
            id: "tool-web-04",
            category: "web",
            categoryName: "اختبار اختراق الويب",
            name: "OWASP ZAP",
            description: "أداة مجانية مفتوحة المصدر تابعة لمنظمة OWASP مصممة لمساعدة المطورين ومختبري الاختراق في العثور التلقائي على الثغرات الأمنية في تطبيقات الويب أثناء التطوير والاختبار.",
            url: "https://www.zaproxy.org/",
            badge: "Open Source DAST",
            tags: ["OWASP", "DAST", "Web Security", "Free"]
        },

        // ==================== 2. اختبار اختراق الشبكات ====================
        {
            id: "tool-net-01",
            category: "network",
            categoryName: "اختبار اختراق الشبكات",
            name: "Nmap",
            description: "المعيار العالمي لاستكشاف الشبكات وفحص المنافذ واكتشاف الخدمات وأنظمة التشغيل، وتحديد المنافذ المفتوحة والثغرات عبر سكربتات NSE القوية.",
            url: "https://nmap.org/",
            badge: "Network Scanner & Discovery",
            tags: ["Network", "Port Scanner", "NSE", "Discovery"]
        },
        {
            id: "tool-net-02",
            category: "network",
            categoryName: "اختبار اختراق الشبكات",
            name: "Masscan",
            description: "أسرع ماسح لمنافذ الشبكة والإنترنت في العالم، قادر على مسح كامل فضاء عناوين IPv4 خلال أقل من 5 دقائق باستخدام بنية نقل حزم غير متزامنة.",
            url: "https://github.com/robertdavidgraham/masscan",
            badge: "Ultra-Fast Scanner",
            tags: ["High Speed", "Port Scan", "Internet Scale"]
        },
        {
            id: "tool-net-03",
            category: "network",
            categoryName: "اختبار اختراق الشبكات",
            name: "Netcat (nc)",
            description: "تُعرف بـ 'سكين الجيش السويسري' للشبكات، أداة متعددة الاستخدامات لقراءة وكتابة البيانات عبر اتصالات TCP و UDP، وإنشاء Reverse Shells ونقل الملفات واختبار المنافذ.",
            url: "https://nc110.sourceforge.io/",
            badge: "Swiss Army Knife",
            tags: ["TCP/UDP", "Reverse Shell", "Piping", "Networking"]
        },
        {
            id: "tool-net-04",
            category: "network",
            categoryName: "اختبار اختراق الشبكات",
            name: "Metasploit Framework",
            description: "إطار العمل الأكثر شهرة عالمياً لتطوير واختبار واستغلال الثغرات الأمنية (Exploits)، يضم آلاف الحمولات الخبيثة (Payloads) ووحدات ما بعد الاستغلال المتقدمة.",
            url: "https://www.metasploit.com/",
            badge: "Exploitation Framework",
            tags: ["Exploits", "Payloads", "Post-Exploitation", "Meterpreter"]
        },
        {
            id: "tool-net-05",
            category: "network",
            categoryName: "اختبار اختراق الشبكات",
            name: "Wireshark",
            description: "أقوى محلل لبروتوكولات وحزم الشبكة (Packet Analyzer) في العالم، يتيح فحص حركة مرور البيانات الحية بدقة متناهية وفك تشفير البروتوكولات وتحليل الحوادث الشبكية.",
            url: "https://www.wireshark.org/",
            badge: "Packet Analyzer & Sniffer",
            tags: ["Packet Analysis", "Sniffing", "Protocols", "Forensics"]
        },

        // ==================== 3. أدوات الـ OSINT ====================
        {
            id: "tool-osint-01",
            category: "osint",
            categoryName: "جمع المعلومات الاستخباراتية (OSINT)",
            name: "Maltego",
            description: "أداة رائدة في التحقيق البصري ورسم العلاقات الاستخباراتية، تجمع وتربط بين النطاقات وعناوين الـ IP والحسابات والأشخاص والمؤسسات في مخططات بيانية تفاعلية.",
            url: "https://www.maltego.com/",
            badge: "Visual Intelligence & Link Analysis",
            tags: ["OSINT", "Link Analysis", "Data Mining", "Threat Intel"]
        },
        {
            id: "tool-osint-02",
            category: "osint",
            categoryName: "جمع المعلومات الاستخباراتية (OSINT)",
            name: "Sherlock",
            description: "أداة مفتوحة المصدر عالية الكفاءة للبحث عن اسم المستخدم والتحقق من وجود الحسابات المستعارة عبر مئات شبكات التواصل الاجتماعي والمنصات الرقمية بلمح البصر.",
            url: "https://sherlock-project.github.io/",
            badge: "Social Media Account Finder",
            tags: ["User Search", "Social Media", "OSINT", "Python"]
        },
        {
            id: "tool-osint-03",
            category: "osint",
            categoryName: "جمع المعلومات الاستخباراتية (OSINT)",
            name: "ExifTool",
            description: "أداة برمجية احترافية لقراءة وكتابة وتعديل بيانات الميتا داتا (Metadata) المخفية في مختلف أنواع الملفات والصور والمستندات (مثل الموقع الجغرافي ونوع الكاميرا وتاريخ الإنشاء).",
            url: "https://exiftool.org/",
            badge: "Metadata Reader & Editor",
            tags: ["Metadata", "Exif", "Digital Forensics", "Files"]
        },
        {
            id: "tool-osint-04",
            category: "osint",
            categoryName: "جمع المعلومات الاستخباراتية (OSINT)",
            name: "SpiderFoot",
            description: "أداة استخبارات آلية متطورة لأتمتة جمع المعلومات والتحقيق في عناوين IP وأسماء النطاقات وعناوين البريد وأرقام الهواتف من أكثر من 100 مصدر خارجي.",
            url: "https://www.spiderfoot.net/",
            badge: "Automated OSINT Recon",
            tags: ["Reconnaissance", "Automation", "Threat Intel", "OSINT"]
        },

        // ==================== 4. اختبار اختراق الـ WiFi / اللاسلكي ====================
        {
            id: "tool-wifi-01",
            category: "wireless",
            categoryName: "اختبار اختراق الشبكات اللاسلكية (WiFi)",
            name: "Aircrack-ng",
            description: "المجموعة القياسية الأشهر عالمياً لتقييم أمان شبكات الواي فاي، تتضمن أدوات لالتقاط الحزم واعتراض البث وشن هجمات Replay وكسر تشفير شبكات WEP و WPA/WPA2-PSK.",
            url: "https://www.aircrack-ng.org/",
            badge: "WiFi Suite & Cracker",
            tags: ["WiFi", "WPA/WPA2", "Airmon", "Packet Capture"]
        },
        {
            id: "tool-wifi-02",
            category: "wireless",
            categoryName: "اختبار اختراق الشبكات اللاسلكية (WiFi)",
            name: "Wifite",
            description: "أداة برمجية آلية مصممة لأتمتة الهجمات على شبكات الواي فاي المشفرة بـ WEP و WPA/WPA2 و WPS بنقرة واحدة ودون الحاجة لتنفيذ أوامر متعددة يدوياً.",
            url: "https://github.com/derv82/wifite2",
            badge: "Automated Wireless Auditor",
            tags: ["Automated", "WiFi Auditing", "WPS", "WPA2"]
        },
        {
            id: "tool-wifi-03",
            category: "wireless",
            categoryName: "اختبار اختراق الشبكات اللاسلكية (WiFi)",
            name: "Reaver",
            description: "أداة متخصصة في شن هجمات التخمين (Brute-Force) ضد بروتوكول الإعداد المحمي للواي فاي (WPS)، لاستعادة مفتاح WPA/WPA2 الحقيقي في ساعات معدودة.",
            url: "https://github.com/t6x/reaver-wps-fork-t6x",
            badge: "WPS Brute-Force",
            tags: ["WPS", "Brute Force", "PIN Attack", "WiFi"]
        },
        {
            id: "tool-wifi-04",
            category: "wireless",
            categoryName: "اختبار اختراق الشبكات اللاسلكية (WiFi)",
            name: "Kismet",
            description: "كاشف لاسلكي ومحلل لحزم الشبكات اللاسلكية ونظام كشف تسلل (WIDS) يدعم شبكات WiFi و Bluetooth وموجات راديو SDR وتحديد المواقع الجغرافية لنقاط الوصول.",
            url: "https://www.kismetwireless.net/",
            badge: "Wireless Detector & IDS",
            tags: ["WIDS", "Sniffer", "Bluetooth", "Wardriving"]
        },

        // ==================== 5. كسر وتخمين كلمات المرور ====================
        {
            id: "tool-pass-01",
            category: "passwords",
            categoryName: "كسر وتخمين كلمات المرور (Password Attacks)",
            name: "Hydra",
            description: "أسرع وأقوى أداة لتنفيذ هجمات التخمين المباشرة (Online Password Cracking) تدعم أكثر من 50 بروتوكولاً مختلفاً مثل SSH, FTP, HTTP, Telnet, SMB, MySQL.",
            url: "https://github.com/vanhauser-thc/thc-hydra",
            badge: "Online Network Logon Cracker",
            tags: ["Hydra", "Brute Force", "Dictionary Attack", "Protocols"]
        },
        {
            id: "tool-pass-02",
            category: "passwords",
            categoryName: "كسر وتخمين كلمات المرور (Password Attacks)",
            name: "John the Ripper",
            description: "أداة كسر كلمات المرور الأسطورية مفتوحة المصدر، مصممة لاكتشاف كلمات السر الضعيفة وكسر مئات صيغ التشفير والهاشات وأنظمة التحقق المختلفة.",
            url: "https://www.openwall.com/john/",
            badge: "Offline Password Cracker",
            tags: ["Hashes", "Wordlists", "Cracking", "Open Source"]
        },
        {
            id: "tool-pass-03",
            category: "passwords",
            categoryName: "كسر وتخمين كلمات المرور (Password Attacks)",
            name: "Hashcat",
            description: "أسرع محرك لكسر الهاشات المشفرة في العالم، يستفيد من قوة المعالجة الهائلة لكروت الشاشة (GPU Acceleration) ويكسر مليارات التخمينات في الثانية.",
            url: "https://hashcat.net/hashcat/",
            badge: "GPU-Accelerated Cracker",
            tags: ["GPU", "Hash Cracking", "World's Fastest", "MD5/SHA"]
        },
        {
            id: "tool-pass-04",
            category: "passwords",
            categoryName: "كسر وتخمين كلمات المرور (Password Attacks)",
            name: "Crunch",
            description: "أداة مخصصة لتوليد قواميس وقوائم كلمات المرور (Wordlists) المخصصة بناءً على محددات معينة من الأحرف والأرقام والرموز وتحديد طول كلمة المرور بدقة.",
            url: "https://sourceforge.net/projects/crunch-wordlist/",
            badge: "Custom Wordlist Generator",
            tags: ["Wordlist", "Dictionary", "Generator", "Custom Patterns"]
        }
    ]
};
