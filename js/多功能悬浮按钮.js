// ==UserScript==
// @name         多功能悬浮按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一个美观且功能丰富的悬浮按钮，包含多种交互效果和实用功能
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-floating-btn-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 10000;
        }

        .custom-floating-btn {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            position: relative;
            user-select: none;
        }

        .custom-floating-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
        }

        .custom-floating-btn.active {
            transform: rotate(45deg);
            background: linear-gradient(135deg, #4facfe, #00f2fe);
        }

        .custom-floating-menu {
            position: absolute;
            bottom: 70px;
            right: 0;
            display: flex;
            flex-direction: column;
            gap: 15px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.4s ease;
        }

        .custom-floating-menu.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .custom-menu-item {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            position: relative;
        }

        .custom-menu-item:hover {
            transform: scale(1.15);
        }

        .custom-menu-item:nth-child(1) {
            background: linear-gradient(135deg, #42e695, #3bb2b8);
            transition-delay: 0.1s;
        }

        .custom-menu-item:nth-child(2) {
            background: linear-gradient(135deg, #ffd89b, #19547b);
            transition-delay: 0.2s;
        }

        .custom-menu-item:nth-child(3) {
            background: linear-gradient(135deg, #834d9b, #d04ed6);
            transition-delay: 0.3s;
        }

        .custom-menu-item:nth-child(4) {
            background: linear-gradient(135deg, #4568dc, #b06ab3);
            transition-delay: 0.4s;
        }

        .custom-menu-item .custom-tooltip {
            position: absolute;
            right: 60px;
            background: rgba(0, 0, 0, 0.7);
            padding: 8px 15px;
            border-radius: 10px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            color: white;
        }

        .custom-menu-item:hover .custom-tooltip {
            opacity: 1;
            visibility: visible;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .custom-floating-btn-container {
                bottom: 20px;
                right: 20px;
            }

            .custom-floating-btn {
                width: 55px;
                height: 55px;
                font-size: 22px;
            }

            .custom-menu-item {
                width: 45px;
                height: 45px;
                font-size: 18px;
            }
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮按钮
    const container = document.createElement('div');
    container.className = 'custom-floating-btn-container';

    const floatingMenu = document.createElement('div');
    floatingMenu.className = 'custom-floating-menu';

    // 创建菜单项
    const menuItems = [
        { icon: 'fas fa-home', tooltip: '首页' },
        { icon: 'fas fa-search', tooltip: '搜索' },
        { icon: 'fas fa-share-alt', tooltip: '分享' },
        { icon: 'fas fa-cog', tooltip: '设置' }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'custom-menu-item';

        const icon = document.createElement('i');
        icon.className = item.icon;

        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = item.tooltip;

        menuItem.appendChild(icon);
        menuItem.appendChild(tooltip);
        floatingMenu.appendChild(menuItem);
    });

    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'custom-floating-btn';

    const plusIcon = document.createElement('i');
    plusIcon.className = 'fas fa-plus';
    floatingBtn.appendChild(plusIcon);

    container.appendChild(floatingMenu);
    container.appendChild(floatingBtn);
    document.body.appendChild(container);

    // 添加功能
    let isDragging = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    // 切换菜单显示/隐藏
    floatingBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        floatingMenu.classList.toggle('active');
    });

    // 菜单项点击事件
    floatingMenu.querySelectorAll('.custom-menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const tooltip = this.querySelector('.custom-tooltip').textContent;
            alert(`您点击了: ${tooltip}`);
            floatingBtn.classList.remove('active');
            floatingMenu.classList.remove('active');
        });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function() {
        floatingBtn.classList.remove('active');
        floatingMenu.classList.remove('active');
    });

    // 拖拽功能
    container.addEventListener("mousedown", dragStart);
    container.addEventListener("touchstart", dragStart);

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === floatingBtn || e.target === floatingBtn.querySelector('i')) {
            isDragging = true;

            // 关闭菜单
            floatingBtn.classList.remove('active');
            floatingMenu.classList.remove('active');
        }

        document.addEventListener("mousemove", drag);
        document.addEventListener("touchmove", drag);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, container);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;

        document.removeEventListener("mousemove", drag);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("mouseup", dragEnd);
        document.removeEventListener("touchend", dragEnd);
    }

    // 加载Font Awesome图标库
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(faLink);
})();
