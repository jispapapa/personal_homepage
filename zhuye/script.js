/**
 * 大学生个人主页 - 交互脚本
 * 包含导航、动画、滚动效果等功能
 */

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initProgressBars();
    initSmoothScroll();
    initNavbarScroll();
});

/**
 * 导航功能
 * 处理移动端汉堡菜单和导航链接点击
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单点击事件
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // 导航链接点击事件 - 关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/**
 * 滚动动画
 * 元素进入视口时触发动画
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.core-card, .award-card, .project-card, .personal-card, ' +
        '.paper-item, .contact-item, .activity-item, .timeline-item'
    );

    // 为元素添加初始样式
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
    });

    // 创建 Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * 进度条动画
 * 当进度条进入视口时，从0填充到目标值
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.width;
                
                // 重置为0，然后动画到目标值
                progressBar.style.width = '0%';
                progressBar.style.transition = 'width 1.5s ease';
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 100);

                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

/**
 * 平滑滚动
 * 点击导航链接时平滑滚动到对应区域
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    const allLinks = [...navLinks, ...heroButtons];

    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 导航栏滚动效果
 * 滚动时改变导航栏样式
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // 添加/移除滚动样式
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 隐藏/显示导航栏（向下滚动隐藏，向上滚动显示）
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * 打字机效果（可选）
 * 为标题添加打字机效果
 */
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * 数字计数动画
 * 数字从0计数到目标值
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

/**
 * 卡片3D倾斜效果（桌面端）
 * 鼠标悬停时卡片产生3D倾斜效果
 */
function initCardTilt() {
    // 仅在非触摸设备上启用
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.core-card, .award-card, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/**
 * 图片懒加载
 * 延迟加载页面下方的图片
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * 返回顶部按钮
 * 滚动到一定位置显示返回顶部按钮
 */
function initBackToTop() {
    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        z-index: 999;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(backToTopBtn);

    // 显示/隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }, { passive: true });

    // 点击返回顶部
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 悬停效果
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'translateY(-5px)';
        backToTopBtn.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.5)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'translateY(0)';
        backToTopBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
    });
}

/**
 * 技能标签动画
 * 为技能标签添加依次显示效果
 */
function initSkillTagsAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.skill-tag');
                tags.forEach((tag, index) => {
                    tag.style.opacity = '0';
                    tag.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        tag.style.transition = 'all 0.3s ease';
                        tag.style.opacity = '1';
                        tag.style.transform = 'scale(1)';
                    }, index * 50);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category').forEach(category => {
        observer.observe(category);
    });
}

/**
 * 时间线动画
 * 时间线项目依次显示
 */
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.5s ease';
        observer.observe(item);
    });
}

/**
 * 页面加载完成后的额外初始化
 */
window.addEventListener('load', function() {
    // 初始化卡片3D效果
    initCardTilt();
    
    // 初始化返回顶部按钮
    initBackToTop();
    
    // 初始化技能标签动画
    initSkillTagsAnimation();
    
    // 初始化时间线动画
    initTimelineAnimation();
    
    // 初始化懒加载
    initLazyLoading();

    // 添加页面加载完成类
    document.body.classList.add('loaded');
});

/**
 * 性能优化：防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 性能优化：节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 响应式处理
 * 窗口大小改变时重新计算布局
 */
const handleResize = debounce(() => {
    // 关闭移动端菜单
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}, 250);

window.addEventListener('resize', handleResize);

/**
 * 键盘导航支持
 * 支持键盘用户导航
 */
document.addEventListener('keydown', function(e) {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

/**
 *  prefers-reduced-motion 支持
 * 尊重用户的动画偏好设置
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // 禁用所有动画
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-base', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}
