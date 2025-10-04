// ==UserScript==
// @name         获取页面URL悬浮按钮 (TrustedHTML修复版)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在页面右下角添加悬浮按钮，点击获取当前页面URL，完全避免TrustedHTML错误
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建SVG链接图标
    function createLinkIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "white");
        path.setAttribute("d", "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z");
        
        svg.appendChild(path);
        return svg;
    }

    // 创建悬浮按钮和弹窗的函数
    function createFloatingButton() {
        // 如果按钮已存在，先移除
        const existingBtn = document.querySelector('.url-floating-btn');
        if (existingBtn) existingBtn.remove();
        const existingModal = document.querySelector('.url-modal');
        if (existingModal) existingModal.remove();

        // 创建悬浮按钮
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'url-floating-btn';
        
        // 使用安全的SVG图标创建方法
        const icon = createLinkIcon();
        floatingBtn.appendChild(icon);
        
        document.body.appendChild(floatingBtn);

        // 创建URL弹窗 - 完全使用DOM操作方法
        const urlModal = document.createElement('div');
        urlModal.className = 'url-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'url-modal-content';
        
        const title = document.createElement('h2');
        title.textContent = '当前页面URL';
        modalContent.appendChild(title);
        
        const urlDisplay = document.createElement('div');
        urlDisplay.className = 'url-display';
        urlDisplay.id = 'urlDisplay';
        modalContent.appendChild(urlDisplay);
        
        const urlActions = document.createElement('div');
        urlActions.className = 'url-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'url-btn copy-btn';
        copyBtn.id = 'copyUrlBtn';
        copyBtn.textContent = '复制URL';
        urlActions.appendChild(copyBtn);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'url-btn close-btn';
        closeBtn.id = 'closeModalBtn';
        closeBtn.textContent = '关闭';
        urlActions.appendChild(closeBtn);
        
        modalContent.appendChild(urlActions);
        
        const copiedMessage = document.createElement('div');
        copiedMessage.className = 'copied-message';
        copiedMessage.id = 'copiedMessage';
        copiedMessage.textContent = 'URL已复制到剪贴板！';
        modalContent.appendChild(copiedMessage);
        
        urlModal.appendChild(modalContent);
        document.body.appendChild(urlModal);

        // 为按钮和弹窗绑定事件
        bindEvents(floatingBtn, urlModal);
    }

    // 绑定事件处理函数
    function bindEvents(floatingBtn, urlModal) {
        const urlDisplay = document.getElementById('urlDisplay');
        const copyUrlBtn = document.getElementById('copyUrlBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const copiedMessage = document.getElementById('copiedMessage');

        floatingBtn.addEventListener('click', function() {
            const currentUrl = window.location.href;
            urlDisplay.textContent = currentUrl;
            urlModal.classList.add('active');
        });

        // 复制URL到剪贴板
        copyUrlBtn.addEventListener('click', function() {
            const url = urlDisplay.textContent;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function() {
                    copiedMessage.classList.add('show');
                    setTimeout(() => copiedMessage.classList.remove('show'), 2000);
                }).catch(function(err) {
                    console.error('复制失败: ', err);
                    fallbackCopyTextToClipboard(url);
                });
            } else {
                fallbackCopyTextToClipboard(url);
            }
        });

        function fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                copiedMessage.classList.add('show');
                setTimeout(() => copiedMessage.classList.remove('show'), 2000);
            } catch (err) {
                console.error('复制失败: ', err);
                alert('复制失败，请手动复制URL');
            }
            document.body.removeChild(textArea);
        }

        closeModalBtn.addEventListener('click', function() {
            urlModal.classList.remove('active');
        });

        urlModal.addEventListener('click', function(e) {
            if (e.target === urlModal) {
                urlModal.classList.remove('active');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && urlModal.classList.contains('active')) {
                urlModal.classList.remove('active');
            }
        });
    }

    // 添加样式
    addStyles();

    function addStyles() {
        // 检查是否已存在样式，避免重复添加
        if (document.getElementById('url-floating-btn-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'url-floating-btn-styles';
        style.textContent = `
            .url-floating-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                z-index: 10000;
                user-select: none;
            }
            
            .url-floating-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
            }
            
            .url-floating-btn:active {
                transform: scale(0.95);
            }
            
            .url-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .url-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .url-modal-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                color: #333;
                text-align: center;
            }
            
            .url-modal-content h2 {
                margin-bottom: 20px;
                color: #ff6b6b;
            }
            
            .url-display {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
                word-break: break-all;
                font-family: monospace;
                text-align: left;
                max-height: 150px;
                overflow-y: auto;
            }
            
            .url-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            
            .url-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .copy-btn {
                background: #4facfe;
                color: white;
            }
            
            .copy-btn:hover {
                background: #3a9bf7;
            }
            
            .close-btn {
                background: #e0e0e0;
                color: #333;
            }
            
            .close-btn:hover {
                background: #d0d0d0;
            }
            
            .copied-message {
                margin-top: 10px;
                color: #4caf50;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .copied-message.show {
                opacity: 1;
            }
            
            @media (max-width: 768px) {
                .url-floating-btn {
                    width: 55px;
                    height: 55px;
                    bottom: 20px;
                    right: 20px;
                }
                
                .url-modal-content {
                    padding: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 监听URL变化以处理SPA导航
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    });
    
    // 启动监听
    observer.observe(document, { subtree: true, childList: true });

    function onUrlChange() {
        // URL变化时重新创建悬浮按钮
        createFloatingButton();
    }

    // 初始创建悬浮按钮
    createFloatingButton();
})();
