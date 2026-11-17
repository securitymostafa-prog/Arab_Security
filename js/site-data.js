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

// جلب البيانات الكاملة من المتصفح أو تهيئتها من قاعدة البيانات الافتراضية
function getSiteData() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
        // تهيئة البيانات للمرة الأولى
        const initialData = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
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
            const merged = Object.assign({}, DEFAULT_SITE_DATA, parsed);
            if (!hasValidCourses) merged.courses = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.courses));
            if (!hasValidTools) merged.tools = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.tools));
            if (!hasValidSettings) merged.settings = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.settings));
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
        }
        return parsed;
    } catch (e) {
        console.error("Error reading site data from localStorage", e);
        return DEFAULT_SITE_DATA;
    }
}

// حفظ البيانات في المتصفح
function saveSiteData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // إشعار باقي التبويبات المفتوحة في المتصفح بالتحديث
        window.dispatchEvent(new Event('siteDataUpdated'));
        return true;
    } catch (e) {
        console.error("Error saving site data", e);
        return false;
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
