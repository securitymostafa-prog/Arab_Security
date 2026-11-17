/**
 * ==============================================================================
 * ملَف إعدادات وبيانات تسجيل الدخول للوحة تحكم الأدمن (ArabSecurity Admin Config)
 * ==============================================================================
 * هذا الملف مخصص لحفظ بيانات الدخول الافتراضية للوحة تحكم الأدمن.
 * يمكنك تغيير اسم المستخدم وكلمة المرور من هنا مباشرة،
 * أو تغييرها بسهولة من داخل لوحة التحكم (صفحة الإعدادات والحماية).
 *
 * مكان الملف: js/admin-config.js
 * السطور: 14 و 15
 * ==============================================================================
 */

const ADMIN_CONFIG = {
    // اسم المستخدم لتسجيل الدخول للوحة الأدمن
    username: "sasa",

    // كلمة المرور لتسجيل الدخول للوحة الأدمن
    password: "01100711646",

    // المسار المخصص للوحة التحكم
    adminRoute: "/admin",
    
    // سنة البوابة الافتراضية
    defaultYear: "2027",

    // اسم المصمم والمطور الافتراضي
    designerName: "Mostafa Ahmed",

    // رسالة الترحيب في لوحة الأدمن
    welcomeMessage: "مرحباً بك في لوحة تحكم منصة ArabSecurity"
};

// التحقق الشامل من بيانات تسجيل الدخول (يعمل في الكود وفي الموقع معاً بالتوازي)
function validateAdminCredentials(inputUser, inputPass) {
    const user = (inputUser || '').trim();
    const pass = (inputPass || '').trim();

    // 1. التحقق من بيانات الكود في ملف admin-config.js
    const codeUser = ADMIN_CONFIG.username.trim();
    const codePass = ADMIN_CONFIG.password.trim();
    if (user === codeUser && pass === codePass) {
        return true;
    }

    // 2. التحقق من البيانات المعدلة من داخل الموقع إن وجدت
    const customCreds = localStorage.getItem('arabsecurity_admin_creds');
    if (customCreds) {
        try {
            const parsed = JSON.parse(customCreds);
            if (parsed.username && parsed.password) {
                if (user === parsed.username.trim() && pass === parsed.password.trim()) {
                    return true;
                }
            }
        } catch (e) {
            console.error("Error checking credentials", e);
        }
    }

    return false;
}

// جلب بيانات الدخول النشطة للكود والموقع
function getActiveAdminCredentials() {
    const codeUser = ADMIN_CONFIG.username.trim();
    const codePass = ADMIN_CONFIG.password.trim();

    const customCreds = localStorage.getItem('arabsecurity_admin_creds');
    let webUser = codeUser;
    let webPass = codePass;

    if (customCreds) {
        try {
            const parsed = JSON.parse(customCreds);
            if (parsed.username) webUser = parsed.username.trim();
            if (parsed.password) webPass = parsed.password.trim();
        } catch (e) {
            console.error("Error parsing saved admin credentials", e);
        }
    }

    return {
        username: webUser,
        password: webPass,
        codeUsername: codeUser,
        codePassword: codePass,
        webUsername: webUser,
        webPassword: webPass
    };
}

// حفظ بيانات دخول جديدة من لوحة الأدمن
function saveAdminCredentials(newUsername, newPassword) {
    const creds = {
        username: newUsername.trim(),
        password: newPassword.trim(),
        updatedAt: new Date().toISOString(),
        source: 'web'
    };
    localStorage.setItem('arabsecurity_admin_creds', JSON.stringify(creds));
    return true;
}
