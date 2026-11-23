/**
 * ==============================================================================
 * ملَف إعدادات وبيانات تسجيل الدخول للوحة تحكم الأدمن (ArabSecurity Admin Config)
 * ==============================================================================
 * يمكنك تعديل اسم المستخدم وكلمة المرور من هنا في الكود مباشرة،
 * أو تعديلها من داخل لوحة التحكم بالموقع، وكلاهما يعمل فورياً في نفس الوقت!
 *
 * مكان الملف: js/admin-config.js
 * ==============================================================================
 */

const ADMIN_CONFIG = {
    // اسم المستخدم لتسجيل الدخول للوحة الأدمن (يمكنك تغييره هنا في أي وقت)
    username: "mostafa",

    // كلمة المرور لتسجيل الدخول للوحة الأدمن (يمكنك تغييرها هنا في أي وقت)
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

// جلب بيانات الدخول النشطة (مع التحقق التلقائي والفوري من أي تغيير في الكود أو الموقع)
function getActiveAdminCredentials() {
    const codeUser = (ADMIN_CONFIG.username || '').trim();
    const codePass = (ADMIN_CONFIG.password || '').trim();
    const currentCodeHash = `${codeUser}:::${codePass}`;

    // قراءة آخر بصمة للكود كانت مسجلة في المتصفح
    const lastCodeHash = localStorage.getItem('arabsec_last_code_hash');

    // إذا تم تعديل الكود في ملف admin-config.js:
    // يتم فوراً وبشكل تلقائي اعتماد الكود ومسح أي تعديل قديم ليكون الكود هو صاحب الأولوية!
    if (lastCodeHash !== currentCodeHash) {
        localStorage.setItem('arabsec_last_code_hash', currentCodeHash);
        localStorage.removeItem('arabsecurity_admin_creds'); // مسح التعديل القديم ليصبح الكود هو النشط فوراً
        return {
            username: codeUser,
            password: codePass,
            source: 'الكود (admin-config.js)'
        };
    }

    // إذا لم يتغير الكود، نتحقق إن كان المستخدم قد غيّرها من لوحة التحكم في الموقع
    const customCreds = localStorage.getItem('arabsecurity_admin_creds');
    if (customCreds) {
        try {
            const parsed = JSON.parse(customCreds);
            if (parsed.username && parsed.password) {
                return {
                    username: parsed.username.trim(),
                    password: parsed.password.trim(),
                    source: 'لوحة التحكم بالموقع'
                };
            }
        } catch (e) {
            console.error("Error parsing saved credentials", e);
        }
    }

    return {
        username: codeUser,
        password: codePass,
        source: 'الكود (admin-config.js)'
    };
}

// التحقق من صحة بيانات الدخول (يقبل ما هو موجود في الكود وما تم تغييره في الموقع)
function validateAdminCredentials(inputUser, inputPass) {
    const user = (inputUser || '').trim();
    const pass = (inputPass || '').trim();

    const active = getActiveAdminCredentials();
    const codeUser = (ADMIN_CONFIG.username || '').trim();
    const codePass = (ADMIN_CONFIG.password || '').trim();

    // 1. التحقق من البيانات النشطة الحالية
    if (user === active.username && pass === active.password) {
        return true;
    }

    // 2. التحقق من بيانات الكود المباشرة دائماً كأمان إضافي
    if (user === codeUser && pass === codePass) {
        return true;
    }

    // 3. التحقق من بيانات الموقع إن وجدت
    const customCreds = localStorage.getItem('arabsecurity_admin_creds');
    if (customCreds) {
        try {
            const parsed = JSON.parse(customCreds);
            if (user === parsed.username.trim() && pass === parsed.password.trim()) {
                return true;
            }
        } catch (e) {}
    }

    return false;
}

// حفظ بيانات دخول جديدة عند التغيير من لوحة الأدمن بالموقع
function saveAdminCredentials(newUsername, newPassword) {
    const codeUser = (ADMIN_CONFIG.username || '').trim();
    const codePass = (ADMIN_CONFIG.password || '').trim();
    const currentCodeHash = `${codeUser}:::${codePass}`;

    // نسجل بصمة الكود الحالي لكي نضمن عدم تعارضها مع تعديل الموقع
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
