/**
 * ==============================================================================
 * إعدادات الربط السحابي مع Google Firebase (Cloud Database)
 * ==============================================================================
 * هذا الملف يربط الموقع بقاعدة بيانات جوجل المجانية (Firestore).
 * عند تفعيله، أي تعديل تقوم به في لوحة الأدمن يُحفظ في السحابة فوراً
 * ويظهر لجميع الزوار في العالم في نفس اللحظة بدون الحاجة لإعادة رفع أي ملفات!
 * ==============================================================================
 */

// إعدادات مشروع Firebase الخاص بك (يمكنك وضعها هنا أو حفظها من لوحة الأدمن)
let FIREBASE_CONFIG = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// قراءة الإعدادات إذا كان المستخدم قد حفظها من لوحة الأدمن
(function loadSavedFirebaseConfig() {
    const saved = localStorage.getItem('arabsecurity_firebase_config');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.projectId && parsed.apiKey) {
                FIREBASE_CONFIG = parsed;
            }
        } catch (e) {
            console.error("Error loading saved firebase config", e);
        }
    }
})();

let firebaseApp = null;
let firestoreDb = null;

// تهيئة الاتصال بـ Firebase
function initFirebase() {
    if (firestoreDb) return firestoreDb;

    // التحقق من وجود الإعدادات ومكتبة الفايربيس
    if (typeof firebase !== 'undefined' && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId) {
        try {
            if (!firebase.apps.length) {
                firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
            } else {
                firebaseApp = firebase.app();
            }
            firestoreDb = firebase.firestore();
            console.log("🟢 تم الاتصال بقاعدة بيانات Firebase السحابية بنجاح!");
            return firestoreDb;
        } catch (err) {
            console.warn("تعذر الاتصال بـ Firebase، سيتم العمل بالبيانات المحلية:", err);
            return null;
        }
    }
    return null;
}

// هل الربط السحابي مفعل وشغال؟
function isFirebaseEnabled() {
    return initFirebase() !== null;
}

// حفظ إعدادات Firebase من لوحة الأدمن
function saveFirebaseConfig(config) {
    localStorage.setItem('arabsecurity_firebase_config', JSON.stringify(config));
    FIREBASE_CONFIG = config;
    firestoreDb = null;
    return initFirebase() !== null;
}
