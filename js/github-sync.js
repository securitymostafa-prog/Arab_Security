/**
 * ==============================================================================
 * مزامنة ونشر التعديلات تلقائياً على GitHub Pages (GitHub API Auto-Publisher)
 * ==============================================================================
 * يتيح لك هذا الملف تعديل أي كورس أو أداة أو كلمة سر من داخل لوحة الأدمن،
 * والضغط على زر "نشر التعديلات على GitHub"، ليتم تحديث ملفات الموقع في
 * مستودع GitHub فوراً، وتظهر التعديلات لكافة الزوار أونلاين خلال 30 ثانية!
 * ==============================================================================
 */

const GITHUB_STORAGE_KEY = 'arabsecurity_github_config';

function getGitHubConfig() {
    const raw = localStorage.getItem(GITHUB_STORAGE_KEY);
    if (!raw) return { owner: '', repo: '', token: '', branch: 'main' };
    try {
        const parsed = JSON.parse(raw);
        return {
            owner: (parsed.owner || '').trim(),
            repo: (parsed.repo || '').trim(),
            token: (parsed.token || '').trim(),
            branch: (parsed.branch || 'main').trim()
        };
    } catch (e) {
        return { owner: '', repo: '', token: '', branch: 'main' };
    }
}

function saveGitHubConfig(owner, repo, token, branch = 'main') {
    const config = {
        owner: owner.trim(),
        repo: repo.trim(),
        token: token.trim(),
        branch: (branch || 'main').trim()
    };
    localStorage.setItem(GITHUB_STORAGE_KEY, JSON.stringify(config));
    return config;
}

function isGitHubConfigured() {
    const cfg = getGitHubConfig();
    return Boolean(cfg.owner && cfg.repo && cfg.token);
}

// تشفير آمن 100% للنصوص العربية والإنجليزية إلى Base64 بدون أي أخطاء
function utf8ToBase64(str) {
    try {
        const bytes = new TextEncoder().encode(str);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    } catch (e) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }
}

// اختبار الاتصال بمستودع GitHub
async function testGitHubConnection() {
    const cfg = getGitHubConfig();
    if (!cfg.owner || !cfg.repo || !cfg.token) {
        throw new Error("يرجى إدخال اسم المستخدم واسم المستودع ورمز الوصول (Token).");
    }

    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${cfg.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let msg = errorData.message || `تعذر الاتصال بـ GitHub (كود الخطأ ${response.status})`;
        if (response.status === 401) msg = "رمز الوصول الشخصي (Token) غير صالح أو منتهي الصلاحية.";
        if (response.status === 404) msg = `لم يتم العثور على المستودع ${cfg.owner}/${cfg.repo}، تأكد من صحة الأسماء والصلاحيات.`;
        throw new Error(msg);
    }

    const repoData = await response.json();
    return repoData;
}

// دالة مساعدة لتحديث أو إنشاء ملف في GitHub
async function commitFileToGitHub(filePath, fileContent, commitMessage) {
    const cfg = getGitHubConfig();
    if (!cfg.owner || !cfg.repo || !cfg.token) {
        throw new Error("يرجى ضبط بيانات الاتصال بـ GitHub في لوحة الأدمن أولاً.");
    }

    const apiUrl = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}?ref=${cfg.branch || 'main'}`;

    // 1. جلب SHA الحالي للملف إن وجد
    let currentSha = null;
    try {
        const getFileResp = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${cfg.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (getFileResp.ok) {
            const fileInfo = await getFileResp.json();
            currentSha = fileInfo.sha;
        }
    } catch (e) {
        console.warn(`Could not fetch existing SHA for ${filePath}:`, e);
    }

    // 2. إعداد الحزمة للرفع
    const payload = {
        message: commitMessage || `Update ${filePath} from Admin Panel`,
        content: utf8ToBase64(fileContent),
        branch: cfg.branch || 'main'
    };

    if (currentSha) {
        payload.sha = currentSha;
    }

    // 3. إرسال أمر الـ Commit والحفظ
    const putResp = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${cfg.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(payload)
    });

    if (!putResp.ok) {
        const errJson = await putResp.json().catch(() => ({}));
        let errMsg = errJson.message || `خطأ أثناء الحفظ على GitHub (${putResp.status})`;
        if (putResp.status === 409) errMsg = "حدث تعارض أثناء الحفظ، يرجى المحاولة مرة ثانية.";
        throw new Error(errMsg);
    }

    return await putResp.json();
}

// نشر قاعدة البيانات (js/default-data.js) على GitHub Pages
async function publishToGitHubPages(siteData) {
    // تحديث توقيت آخر تعديل لضمان تجديد الكاش تلقائياً لدى جميع الزوار
    const dataToPublish = JSON.parse(JSON.stringify(siteData));
    dataToPublish.lastUpdated = new Date().toISOString();

    const fileContent = `/**
 * ==============================================================================
 * قاعدة البيانات المحدثة لمنصة ArabSecurity (تم النشر من لوحة تحكم الأدمن)
 * ==============================================================================
 * تم التحديث بتاريخ: ${new Date().toLocaleString('ar-EG')}
 * ==============================================================================
 */

const DEFAULT_SITE_DATA = ${JSON.stringify(dataToPublish, null, 4)};
`;

    const commitMsg = `تحديث بيانات المنصة والكورسات من لوحة الأدمن (${new Date().toLocaleTimeString('ar-EG')})`;
    return await commitFileToGitHub('js/default-data.js', fileContent, commitMsg);
}

// نشر بيانات دخول الأدمن (js/admin-config.js) على GitHub Pages
async function publishCredentialsToGitHub(username, password) {
    const fileContent = `/**
 * ==============================================================================
 * ملَف إعدادات وبيانات تسجيل الدخول للوحة تحكم الأدمن (ArabSecurity Admin Config)
 * ==============================================================================
 * تم التحديث من لوحة الأدمن بتاريخ: ${new Date().toLocaleString('ar-EG')}
 * ==============================================================================
 */

const ADMIN_CONFIG = {
    username: ${JSON.stringify(username)},
    password: ${JSON.stringify(password)},
    adminRoute: "/admin",
    defaultYear: "2027",
    designerName: "Mostafa Ahmed",
    welcomeMessage: "مرحباً بك في لوحة تحكم منصة ArabSecurity"
};

// جلب بيانات الدخول النشطة (مع التحقق التلقائي والفوري من أي تغيير في الكود أو الموقع)
function getActiveAdminCredentials() {
    const codeUser = (ADMIN_CONFIG.username || '').trim();
    const codePass = (ADMIN_CONFIG.password || '').trim();
    const currentCodeHash = \`\${codeUser}:::\${codePass}\`;

    const lastCodeHash = localStorage.getItem('arabsec_last_code_hash');

    if (lastCodeHash !== currentCodeHash) {
        localStorage.setItem('arabsec_last_code_hash', currentCodeHash);
        localStorage.removeItem('arabsecurity_admin_creds');
        return {
            username: codeUser,
            password: codePass,
            source: 'الكود (admin-config.js)'
        };
    }

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

// التحقق من صحة بيانات الدخول
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

// حفظ بيانات دخول جديدة عند التغيير من لوحة الأدمن بالموقع
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

    const commitMsg = `تحديث بيانات تسجيل دخول الأدمن من الموقع (${new Date().toLocaleTimeString('ar-EG')})`;
    return await commitFileToGitHub('js/admin-config.js', fileContent, commitMsg);
}

// نشر شامل لكافة البيانات وبيانات الدخول معاً
async function publishAllToGitHub(siteData, credentials = null) {
    const results = {};
    results.data = await publishToGitHubPages(siteData);

    const creds = credentials || (typeof getActiveAdminCredentials === 'function' ? getActiveAdminCredentials() : null);
    if (creds && creds.username && creds.password) {
        try {
            results.creds = await publishCredentialsToGitHub(creds.username, creds.password);
        } catch (err) {
            console.warn("Could not publish credentials file:", err);
        }
    }

    return results;
}
