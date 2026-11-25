/**
 * ==============================================================================
 * مدير البيانات والمزامنة الشامل لمنصة ArabSecurity (Site Data Manager)
 * ==============================================================================
 * يقوم هذا الملف بمزامنة البيانات بين لوحة الأدمن وكافة صفحات الموقع.
 * عند تعديل أو إضافة أي كورس أو أداة أو تغيير الألوان والخلفيات من لوحة الأدمن،
 * تنعكس التعديلات فوراً وبشكل تلقائي على كافة صفحات المنصة.
 * ==============================================================================
 */

const STORAGE_KEY = 'arabsecurity_master_database';

// حساب بصمة رقمية لمحتوى الكود في DEFAULT_SITE_DATA للتحقق الفوري من أي تعديل
function computeDataHash(data) {
    if (!data) return '';
    try {
        const payload = JSON.stringify({
            c: (data.courses || []).map(x => (x.id || '') + (x.title || '') + (x.url || '')),
            t: (data.tools || []).map(x => (x.id || '') + (x.name || '') + (x.url || '')),
            s: data.settings || {},
            u: data.lastUpdated || '',
            v: data.version || ''
        });
        let hash = 0;
        for (let i = 0; i < payload.length; i++) {
            hash = ((hash << 5) - hash) + payload.charCodeAt(i);
            hash |= 0;
        }
        return String(hash);
    } catch (e) {
        return '';
    }
}

// جلب البيانات الكاملة من المتصفح أو تهيئتها من قاعدة البيانات الافتراضية
function getSiteData() {
    const defData = (typeof DEFAULT_SITE_DATA !== 'undefined') ? DEFAULT_SITE_DATA : null;
    const currentCodeHash = computeDataHash(defData);
    const lastCodeHash = localStorage.getItem('arabsec_last_data_hash');

    // 1. إذا تم تعديل الكود في ملف default-data.js (في VS Code أو برفع ملف جديد للموقع):
    // يتم فوراً وبشكل تلقائي اعتماد الكود ومسح أي تخزين قديم ليكون الكود هو صاحب الأولوية المطلقة!
    if (defData && currentCodeHash && lastCodeHash !== currentCodeHash) {
        console.log("🔄 تم رصد كود جديد في default-data.js! اعتماد الكود الأساسي فوراً لجميع الزوار...");
        localStorage.setItem('arabsec_last_data_hash', currentCodeHash);
        
        const freshData = JSON.parse(JSON.stringify(defData));
        // الحفاظ على إحصائيات الزيارات الحية إن وجدت
        const oldRaw = localStorage.getItem(STORAGE_KEY);
        if (oldRaw) {
            try {
                const old = JSON.parse(oldRaw);
                if (old.statistics) freshData.statistics = old.statistics;
            } catch (e) {}
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
        return freshData;
    }

    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
        // تهيئة البيانات للمرة الأولى
        const initialData = JSON.parse(JSON.stringify(defData || {}));
        if (currentCodeHash) localStorage.setItem('arabsec_last_data_hash', currentCodeHash);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
    }

    try {
        const parsed = JSON.parse(rawData);

        // حماية فائقة: التحقق من وجود الكورسات والأدوات وأنها ليست مصفوفات فارغة
        const hasValidCourses = parsed.courses && Array.isArray(parsed.courses) && parsed.courses.length > 0;
        const hasValidTools = parsed.tools && Array.isArray(parsed.tools) && parsed.tools.length > 0;
        const hasValidSettings = parsed.settings && typeof parsed.settings === 'object';

        if (!hasValidCourses || !hasValidTools || !hasValidSettings) {
            const merged = Object.assign({}, defData || {}, parsed);
            if (!hasValidCourses && defData) merged.courses = JSON.parse(JSON.stringify(defData.courses));
            if (!hasValidTools && defData) merged.tools = JSON.parse(JSON.stringify(defData.tools));
            if (!hasValidSettings && defData) merged.settings = JSON.parse(JSON.stringify(defData.settings));
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
        }
        return parsed;
    } catch (e) {
        console.error("Error reading site data from localStorage", e);
        return defData || {};
    }
}

// حفظ البيانات في المتصفح ومزامنتها سحابياً مع Firebase
function saveSiteData(data) {
    try {
        // تسجيل وقت الحفظ لضمان تحديث متصفحات الزوار فور النشر
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // إشعار باقي التبويبات المفتوحة في المتصفح بالتحديث
        window.dispatchEvent(new Event('siteDataUpdated'));

        // الرفع السحابي الفوري إلى Firebase إذا كان الربط مفعلاً
        if (typeof isFirebaseEnabled === 'function' && isFirebaseEnabled()) {
            const db = initFirebase();
            if (db) {
                db.collection("arabsecurity").doc("master_data").set(data)
                    .then(() => {
                        console.log("☁️ تم إرسال وتحديث البيانات في سحابة Firebase بنجاح!");
                    })
                    .catch(err => {
                        console.error("خطأ أثناء الحفظ في Firebase:", err);
                    });
            }
        }
        return true;
    } catch (e) {
        console.error("Error saving site data", e);
        return false;
    }
}

// الاستماع المباشر للتحديثات السحابية من Firebase (Real-time Cloud Sync)
function syncWithCloudDatabase() {
    if (typeof isFirebaseEnabled !== 'function' || !isFirebaseEnabled()) return;

    try {
        const db = initFirebase();
        if (!db) return;

        db.collection("arabsecurity").doc("master_data")
            .onSnapshot(doc => {
                if (doc.exists) {
                    const cloudData = doc.data();
                    if (cloudData && cloudData.courses && cloudData.tools) {
                        console.log("☁️ تم استلام تحديث جديد من سحابة Firebase وتطبيقه على الصفحة!");
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
                        applyThemeCustomizations();
                        if (typeof initDynamicPagesContent === 'function') {
                            initDynamicPagesContent();
                        }
                        window.dispatchEvent(new Event('siteDataUpdated'));
                    }
                }
            }, err => {
                console.warn("ملاحظة مزامنة Firebase:", err.message);
            });
    } catch (e) {
        console.warn("Could not sync with Firebase:", e);
    }
}

// تسجيل زيارة وتحديث الإحصائيات (تظهر فقط في لوحة تحكم الأدمن)
function recordPageVisit(pageName) {
    try {
        const data = getSiteData();
        if (!data.statistics) {
            data.statistics = Object.assign({}, DEFAULT_SITE_DATA.statistics);
        }

        // زيادة إجمالي الزيارات
        data.statistics.totalViews = (data.statistics.totalViews || 0) + 1;

        // التحقق من الزائر الفريد عبر Session
        if (!sessionStorage.getItem('arabsec_visited_session')) {
            sessionStorage.setItem('arabsec_visited_session', 'true');
            data.statistics.uniqueVisitors = (data.statistics.uniqueVisitors || 0) + 1;
        }

        // زيادة عداد اليوم
        const todayStr = new Date().toDateString();
        const lastDayRecorded = localStorage.getItem('arabsec_last_visit_day');
        if (lastDayRecorded !== todayStr) {
            localStorage.setItem('arabsec_last_visit_day', todayStr);
            data.statistics.todayViews = 1;
        } else {
            data.statistics.todayViews = (data.statistics.todayViews || 0) + 1;
        }

        // تحديث إحصائيات الأقسام المحددة
        if (pageName === 'red-team') {
            data.statistics.redTeamViews = (data.statistics.redTeamViews || 0) + 1;
        } else if (pageName === 'blue-team') {
            data.statistics.blueTeamViews = (data.statistics.blueTeamViews || 0) + 1;
        } else if (pageName === 'basics') {
            data.statistics.basicsViews = (data.statistics.basicsViews || 0) + 1;
        } else if (pageName === 'tools') {
            data.statistics.toolsViews = (data.statistics.toolsViews || 0) + 1;
        }

        data.statistics.lastUpdated = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        saveSiteData(data);
    } catch (err) {
        console.warn("Could not record page visit", err);
    }
}

// تطبيق تخصيصات المظهر والألوان والخلفية على الصفحة الحالية
function applyThemeCustomizations() {
    const data = getSiteData();
    const settings = data.settings || DEFAULT_SITE_DATA.settings;

    const root = document.documentElement;
    if (settings.primaryColor) {
        root.style.setProperty('--primary-purple', settings.primaryColor);
        root.style.setProperty('--glow-purple', settings.primaryColor + '40');
    }
    if (settings.secondaryColor) {
        root.style.setProperty('--secondary-purple', settings.secondaryColor);
    }
    if (settings.accentColor) {
        root.style.setProperty('--accent-violet', settings.accentColor);
    }
    if (settings.bgColor) {
        root.style.setProperty('--bg-dark', settings.bgColor);
    }

    // تحديث نصوص المصمم والسنة إن وجدت عناصرها
    const yearElements = document.querySelectorAll('.dynamic-year-text');
    yearElements.forEach(el => {
        el.textContent = settings.heroHeadline || "بوابة التميز السيبراني العربية 2027";
    });

    const designerElements = document.querySelectorAll('.dynamic-designer-name');
    designerElements.forEach(el => {
        el.textContent = settings.designerName || "Mostafa Ahmed";
    });

    // تحديث الخلفية إذا كانت مخصصة
    const bgContainer = document.querySelector('.site-dynamic-bg');
    if (bgContainer) {
        if (settings.bgType === 'custom' && settings.customBgUrl) {
            bgContainer.style.backgroundImage = `radial-gradient(ellipse at center, rgba(14, 8, 26, 0.72) 0%, rgba(8, 4, 15, 0.88) 60%, rgba(5, 2, 10, 0.98) 100%), linear-gradient(180deg, rgba(7, 4, 13, 0.82) 0%, rgba(20, 10, 38, 0.65) 45%, rgba(6, 3, 11, 0.95) 100%), url('${settings.customBgUrl}')`;
            bgContainer.style.backgroundSize = 'cover';
            bgContainer.style.backgroundPosition = 'center';
        } else {
            bgContainer.style.backgroundImage = '';
        }
    }
}

// تنفيذ التهيئة التلقائية للمظهر وتسجيل الزيارة عند اكتمال تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    applyThemeCustomizations();
    syncWithCloudDatabase();
    
    // تحديد الصفحة الحالية لتسجيل الإحصائية
    const path = window.location.pathname.toLowerCase();
    let currentSection = 'home';
    if (path.includes('red-team')) currentSection = 'red-team';
    else if (path.includes('blue-team')) currentSection = 'blue-team';
    else if (path.includes('basics')) currentSection = 'basics';
    else if (path.includes('tools')) currentSection = 'tools';
    else if (path.includes('teams')) currentSection = 'teams';
    else if (path.includes('about')) currentSection = 'about';
    else if (path.includes('support')) currentSection = 'support';
    
    // لا نحسب صفحات تسجيل دخول الأدمن كزيارة عامة إن أردنا، ولكن نحسب الصفحات التفاعلية
    if (!path.includes('admin')) {
        recordPageVisit(currentSection);
    }
});

/* ==================== دوال توليد وتصدير ملفات الكود الأساسية ==================== */
function generateDefaultDataJsContent(siteData) {
    const dataToExport = JSON.parse(JSON.stringify(siteData || getSiteData()));
    dataToExport.lastUpdated = new Date().toISOString();
    return `/**
 * ==============================================================================
 * قاعدة البيانات الرسمية والأساسية لمنصة ArabSecurity (Default Database)
 * ==============================================================================
 * تم التحديث من لوحة الأدمن بتاريخ: ${new Date().toLocaleString('ar-EG')}
 * يحتوي هذا الملف على الكورسات والأدوات والإعدادات الرسمية التي يقرأها الموقع المنشور.
 * ==============================================================================
 */

const DEFAULT_SITE_DATA = ${JSON.stringify(dataToExport, null, 4)};
`;
}

function generateAdminConfigJsContent(username, password) {
    const user = username || (typeof getActiveAdminCredentials === 'function' ? getActiveAdminCredentials().username : 'mostafa');
    const pass = password || (typeof getActiveAdminCredentials === 'function' ? getActiveAdminCredentials().password : '01100711646');
    
    return `/**
 * ==============================================================================
 * ملف إعدادات وبيانات تسجيل الدخول للوحة تحكم الأدمن (ArabSecurity Admin Config)
 * ==============================================================================
 * تم التحديث من لوحة الأدمن بتاريخ: ${new Date().toLocaleString('ar-EG')}
 * ==============================================================================
 */

const ADMIN_CONFIG = {
    username: ${JSON.stringify(user)},
    password: ${JSON.stringify(pass)},
    adminRoute: "/admin",
    defaultYear: "2027",
    designerName: "Mostafa Ahmed",
    welcomeMessage: "مرحباً بك في لوحة تحكم منصة ArabSecurity"
};

function getActiveAdminCredentials() {
    const codeUser = (ADMIN_CONFIG.username || '').trim();
    const codePass = (ADMIN_CONFIG.password || '').trim();
    const currentCodeHash = \`\${codeUser}:::\${codePass}\`;
    const lastCodeHash = localStorage.getItem('arabsec_last_code_hash');

    if (lastCodeHash !== currentCodeHash) {
        localStorage.setItem('arabsec_last_code_hash', currentCodeHash);
        localStorage.removeItem('arabsecurity_admin_creds');
        return { username: codeUser, password: codePass, source: 'الكود (admin-config.js)' };
    }

    const customCreds = localStorage.getItem('arabsecurity_admin_creds');
    if (customCreds) {
        try {
            const parsed = JSON.parse(customCreds);
            if (parsed.username && parsed.password) {
                return { username: parsed.username.trim(), password: parsed.password.trim(), source: 'لوحة التحكم بالموقع' };
            }
        } catch (e) {}
    }

    return { username: codeUser, password: codePass, source: 'الكود (admin-config.js)' };
}

function validateAdminCredentials(inputUser, inputPass) {
    const user = (inputUser || '').trim();
    const pass = (inputPass || '').trim();
    const active = getActiveAdminCredentials();
    const codeUser = (ADMIN_CONFIG.username || '').trim();
    const codePass = (ADMIN_CONFIG.password || '').trim();

    if (user === active.username && pass === active.password) return true;
    if (user === codeUser && pass === codePass) return true;

    const customCreds = localStorage.getItem('arabsecurity_admin_creds');
    if (customCreds) {
        try {
            const parsed = JSON.parse(customCreds);
            if (user === parsed.username.trim() && pass === parsed.password.trim()) return true;
        } catch (e) {}
    }
    return false;
}

function saveAdminCredentials(newUsername, newPassword) {
    const codeUser = (ADMIN_CONFIG.username || '').trim();
    const codePass = (ADMIN_CONFIG.password || '').trim();
    const currentCodeHash = \`\${codeUser}:::\${codePass}\`;
    localStorage.setItem('arabsec_last_code_hash', currentCodeHash);

    const creds = {
        username: newUsername.trim(),
        password: newPassword.trim(),
        updatedAt: new Date().toISOString(),
        source: 'لوحة التحكم بالموقع'
    };
    localStorage.setItem('arabsecurity_admin_creds', JSON.stringify(creds));
    return true;
}
`;
}

// دالة تحميل ملف إلى جهاز المستخدم بضغطة زر واحدة
function triggerFileDownload(filename, textContent) {
    const blob = new Blob([textContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 150);
}

