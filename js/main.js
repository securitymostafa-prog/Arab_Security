/**
 * ==============================================================================
 * السكربت الرئيسي لتفاعلات منصة ArabSecurity (Main UI Script)
 * ==============================================================================
 * يشمل إدارة القوائم، البحث السريع (/admin)، أزرار النسخ، وعرض المحتوى الديناميكي
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearchModal();
    initCopyButtons();
    initDynamicPagesContent();
});

/* ==================== القائمة المتجاوبة (Mobile Menu) ==================== */
function initNavigation() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

/* ==================== نافذة البحث السريع والانتقال إلى /admin ==================== */
function initSearchModal() {
    const triggerBtn = document.querySelector('.search-trigger-btn');
    const modal = document.getElementById('searchModal');
    const searchInput = document.getElementById('siteSearchInput');
    const resultsContainer = document.getElementById('searchResults');
    const closeBtn = document.getElementById('closeSearchModal');

    if (!modal || !searchInput) return;

    function openModal() {
        modal.classList.add('active');
        searchInput.value = '';
        renderQuickSearchItems('');
        setTimeout(() => searchInput.focus(), 50);
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    if (triggerBtn) {
        triggerBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // اختصار لوحة المفاتيح: Ctrl + K أو Esc
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (modal.classList.contains('active')) {
                closeModal();
            } else {
                openModal();
            }
        }
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // البحث التفاعلي والتعامل مع كتابة /admin
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        renderQuickSearchItems(query);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = searchInput.value.trim().toLowerCase();
            if (val === '/admin' || val === 'admin') {
                window.location.href = 'admin.html';
            }
        }
    });

    function renderQuickSearchItems(query) {
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '';

        // إذا كتب المستخدم /admin أو admin في البحث
        if (query === '/admin' || query === 'admin' || query.startsWith('/ad')) {
            const adminItem = document.createElement('li');
            adminItem.className = 'search-result-item highlighted';
            adminItem.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-shield-alt" style="color:var(--neon-purple); font-size:1.2rem;"></i>
                    <div>
                        <strong style="color:#ffffff;">لوحة تحكم الإدارة السرية (/admin)</strong>
                        <div style="font-size:0.8rem; color:var(--text-muted);">انقر للدخول إلى لوحة تحكم وإدارة الموقع</div>
                    </div>
                </div>
                <span class="search-kbd">Enter ↵</span>
            `;
            adminItem.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
            resultsContainer.appendChild(adminItem);
            return;
        }

        // عناصر البحث الافتراضية
        const quickLinks = [
            { title: "مسار الريد تيم (Red Team)", url: "red-team.html", icon: "fa-user-ninja", category: "مسارات" },
            { title: "مسار البلو تيم (Blue Team)", url: "blue-team.html", icon: "fa-shield-halved", category: "مسارات" },
            { title: "مسار الأساسيات (البرمجة، الأنظمة، الشبكات)", url: "basics.html", icon: "fa-graduation-cap", category: "مسارات" },
            { title: "مكتبة أدوات الأمن السيبراني", url: "tools.html", icon: "fa-toolbox", category: "أدوات" },
            { title: "دعم المنصة والتواصل", url: "support.html", icon: "fa-headset", category: "دعم" },
            { title: "حول المنصة والمطور مصطفى أحمد", url: "about.html", icon: "fa-circle-info", category: "معلومات" }
        ];

        const filtered = query 
            ? quickLinks.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
            : quickLinks;

        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <li style="padding:16px; text-align:center; color:var(--text-muted);">
                    لا توجد نتائج مطابقة، جرب كتابة <code>/admin</code> للوصول للوحة التحكم.
                </li>
            `;
            return;
        }

        filtered.forEach(item => {
            const li = document.createElement('li');
            li.className = 'search-result-item';
            li.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fas ${item.icon}" style="color:var(--primary-purple);"></i>
                    <span>${item.title}</span>
                </div>
                <span style="font-size:0.75rem; color:var(--text-muted);">${item.category}</span>
            `;
            li.addEventListener('click', () => {
                window.location.href = item.url;
            });
            resultsContainer.appendChild(li);
        });
    }
}

/* ==================== زر النسخ التفاعلي (Copy Buttons) ==================== */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`تم نسخ: ${textToCopy}`);
                }).catch(() => {
                    showToast("تم النسخ بنجاح");
                });
            }
        });
    });
}

/* ==================== عرض الإشعارات المنبثقة (Toast Notification) ==================== */
function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--neon-purple);"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ==================== عرض المحتوى الديناميكي للصفحات ==================== */
function initDynamicPagesContent() {
    const siteData = getSiteData();

    // 1. صفحة الريد تيم (red-team.html)
    const redTeamContainer = document.getElementById('redTeamCoursesContainer');
    if (redTeamContainer) {
        const redCourses = siteData.courses.filter(c => c.track === 'red-team');
        renderRedTeamCourses(redTeamContainer, redCourses);
    }

    // 2. صفحة البلو تيم (blue-team.html)
    const blueTeamContainer = document.getElementById('blueTeamCoursesContainer');
    if (blueTeamContainer) {
        const blueCourses = siteData.courses.filter(c => c.track === 'blue-team');
        renderBlueTeamCourses(blueTeamContainer, blueCourses);
    }

    // 3. صفحة الأساسيات (basics.html)
    const basicsContainer = document.getElementById('basicsCoursesContainer');
    if (basicsContainer) {
        const basicsCourses = siteData.courses.filter(c => c.track === 'basics');
        renderBasicsCourses(basicsContainer, basicsCourses);
    }

    // 4. صفحة الأدوات (tools.html)
    const toolsContainer = document.getElementById('toolsContainer');
    if (toolsContainer) {
        renderTools(toolsContainer, siteData.tools);
        initToolsFilter(toolsContainer, siteData.tools);
    }
}

// إنشاء قالب بطاقة الكورس
function createCourseCardHTML(course) {
    const tagsHTML = (course.tags || []).map(t => `<span class="course-tag">${t}</span>`).join('');
    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-header">
                <div class="course-title-wrap">
                    <span class="course-abbrev-badge">${course.abbreviation || 'Course'}</span>
                    <h3 class="course-title">${course.title}</h3>
                </div>
                <span class="badge" style="background:rgba(139,92,246,0.15); color:var(--neon-purple); padding:6px 14px; border-radius:20px; font-size:0.82rem; border:1px solid rgba(139,92,246,0.3);">
                    ${course.badge || 'معتمد'}
                </span>
            </div>

            <div class="course-details-grid">
                <div class="course-detail-item">
                    <i class="fas fa-chalkboard-user"></i>
                    <div>
                        <div class="detail-label">المدرب / المهندس:</div>
                        <div class="detail-value">${course.instructor}</div>
                    </div>
                </div>
                <div class="course-detail-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <div class="detail-label">مدة ومستوى الكورس:</div>
                        <div class="detail-value">${course.duration}</div>
                    </div>
                </div>
                <div class="course-detail-item">
                    <i class="fas fa-bookmark"></i>
                    <div>
                        <div class="detail-label">الاسم المختصر:</div>
                        <div class="detail-value">${course.abbreviation}</div>
                    </div>
                </div>
            </div>

            <p class="course-desc">${course.description}</p>

            <div class="course-actions">
                <div class="course-tags">${tagsHTML}</div>
                <a href="${course.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    <i class="fas fa-play-circle"></i> بدء دراسة الكورس الآن
                </a>
            </div>
        </div>
    `;
}

// عرض كورسات الريد تيم
function renderRedTeamCourses(container, courses) {
    container.innerHTML = '';
    const levels = [
        { key: 'beginner', title: 'المستوى الأول: المبتدئ (Beginner)' },
        { key: 'intermediate', title: 'المستوى الثاني: المتوسط (Intermediate)' },
        { key: 'advanced', title: 'المستوى الثالث: المتقدم (Advanced)' }
    ];

    levels.forEach(lvl => {
        const lvlCourses = courses.filter(c => c.level === lvl.key);
        if (lvlCourses.length > 0) {
            const section = document.createElement('div');
            section.className = 'courses-level-section';
            section.innerHTML = `
                <div class="section-level-badge">
                    <i class="fas fa-layer-group"></i> ${lvl.title}
                </div>
                ${lvlCourses.map(c => createCourseCardHTML(c)).join('')}
            `;
            container.appendChild(section);
        }
    });
}

// عرض كورسات البلو تيم
function renderBlueTeamCourses(container, courses) {
    container.innerHTML = '';
    const levels = [
        { key: 'beginner', title: 'المستوى الأول: المبتدئ (Blue Team Fundamentals & SOC)' },
        { key: 'intermediate', title: 'المستوى الثاني: المتوسط (Digital Forensics & Incident Response)' },
        { key: 'advanced', title: 'المستوى الثالث: المتقدم (Advanced Threat Hunting & SIEM)' }
    ];

    levels.forEach(lvl => {
        const lvlCourses = courses.filter(c => c.level === lvl.key);
        if (lvlCourses.length > 0) {
            const section = document.createElement('div');
            section.className = 'courses-level-section';
            section.innerHTML = `
                <div class="section-level-badge">
                    <i class="fas fa-shield-halved"></i> ${lvl.title}
                </div>
                ${lvlCourses.map(c => createCourseCardHTML(c)).join('')}
            `;
            container.appendChild(section);
        }
    });
}

// عرض مسار الأساسيات (4 خطوات)
function renderBasicsCourses(container, courses) {
    container.innerHTML = '';
    const steps = [
        { key: 'step-1', title: 'الخطوة الأولى: البرمجة (Programming)', icon: 'fa-code' },
        { key: 'step-2', title: 'الخطوة الثانية: أنظمة التشغيل (Operating Systems)', icon: 'fa-terminal' },
        { key: 'step-3', title: 'الخطوة الثالثة: الشبكات (Networks)', icon: 'fa-network-wired' },
        { key: 'step-4', title: 'الخطوة الرابعة: أساسيات الأمن السيبراني (Cybersecurity Basics)', icon: 'fa-lock' }
    ];

    steps.forEach(step => {
        const stepCourses = courses.filter(c => c.level === step.key);
        if (stepCourses.length > 0) {
            const section = document.createElement('div');
            section.className = 'courses-level-section';
            section.innerHTML = `
                <div class="section-level-badge">
                    <i class="fas ${step.icon}"></i> ${step.title}
                </div>
                ${stepCourses.map(c => createCourseCardHTML(c)).join('')}
            `;
            container.appendChild(section);
        }
    });
}

// عرض الأدوات (tools.html)
function renderTools(container, tools) {
    container.innerHTML = '';
    if (tools.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); grid-column:1/-1;">لا توجد أدوات متطابقة مع التصنيف المحدد</div>`;
        return;
    }

    tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.setAttribute('data-category', tool.category);
        card.innerHTML = `
            <div>
                <div class="tool-top">
                    <h3 class="tool-name">${tool.name}</h3>
                    <span class="tool-category-badge">${tool.categoryName}</span>
                </div>
                <p class="tool-desc">${tool.description}</p>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.06); padding-top:16px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.8rem; color:var(--text-muted);">${tool.badge || 'أداة معتمدة'}</span>
                <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding:8px 16px; font-size:0.88rem;">
                    <i class="fas fa-external-link-alt"></i> الموقع الرسمي
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// فلترة الأدوات بالتبويبات
function initToolsFilter(container, allTools) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-filter');

            if (cat === 'all') {
                renderTools(container, allTools);
            } else {
                const filtered = allTools.filter(t => t.category === cat);
                renderTools(container, filtered);
            }
        });
    });
}
