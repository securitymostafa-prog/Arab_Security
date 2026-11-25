/**
 * ==============================================================================
 * لوحة تحكم الأدمن الشاملة لمنصة ArabSecurity (Admin Dashboard Controller)
 * ==============================================================================
 * إدارة كاملة للكورسات، الأدوات، إحصائيات الزيارات الحية، المظهر، وكلمة المرور
 * ==============================================================================
 */

// التحقق من صحة تسجيل الدخول قبل تحميل اللوحة
(function checkAdminAuth() {
    const isAuth = sessionStorage.getItem('arabsec_admin_authenticated');
    if (!isAuth || isAuth !== 'true') {
        window.location.href = 'admin-login.html';
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    initAdminNavigation();
    initStatsView();
    initCoursesManagement();
    initToolsManagement();
    initThemeCustomizer();
    initGeneralSettings();
    initSecuritySettings();
    initBackupRestore();
    initCodeSyncTab();
    initGitHubTab();
    initCloudTab();
});

/* ==================== التنقل بين تبويبات لوحة التحكم ==================== */
function initAdminNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');
    const logoutBtn = document.getElementById('adminLogoutBtn');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            navItems.forEach(i => i.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const activePane = document.getElementById(targetTab);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("هل تريد تسجيل الخروج من لوحة التحكم؟")) {
                sessionStorage.removeItem('arabsec_admin_authenticated');
                window.location.href = 'admin-login.html';
            }
        });
    }
}

/* ==================== 1. إحصائيات وزيارات الموقع والعداد الحي ==================== */
function initStatsView() {
    const refreshBtn = document.getElementById('refreshStatsBtn');
    const resetBtn = document.getElementById('resetStatsBtn');

    function updateStatsDisplay() {
        const data = getSiteData();
        const stats = data.statistics || DEFAULT_SITE_DATA.statistics;

        const totalEl = document.getElementById('statTotalViews');
        const uniqueEl = document.getElementById('statUniqueVisitors');
        const todayEl = document.getElementById('statTodayViews');
        const redEl = document.getElementById('statRedViews');
        const blueEl = document.getElementById('statBlueViews');
        const basicsEl = document.getElementById('statBasicsViews');
        const toolsEl = document.getElementById('statToolsViews');
        const updatedEl = document.getElementById('statLastUpdated');

        if (totalEl) totalEl.textContent = Number(stats.totalViews || 0).toLocaleString('ar-EG');
        if (uniqueEl) uniqueEl.textContent = Number(stats.uniqueVisitors || 0).toLocaleString('ar-EG');
        if (todayEl) todayEl.textContent = Number(stats.todayViews || 0).toLocaleString('ar-EG');
        if (redEl) redEl.textContent = Number(stats.redTeamViews || 0).toLocaleString('ar-EG');
        if (blueEl) blueEl.textContent = Number(stats.blueTeamViews || 0).toLocaleString('ar-EG');
        if (basicsEl) basicsEl.textContent = Number(stats.basicsViews || 0).toLocaleString('ar-EG');
        if (toolsEl) toolsEl.textContent = Number(stats.toolsViews || 0).toLocaleString('ar-EG');
        if (updatedEl) updatedEl.textContent = stats.lastUpdated || new Date().toLocaleTimeString('ar-EG');
    }

    updateStatsDisplay();

    // زر التحديث وإعادة التشغيل (Refresh)
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.classList.add('rotating');
            updateStatsDisplay();
            setTimeout(() => {
                refreshBtn.classList.remove('rotating');
                showToast("تم تحديث وتنشيط عداد الزيارات بنجاح!");
            }, 600);
        });
    }

    // زر إعادة ضبط العداد
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("هل أنت متأكد من رغبتك في تصفير عداد الزيارات والإحصائيات؟")) {
                const data = getSiteData();
                data.statistics = {
                    totalViews: 0,
                    uniqueVisitors: 0,
                    todayViews: 0,
                    redTeamViews: 0,
                    blueTeamViews: 0,
                    basicsViews: 0,
                    toolsViews: 0,
                    lastUpdated: new Date().toLocaleTimeString('ar-EG')
                };
                saveSiteData(data);
                updateStatsDisplay();
                showToast("تم تصفير وإعادة ضبط عداد الزيارات بنجاح!");
            }
        });
    }
}

/* ==================== 2. إدارة الكورسات (CRUD) ==================== */
function initCoursesManagement() {
    const tableBody = document.getElementById('coursesTableBody');
    const trackFilter = document.getElementById('courseTrackFilter');
    const addBtn = document.getElementById('addNewCourseBtn');
    const modal = document.getElementById('courseModal');
    const form = document.getElementById('courseForm');
    const closeModalBtn = document.getElementById('closeCourseModalBtn');

    function renderCoursesTable(selectedTrack = 'all') {
        if (!tableBody) return;
        const data = getSiteData();
        const filtered = selectedTrack === 'all' 
            ? data.courses 
            : data.courses.filter(c => c.track === selectedTrack);

        tableBody.innerHTML = '';
        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">لا توجد كورسات مضافة في هذا المسار</td></tr>`;
            return;
        }

        filtered.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="color:#ffffff;">${c.abbreviation}</strong></td>
                <td>${c.title}</td>
                <td><span class="badge" style="background:rgba(139,92,246,0.2); padding:4px 8px; border-radius:6px;">${c.track}</span></td>
                <td>${c.instructor}</td>
                <td>
                    <a href="${c.url}" target="_blank" style="color:var(--neon-purple); font-size:0.85rem;">
                        <i class="fas fa-arrow-up-right-from-square"></i> الرابط
                    </a>
                </td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn btn-sm btn-edit" onclick="editCourse('${c.id}')"><i class="fas fa-edit"></i> تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCourse('${c.id}')"><i class="fas fa-trash"></i> حذف</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    renderCoursesTable();

    if (trackFilter) {
        trackFilter.addEventListener('change', (e) => {
            renderCoursesTable(e.target.value);
        });
    }

    if (addBtn && modal) {
        addBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('courseIdInput').value = '';
            document.getElementById('courseModalTitle').textContent = 'إضافة كورس جديد للمنصة';
            modal.classList.add('active');
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('courseIdInput').value || 'course-' + Date.now();
            const track = document.getElementById('courseTrackInput').value;
            const level = document.getElementById('courseLevelInput').value;
            const title = document.getElementById('courseTitleInput').value.trim();
            const abbrev = document.getElementById('courseAbbrevInput').value.trim();
            const instructor = document.getElementById('courseInstructorInput').value.trim();
            const duration = document.getElementById('courseDurationInput').value.trim();
            const url = document.getElementById('courseUrlInput').value.trim();
            const description = document.getElementById('courseDescInput').value.trim();
            const badge = document.getElementById('courseBadgeInput').value.trim() || 'كورس معتمد';

            const data = getSiteData();
            const existingIndex = data.courses.findIndex(c => c.id === id);

            const courseObject = {
                id,
                track,
                level,
                title,
                abbreviation: abbrev,
                instructor,
                duration,
                url,
                description,
                badge,
                tags: [track, abbrev, "أمن سيبراني"]
            };

            if (existingIndex > -1) {
                data.courses[existingIndex] = courseObject;
                showToast("تم تحديث بيانات الكورس بنجاح!");
            } else {
                data.courses.push(courseObject);
                showToast("تمت إضافة الكورس الجديد بنجاح!");
            }

            saveSiteData(data);
            modal.classList.remove('active');
            renderCoursesTable(trackFilter ? trackFilter.value : 'all');
        });
    }

    // دوال عامة للحذف والتعديل
    window.deleteCourse = function(courseId) {
        if (confirm("هل أنت متأكد من حذف هذا الكورس من المنصة نهائياً؟")) {
            const data = getSiteData();
            data.courses = data.courses.filter(c => c.id !== courseId);
            saveSiteData(data);
            renderCoursesTable(trackFilter ? trackFilter.value : 'all');
            showToast("تم حذف الكورس بنجاح!");
        }
    };

    window.editCourse = function(courseId) {
        const data = getSiteData();
        const course = data.courses.find(c => c.id === courseId);
        if (!course) return;

        document.getElementById('courseIdInput').value = course.id;
        document.getElementById('courseTrackInput').value = course.track;
        document.getElementById('courseLevelInput').value = course.level;
        document.getElementById('courseTitleInput').value = course.title;
        document.getElementById('courseAbbrevInput').value = course.abbreviation;
        document.getElementById('courseInstructorInput').value = course.instructor;
        document.getElementById('courseDurationInput').value = course.duration;
        document.getElementById('courseUrlInput').value = course.url;
        document.getElementById('courseDescInput').value = course.description;
        document.getElementById('courseBadgeInput').value = course.badge || '';

        document.getElementById('courseModalTitle').textContent = 'تعديل بيانات الكورس';
        modal.classList.add('active');
    };
}

/* ==================== 3. إدارة الأدوات (CRUD) ==================== */
function initToolsManagement() {
    const tableBody = document.getElementById('toolsTableBody');
    const categoryFilter = document.getElementById('toolCategoryFilter');
    const addBtn = document.getElementById('addNewToolBtn');
    const modal = document.getElementById('toolModal');
    const form = document.getElementById('toolForm');
    const closeModalBtn = document.getElementById('closeToolModalBtn');

    function renderToolsTable(selectedCategory = 'all') {
        if (!tableBody) return;
        const data = getSiteData();
        const filtered = selectedCategory === 'all'
            ? data.tools
            : data.tools.filter(t => t.category === selectedCategory);

        tableBody.innerHTML = '';
        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">لا توجد أدوات مضافة في هذا التصنيف</td></tr>`;
            return;
        }

        filtered.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="color:#ffffff;">${t.name}</strong></td>
                <td><span class="badge" style="background:rgba(139,92,246,0.18); padding:4px 8px; border-radius:6px;">${t.categoryName}</span></td>
                <td style="max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.description}</td>
                <td>
                    <a href="${t.url}" target="_blank" style="color:var(--neon-purple); font-size:0.85rem;">
                        <i class="fas fa-external-link-alt"></i> الموقع
                    </a>
                </td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn btn-sm btn-edit" onclick="editTool('${t.id}')"><i class="fas fa-edit"></i> تعديل</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTool('${t.id}')"><i class="fas fa-trash"></i> حذف</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    renderToolsTable();

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            renderToolsTable(e.target.value);
        });
    }

    if (addBtn && modal) {
        addBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('toolIdInput').value = '';
            document.getElementById('toolModalTitle').textContent = 'إضافة أداة أمنية جديدة';
            modal.classList.add('active');
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('toolIdInput').value || 'tool-' + Date.now();
            const category = document.getElementById('toolCategoryInput').value;
            const categorySelect = document.getElementById('toolCategoryInput');
            const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
            const name = document.getElementById('toolNameInput').value.trim();
            const description = document.getElementById('toolDescInput').value.trim();
            const url = document.getElementById('toolUrlInput').value.trim();
            const badge = document.getElementById('toolBadgeInput').value.trim() || 'أداة معتمدة';

            const data = getSiteData();
            const existingIndex = data.tools.findIndex(t => t.id === id);

            const toolObject = {
                id,
                category,
                categoryName,
                name,
                description,
                url,
                badge,
                tags: [category, name]
            };

            if (existingIndex > -1) {
                data.tools[existingIndex] = toolObject;
                showToast("تم تحديث بيانات الأداة بنجاح!");
            } else {
                data.tools.push(toolObject);
                showToast("تمت إضافة الأداة الجديدة بنجاح!");
            }

            saveSiteData(data);
            modal.classList.remove('active');
            renderToolsTable(categoryFilter ? categoryFilter.value : 'all');
        });
    }

    window.deleteTool = function(toolId) {
        if (confirm("هل أنت متأكد من حذف هذه الأداة من مكتبة الأدوات؟")) {
            const data = getSiteData();
            data.tools = data.tools.filter(t => t.id !== toolId);
            saveSiteData(data);
            renderToolsTable(categoryFilter ? categoryFilter.value : 'all');
            showToast("تم حذف الأداة بنجاح!");
        }
    };

    window.editTool = function(toolId) {
        const data = getSiteData();
        const tool = data.tools.find(t => t.id === toolId);
        if (!tool) return;

        document.getElementById('toolIdInput').value = tool.id;
        document.getElementById('toolCategoryInput').value = tool.category;
        document.getElementById('toolNameInput').value = tool.name;
        document.getElementById('toolDescInput').value = tool.description;
        document.getElementById('toolUrlInput').value = tool.url;
        document.getElementById('toolBadgeInput').value = tool.badge || '';

        document.getElementById('toolModalTitle').textContent = 'تعديل بيانات الأداة';
        modal.classList.add('active');
    };
}

/* ==================== 4. تخصيص المظهر والألوان وخلفية كالي لينكس ==================== */
function initThemeCustomizer() {
    const primaryInput = document.getElementById('primaryColorInput');
    const secondaryInput = document.getElementById('secondaryColorInput');
    const bgInput = document.getElementById('bgColorInput');
    const customBgUrlInput = document.getElementById('customBgUrlInput');
    const saveThemeBtn = document.getElementById('saveThemeBtn');
    const bgPresets = document.querySelectorAll('.bg-preset-item');

    const data = getSiteData();
    const settings = data.settings || DEFAULT_SITE_DATA.settings;

    if (primaryInput) primaryInput.value = settings.primaryColor || '#8b5cf6';
    if (secondaryInput) secondaryInput.value = settings.secondaryColor || '#6d28d9';
    if (bgInput) bgInput.value = settings.bgColor || '#090514';
    if (customBgUrlInput) customBgUrlInput.value = settings.customBgUrl || '';

    // تحديد الخلفية النشطة
    let selectedBgType = settings.bgType || 'kali-blend';
    bgPresets.forEach(preset => {
        if (preset.getAttribute('data-bg-preset') === selectedBgType) {
            preset.classList.add('selected');
        }
        preset.addEventListener('click', () => {
            bgPresets.forEach(p => p.classList.remove('selected'));
            preset.classList.add('selected');
            selectedBgType = preset.getAttribute('data-bg-preset');
        });
    });

    if (saveThemeBtn) {
        saveThemeBtn.addEventListener('click', () => {
            data.settings.primaryColor = primaryInput.value;
            data.settings.secondaryColor = secondaryInput.value;
            data.settings.bgColor = bgInput.value;
            data.settings.bgType = selectedBgType;
            data.settings.customBgUrl = customBgUrlInput ? customBgUrlInput.value.trim() : '';

            saveSiteData(data);
            applyThemeCustomizations();
            showToast("تم حفظ وتطبيق المظهر والألوان بنجاح على كامل الموقع!");
        });
    }
}

/* ==================== 5. إعدادات الموقع ونصوص البوابة لسنة 2027 والمصمم ==================== */
function initGeneralSettings() {
    const headlineInput = document.getElementById('heroHeadlineInput');
    const designerInput = document.getElementById('designerNameInput');
    const email1Input = document.getElementById('supportEmail1Input');
    const email2Input = document.getElementById('supportEmail2Input');
    const saveBtn = document.getElementById('saveGeneralSettingsBtn');

    const data = getSiteData();
    const settings = data.settings || DEFAULT_SITE_DATA.settings;

    if (headlineInput) headlineInput.value = settings.heroHeadline || "بوابة التميز السيبراني العربية 2027";
    if (designerInput) designerInput.value = settings.designerName || "Mostafa Ahmed";
    if (email1Input) email1Input.value = settings.supportEmail1 || "sa7amostafaahmed@gmail.com";
    if (email2Input) email2Input.value = settings.supportEmail2 || "mostafasecurity@gmail.com";

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            data.settings.heroHeadline = headlineInput.value.trim();
            data.settings.designerName = designerInput.value.trim();
            data.settings.supportEmail1 = email1Input.value.trim();
            data.settings.supportEmail2 = email2Input.value.trim();

            saveSiteData(data);
            applyThemeCustomizations();
            showToast("تم تحديث نصوص وإعدادات الموقع بنجاح!");
        });
    }
}

/* ==================== 6. تغيير اسم المستخدم وكلمة المرور للأدمن ==================== */
function initSecuritySettings() {
    const usernameInput = document.getElementById('adminUsernameInput');
    const currentPassInput = document.getElementById('adminCurrentPasswordInput');
    const newPassInput = document.getElementById('adminNewPasswordInput');
    const saveBtn = document.getElementById('saveSecurityBtn');

    function refreshSecurityUI() {
        const activeCreds = getActiveAdminCredentials();
        if (usernameInput) usernameInput.value = activeCreds.username;
        const displayUser = document.getElementById('adminDisplayUser');
        if (displayUser) displayUser.textContent = activeCreds.username;
        const sourceBadge = document.getElementById('adminCredsSourceBadge');
        if (sourceBadge) {
            sourceBadge.textContent = 'المصدر الحالي: ' + (activeCreds.source || 'الكود');
        }
    }

    refreshSecurityUI();

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const latestCreds = getActiveAdminCredentials();
            const newUsername = usernameInput.value.trim();
            const currentPass = currentPassInput.value.trim();
            const newPass = newPassInput.value.trim();

            if (!newUsername || !newPass) {
                alert("يرجى إدخال اسم المستخدم وكلمة المرور الجديدة.");
                return;
            }

            // التحقق من كلمة المرور الحالية (يقبل كلمة مرور الكود أو كلمة مرور الموقع معاً)
            const isCurrentPassValid = validateAdminCredentials(latestCreds.username, currentPass) || 
                                       validateAdminCredentials(newUsername, currentPass) || 
                                       currentPass === latestCreds.password || 
                                       (ADMIN_CONFIG.password && currentPass === ADMIN_CONFIG.password.trim());

            if (!isCurrentPassValid) {
                alert("كلمة المرور الحالية غير صحيحة!");
                return;
            }

            saveAdminCredentials(newUsername, newPass);
            currentPassInput.value = '';
            newPassInput.value = '';
            refreshSecurityUI();
            showToast("تم تغيير بيانات تسجيل دخول الأدمن بنجاح!");
        });
    }
}

/* ==================== 7. تصدير واستعادة البيانات ==================== */
function initBackupRestore() {
    const exportBtn = document.getElementById('exportDataBtn');
    const restoreBtn = document.getElementById('resetToFactoryBtn');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = getSiteData();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `arabsecurity_backup_${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showToast("تم تصدير ملف النسخة الاحتياطية بنجاح!");
        });
    }

    if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            if (confirm("تحذير: هل أنت متأكد من استعادة كافة البيانات الافتراضية للموقع؟ ستتم استعادة جميع الكورسات والأدوات والإعدادات الأصلية.")) {
                saveSiteData(DEFAULT_SITE_DATA);
                location.reload();
            }
        });
    }
}

/* ==================== 8. تبويب الربط السحابي مع Firebase ==================== */
function initCloudTab() {
    const pasteInput = document.getElementById('firebaseConfigPasteInput');
    const parseBtn = document.getElementById('autoParseFirebaseConfigBtn');
    const saveBtn = document.getElementById('saveFirebaseConfigBtn');
    const syncBtn = document.getElementById('syncInitialDataToCloudBtn');
    const badge = document.getElementById('firebaseConnectionBadge');

    const apiKeyInput = document.getElementById('fbApiKey');
    const projectIdInput = document.getElementById('fbProjectId');
    const authDomainInput = document.getElementById('fbAuthDomain');
    const appIdInput = document.getElementById('fbAppId');

    function updateBadgeStatus() {
        if (!badge) return;
        if (typeof isFirebaseEnabled === 'function' && isFirebaseEnabled()) {
            badge.style.background = 'rgba(34, 197, 94, 0.15)';
            badge.style.color = '#4ade80';
            badge.style.borderColor = 'rgba(34, 197, 94, 0.4)';
            badge.innerHTML = '<i class="fas fa-circle-check"></i> متصل بالسحابة أونلاين 🟢 (أي تعديل يظهر للجميع فوراً)';
        } else {
            badge.style.background = 'rgba(234, 179, 8, 0.15)';
            badge.style.color = '#facc15';
            badge.style.borderColor = 'rgba(234, 179, 8, 0.3)';
            badge.innerHTML = '<i class="fas fa-circle-dot"></i> يعمل محلياً (غير مربوط بالسحابة بعد) 🟡';
        }
    }

    // تعبئة الحقول إذا كانت الإعدادات موجودة مسبقاً
    if (typeof FIREBASE_CONFIG !== 'undefined') {
        if (apiKeyInput) apiKeyInput.value = FIREBASE_CONFIG.apiKey || '';
        if (projectIdInput) projectIdInput.value = FIREBASE_CONFIG.projectId || '';
        if (authDomainInput) authDomainInput.value = FIREBASE_CONFIG.authDomain || '';
        if (appIdInput) appIdInput.value = FIREBASE_CONFIG.appId || '';
    }
    updateBadgeStatus();

    // الاستخراج التلقائي من الكود المنسوخ
    if (parseBtn && pasteInput) {
        parseBtn.addEventListener('click', () => {
            const raw = pasteInput.value;
            const apiKeyMatch = raw.match(/apiKey:\s*["']([^"']+)["']/);
            const projIdMatch = raw.match(/projectId:\s*["']([^"']+)["']/);
            const authDomainMatch = raw.match(/authDomain:\s*["']([^"']+)["']/);
            const appIdMatch = raw.match(/appId:\s*["']([^"']+)["']/);

            if (apiKeyMatch && apiKeyInput) apiKeyInput.value = apiKeyMatch[1];
            if (projIdMatch && projectIdInput) projectIdInput.value = projIdMatch[1];
            if (authDomainMatch && authDomainInput) authDomainInput.value = authDomainMatch[1];
            if (appIdMatch && appIdInput) appIdInput.value = appIdMatch[1];

            if (apiKeyMatch || projIdMatch) {
                showToast("تم استخراج بيانات Firebase بنجاح من النص المنسوخ!");
            } else {
                alert("لم يتم العثور على قيم صالحة، يرجى نسخ كود firebaseConfig كاملاً من جوجل.");
            }
        });
    }

    // حفظ وتفعيل الربط السحابي
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const config = {
                apiKey: apiKeyInput ? apiKeyInput.value.trim() : '',
                projectId: projectIdInput ? projectIdInput.value.trim() : '',
                authDomain: authDomainInput ? authDomainInput.value.trim() : '',
                appId: appIdInput ? appIdInput.value.trim() : '',
                storageBucket: `${projectIdInput.value.trim()}.appspot.com`,
                messagingSenderId: ""
            };

            if (!config.apiKey || !config.projectId) {
                alert("يرجى إدخال apiKey و projectId على الأقل لتفعيل الاتصال السحابي.");
                return;
            }

            const success = saveFirebaseConfig(config);
            updateBadgeStatus();
            if (success) {
                showToast("تم تفعيل الاتصال السحابي بـ Firebase بنجاح! 🟢");
            } else {
                showToast("تم حفظ الإعدادات، يرجى التأكد من صحة المفاتيح.");
            }
        });
    }

    // رفع البيانات الحالية إلى السحابة فوراً
    if (syncBtn) {
        syncBtn.addEventListener('click', () => {
            if (!isFirebaseEnabled()) {
                alert("يرجى حفظ وتفعيل بيانات الربط السحابي أولاً.");
                return;
            }
            const data = getSiteData();
            const db = initFirebase();
            syncBtn.disabled = true;
            syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';

            db.collection("arabsecurity").doc("master_data").set(data)
                .then(() => {
                    showToast("تم رفع ونشر جميع بيانات الموقع إلى السحابة بنجاح! الآن أي زائر في العالم سيرى الموقع متحدثاً.");
                })
                .catch(err => {
                    alert("خطأ أثناء الرفع: " + err.message + "\nتأكد من تفعيل قواعد Firestore في وضع Test Mode.");
                })
                .finally(() => {
                    syncBtn.disabled = false;
                    syncBtn.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> رفع البيانات الحالية إلى السحابة فوراً';
                });
        });
    }
}

/* ==================== 9. تبويب النشر المباشر على GitHub Pages ==================== */
function initGitHubTab() {
    const ownerInput = document.getElementById('ghOwnerInput');
    const repoInput = document.getElementById('ghRepoInput');
    const tokenInput = document.getElementById('ghTokenInput');
    const branchInput = document.getElementById('ghBranchInput');
    const toggleTokenBtn = document.getElementById('toggleGhTokenBtn');
    const saveAndTestBtn = document.getElementById('saveAndTestGhBtn');
    const publishAllBtn = document.getElementById('publishAllGhBtn');
    const publishCredsBtn = document.getElementById('publishCredsGhBtn');
    const topQuickPublishBtn = document.getElementById('topQuickPublishBtn');
    const badge = document.getElementById('ghStatusBadge');
    const logBox = document.getElementById('ghLogOutputBox');
    const logText = document.getElementById('ghLogText');
    const logSpinner = document.getElementById('ghLogSpinner');

    // تحميل الإعدادات المحفوظة مسبقاً
    if (typeof getGitHubConfig === 'function') {
        const cfg = getGitHubConfig();
        if (ownerInput) ownerInput.value = cfg.owner || '';
        if (repoInput) repoInput.value = cfg.repo || '';
        if (tokenInput) tokenInput.value = cfg.token || '';
        if (branchInput) branchInput.value = cfg.branch || 'main';
    }

    function updateBadgeStatus() {
        if (!badge) return;
        if (typeof isGitHubConfigured === 'function' && isGitHubConfigured()) {
            badge.style.background = 'rgba(34, 197, 94, 0.15)';
            badge.style.color = '#4ade80';
            badge.style.borderColor = 'rgba(34, 197, 94, 0.4)';
            badge.innerHTML = '<i class="fas fa-circle-check"></i> متصل بـ GitHub أونلاين 🟢 (جاهز للنشر)';
        } else {
            badge.style.background = 'rgba(234, 179, 8, 0.15)';
            badge.style.color = '#facc15';
            badge.style.borderColor = 'rgba(234, 179, 8, 0.3)';
            badge.innerHTML = '<i class="fas fa-circle-dot"></i> غير متصل بحساب GitHub بعد';
        }
    }

    updateBadgeStatus();

    // إظهار / إخفاء التوكن
    if (toggleTokenBtn && tokenInput) {
        toggleTokenBtn.addEventListener('click', () => {
            if (tokenInput.type === 'password') {
                tokenInput.type = 'text';
                toggleTokenBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                tokenInput.type = 'password';
                toggleTokenBtn.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    }

    function log(message) {
        if (!logBox || !logText) return;
        logBox.style.display = 'block';
        const timestamp = new Date().toLocaleTimeString('ar-EG');
        logText.textContent += `[${timestamp}] ${message}\n`;
        logBox.scrollTop = logBox.scrollHeight;
    }

    function clearLog() {
        if (!logBox || !logText) return;
        logBox.style.display = 'block';
        logText.textContent = '';
    }

    // حفظ واختبار الاتصال بـ GitHub
    if (saveAndTestBtn) {
        saveAndTestBtn.addEventListener('click', async () => {
            const owner = ownerInput ? ownerInput.value.trim() : '';
            const repo = repoInput ? repoInput.value.trim() : '';
            const token = tokenInput ? tokenInput.value.trim() : '';
            const branch = branchInput ? branchInput.value.trim() || 'main' : 'main';

            if (!owner || !repo || !token) {
                alert("يرجى إدخال اسم المستخدم واسم المستودع ورمز الوصول (Token) كاملاً.");
                return;
            }

            saveGitHubConfig(owner, repo, token, branch);
            clearLog();
            log(`جاري اختبار الاتصال بمستودع GitHub (${owner}/${repo})...`);
            if (logSpinner) logSpinner.style.display = 'inline-block';
            saveAndTestBtn.disabled = true;

            try {
                const repoData = await testGitHubConnection();
                updateBadgeStatus();
                log(`✓ تم الاتصال بنجاح بمستودع (${repoData.full_name})!`);
                log(`✓ المستودع صالح والاتصال نشط وجاهز لنشر التعديلات.`);
                showToast("تم الاتصال بمستودع GitHub بنجاح! 🟢");
            } catch (err) {
                log(`❌ فشل الاتصال: ${err.message}`);
                alert("فشل الاتصال بـ GitHub:\n" + err.message);
            } finally {
                if (logSpinner) logSpinner.style.display = 'none';
                saveAndTestBtn.disabled = false;
            }
        });
    }

    // دالة تنفيذ النشر الشامل
    async function executePublishAll(callerBtn) {
        if (typeof isGitHubConfigured !== 'function' || !isGitHubConfigured()) {
            alert("يرجى ضبط بيانات الاتصال بـ GitHub أولاً في تبويب 'نشر أونلاين على GitHub Pages'.");
            const ghNav = document.querySelector('.admin-nav-item[data-tab="tabGitHub"]');
            if (ghNav) ghNav.click();
            return;
        }

        const btn = callerBtn || publishAllBtn;
        if (btn) btn.disabled = true;
        clearLog();
        if (logSpinner) logSpinner.style.display = 'inline-block';

        const cfg = getGitHubConfig();
        log(`[1/3] بدء نشر التعديلات إلى مستودع (${cfg.owner}/${cfg.repo}) على فرع (${cfg.branch})...`);

        try {
            const siteData = getSiteData();
            log(`[2/3] جاري تحديث وحفظ قاعدة البيانات (js/default-data.js) عبر GitHub API...`);
            await publishToGitHubPages(siteData);
            log(`✓ تم تحديث قاعدة البيانات بنجاح في GitHub!`);

            // تحديث بيانات تسجيل الدخول إن وجدت
            const creds = getActiveAdminCredentials();
            if (creds && creds.username && creds.password) {
                log(`[3/3] جاري تحديث ملف بيانات الدخول والأدمن (js/admin-config.js)...`);
                try {
                    await publishCredentialsToGitHub(creds.username, creds.password);
                    log(`✓ تم تحديث بيانات دخول الأدمن بنجاح في GitHub!`);
                } catch (e) {
                    log(`ملاحظة: تعذر تحديث بيانات الدخول (${e.message})`);
                }
            }

            log(`=======================================================`);
            log(`🎉 اكتملت عملية النشر بنجاح على GitHub Pages!`);
            log(`⏱️ يقوم GitHub Pages الآن بالبناء التلقائي، وستظهر التعديلات لكافة الزوار في العالم خلال 30 إلى 60 ثانية.`);
            showToast("🎉 تم نشر كافة التعديلات على الموقع أونلاين بنجاح!");
        } catch (err) {
            log(`❌ خطأ أثناء النشر: ${err.message}`);
            alert("خطأ أثناء النشر على GitHub:\n" + err.message);
        } finally {
            if (logSpinner) logSpinner.style.display = 'none';
            if (btn) btn.disabled = false;
        }
    }

    // زر النشر الشامل داخل التبويب
    if (publishAllBtn) {
        publishAllBtn.addEventListener('click', () => executePublishAll(publishAllBtn));
    }

    // زر النشر السريع في الشريط العلوي (Top Bar)
    if (topQuickPublishBtn) {
        topQuickPublishBtn.addEventListener('click', () => executePublishAll(topQuickPublishBtn));
    }

    // نشر بيانات الدخول فقط
    if (publishCredsBtn) {
        publishCredsBtn.addEventListener('click', async () => {
            if (typeof isGitHubConfigured !== 'function' || !isGitHubConfigured()) {
                alert("يرجى ضبط بيانات الاتصال بـ GitHub أولاً.");
                return;
            }

            const creds = getActiveAdminCredentials();
            publishCredsBtn.disabled = true;
            clearLog();
            if (logSpinner) logSpinner.style.display = 'inline-block';
            log(`جاري تحديث بيانات الدخول (اليوزرنيم والباسورد) على GitHub...`);

            try {
                await publishCredentialsToGitHub(creds.username, creds.password);
                log(`✓ تم حفظ وتحديث ملف js/admin-config.js على GitHub بنجاح!`);
                showToast("تم تحديث كلمة المرور واسم المستخدم في GitHub أونلاين بنجاح!");
            } catch (err) {
                log(`❌ خطأ أثناء الحفظ: ${err.message}`);
                alert("خطأ أثناء تحديث بيانات الدخول:\n" + err.message);
            } finally {
                if (logSpinner) logSpinner.style.display = 'none';
                publishCredsBtn.disabled = false;
            }
        });
    }
}

/* ==================== 10. تبويب تحديث واستخراج الكود الأساسي ==================== */
function initCodeSyncTab() {
    const btnDownloadData = document.getElementById('btnDownloadDefaultData');
    const btnCopyData = document.getElementById('btnCopyDefaultData');
    const btnDownloadCreds = document.getElementById('btnDownloadAdminConfig');
    const btnCopyCreds = document.getElementById('btnCopyAdminConfig');
    const topDownloadBtn = document.getElementById('topDownloadCodeBtn');

    function handleDownloadData() {
        const data = getSiteData();
        const content = generateDefaultDataJsContent(data);
        triggerFileDownload('default-data.js', content);
        showToast("تم تحميل ملف default-data.js المحدث بنجاح! ضعه في مجلد js/ بمشروعك.");
    }

    if (btnDownloadData) btnDownloadData.addEventListener('click', handleDownloadData);
    if (topDownloadBtn) topDownloadBtn.addEventListener('click', handleDownloadData);

    if (btnCopyData) {
        btnCopyData.addEventListener('click', () => {
            const data = getSiteData();
            const content = generateDefaultDataJsContent(data);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(content).then(() => {
                    showToast("تم نسخ كود default-data.js كاملاً للحافظة! يمكنك لصقه في VS Code.");
                }).catch(() => {
                    showToast("تعذر النسخ التلقائي، يرجى استخدام زر التحميل.");
                });
            } else {
                showToast("يرجى استخدام زر التحميل لتنزيل الملف مباشرة.");
            }
        });
    }

    if (btnDownloadCreds) {
        btnDownloadCreds.addEventListener('click', () => {
            const creds = getActiveAdminCredentials();
            const content = generateAdminConfigJsContent(creds.username, creds.password);
            triggerFileDownload('admin-config.js', content);
            showToast("تم تحميل ملف admin-config.js المحدث بنجاح!");
        });
    }

    if (btnCopyCreds) {
        btnCopyCreds.addEventListener('click', () => {
            const creds = getActiveAdminCredentials();
            const content = generateAdminConfigJsContent(creds.username, creds.password);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(content).then(() => {
                    showToast("تم نسخ كود admin-config.js كاملاً للحافظة!");
                }).catch(() => {
                    showToast("تعذر النسخ التلقائي، يرجى استخدام زر التحميل.");
                });
            } else {
                showToast("يرجى استخدام زر التحميل لتنزيل الملف مباشرة.");
            }
        });
    }
}


