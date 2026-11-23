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
