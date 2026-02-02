/**
 * Gribouille Portfolio - App Logic
 * Interactions, animations, and data management
 */

// ============================================
// PROJECTS DATA
// ============================================

const projects = [
    {
        id: 1,
        title: "Data Visualization",
        description: "Visualisations interactives avec Chart.js et D3.js",
        icon: "📊",
        color: "#60a5fa",
        likes: 24,
        tags: ["JavaScript", "D3.js", "Chart.js"]
    },
    {
        id: 2,
        title: "TTS Local",
        description: "Synthèse vocale 100% offline avec Piper",
        icon: "🗣️",
        color: "#34d399",
        likes: 18,
        tags: ["Python", "AI", "Audio"]
    },
    {
        id: 3,
        title: "Template Engine",
        description: "Génération de rapports HTML avec EJS/Handlebars",
        icon: "📄",
        color: "#f472b6",
        likes: 15,
        tags: ["Node.js", "Templates", "EJS"]
    },
    {
        id: 4,
        title: "File Automation",
        description: "Automatisation avancée du système de fichiers",
        icon: "📁",
        color: "#a78bfa",
        likes: 21,
        tags: ["Node.js", "Automation", "FS"]
    },
    {
        id: 5,
        title: "Git Automation",
        description: "Workflows git automatisés et intelligent",
        icon: "🌿",
        color: "#fbbf24",
        likes: 32,
        tags: ["Git", "Automation", "CLI"]
    },
    {
        id: 6,
        title: "Reminder System",
        description: "Planification de rappels via cron",
        icon: "⏰",
        color: "#f87171",
        likes: 12,
        tags: ["Node.js", "Cron", "Scheduling"]
    }
];

const skills = [
    { name: "JavaScript", level: 90, icon: "⚡", color: "#f7df1e" },
    { name: "Node.js", level: 85, icon: "🟢", color: "#339933" },
    { name: "Python", level: 75, icon: "🐍", color: "#3776ab" },
    { name: "HTML/CSS", level: 95, icon: "🎨", color: "#e34c26" },
    { name: "AI/ML", level: 70, icon: "🤖", color: "#ff6b6b" },
    { name: "DevOps", level: 65, icon: "🚀", color: "#2496ed" }
];

// ============================================
// STATE
// ============================================

const state = {
    currentSection: 'hero',
    theme: localStorage.getItem('theme') || 'dark',
    likes: JSON.parse(localStorage.getItem('likes') || '[]'),
    animated: false
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    sections: document.querySelectorAll('.section'),
    navItems: document.querySelectorAll('.nav-item'),
    projectsGrid: document.getElementById('projectsGrid'),
    skillsContainer: document.getElementById('skillsContainer'),
    themeToggle: document.getElementById('themeToggle'),
    toastContainer: document.getElementById('toastContainer'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    applyTheme();
    renderProjects();
    renderSkills();
    setupEventListeners();
    animateOnScroll();

    // Hide loading
    setTimeout(() => {
        elements.loadingOverlay.classList.add('hidden');
    }, 500);

    // Animate stats on first view
    setTimeout(animateStats, 800);
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderProjects() {
    elements.projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card glass-card" data-project-id="${project.id}">
            <div class="project-header">
                <span class="project-icon" style="background: ${project.color}20; color: ${project.color}">
                    ${project.icon}
                </span>
                <button class="like-btn ${state.likes.includes(project.id) ? 'liked' : ''}" 
                        data-project-id="${project.id}"
                        aria-label="Like project">
                    <span class="like-icon">❤️</span>
                    <span class="like-count">${project.likes + (state.likes.includes(project.id) ? 1 : 0)}</span>
                </button>
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderSkills() {
    elements.skillsContainer.innerHTML = skills.map((skill, index) => `
        <div class="skill-item" data-skill-index="${index}" style="--delay: ${index * 0.1}s">
            <div class="skill-icon" style="background: ${skill.color}20; color: ${skill.color}">
                ${skill.icon}
            </div>
            <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: 0%; --target-width: ${skill.level}%; background: ${skill.color}"></div>
                </div>
            </div>
            <span class="skill-level">${skill.level}%</span>
        </div>
    `).join('');
}

// ============================================
// NAVIGATION
// ============================================

function navigateTo(sectionId) {
    state.currentSection = sectionId;
    
    elements.sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
    
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Trigger section-specific animations
    if (sectionId === 'skills') {
        animateSkills();
    }
    
    // Haptic feedback if available
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// ============================================
// INTERACTIONS
// ============================================

function toggleLike(projectId) {
    const index = state.likes.indexOf(projectId);
    const btn = document.querySelector(`.like-btn[data-project-id="${projectId}"]`);
    const countEl = btn?.querySelector('.like-count');
    
    if (index === -1) {
        state.likes.push(projectId);
        showToast('❤️ Projet liké !', 'success');
        if (btn) btn.classList.add('liked');
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
    } else {
        state.likes.splice(index, 1);
        if (btn) btn.classList.remove('liked');
    }
    
    if (countEl) {
        const project = projects.find(p => p.id === projectId);
        const count = project.likes + (state.likes.includes(projectId) ? 1 : 0);
        countEl.textContent = count;
    }
    
    localStorage.setItem('likes', JSON.stringify(state.likes));
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    localStorage.setItem('theme', state.theme);
    showToast(state.theme === 'dark' ? '🌙 Mode sombre' : '☀️ Mode clair', 'info');
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const icon = elements.themeToggle?.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = state.theme === 'dark' ? '☀️' : '🌙';
    }
}

function openArchive() {
    const archiveUrl = 'https://github.com/Vie-lisieresubtil/gribouille-portfolio/blob/main/MOLTBOOK_ARCHIVE.md';
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(archiveUrl);
    } else {
        window.open(archiveUrl, '_blank');
    }
}

// ============================================
// ANIMATIONS
// ============================================

function animateStats() {
    if (state.animated) return;
    
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        animateCounter(counter, target, 1500);
    });
    
    state.animated = true;
}

function animateCounter(element, target, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function animateSkills() {
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.style.getPropertyValue('--target-width');
        }, index * 100);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.section);
        });
    });
    
    // Section navigation from buttons
    document.querySelectorAll('[data-section]').forEach(btn => {
        if (!btn.classList.contains('nav-item')) {
            btn.addEventListener('click', () => {
                navigateTo(btn.dataset.section);
            });
        }
    });
    
    // Like buttons
    elements.projectsGrid?.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            const projectId = parseInt(likeBtn.dataset.projectId);
            toggleLike(projectId);
        }
    });
    
    // Theme toggle
    elements.themeToggle?.addEventListener('click', toggleTheme);
    
    // Contact buttons
    document.getElementById('telegramBtn')?.addEventListener('click', () => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openTelegramLink('https://t.me/lisiere_subtil');
        }
    });
    
    document.getElementById('shareBtn')?.addEventListener('click', () => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink('https://vie-lisieresubtil.github.io/gribouille-portfolio/');
        }
    });
    
    // Archive button
    document.getElementById('archiveBtn')?.addEventListener('click', openArchive);
}

function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.glass-card, .project-card, .skill-item').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// TOASTS
// ============================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    
    elements.toastContainer?.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// TELEGRAM WEBAPP INTEGRATION
// ============================================

if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();
    
    // Set theme based on Telegram
    if (tg.colorScheme === 'light' && state.theme === 'dark') {
        toggleTheme();
    }
}
