// ==UserScript==
// @name         获取YouTube视频ID和缩略图URL
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  获取YouTube视频ID并生成缩略图URL，完全避免TrustedHTML错误
// @author       YourName
// @match        *://*.youtube.com/*
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

    // 从URL中提取YouTube视频ID
    function getYouTubeVideoId() {
        const url = new URL(window.location.href);
        const videoId = url.searchParams.get('v');
        return videoId;
    }

    // 生成缩略图URL
    function generateThumbnailUrl(videoId) {
        if (!videoId) return null;
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
        title.textContent = 'YouTube视频信息';
        modalContent.appendChild(title);
        
        // 视频ID显示区域
        const videoIdLabel = document.createElement('p');
        videoIdLabel.textContent = '视频ID:';
        videoIdLabel.className = 'info-label';
        modalContent.appendChild(videoIdLabel);
        
        const videoIdDisplay = document.createElement('div');
        videoIdDisplay.className = 'url-display';
        videoIdDisplay.id = 'videoIdDisplay';
        modalContent.appendChild(videoIdDisplay);
        
        // 缩略图URL显示区域
        const thumbnailLabel = document.createElement('p');
        thumbnailLabel.textContent = '缩略图URL:';
        thumbnailLabel.className = 'info-label';
        modalContent.appendChild(thumbnailLabel);
        
        const thumbnailDisplay = document.createElement('div');
        thumbnailDisplay.className = 'url-display';
        thumbnailDisplay.id = 'thumbnailDisplay';
        modalContent.appendChild(thumbnailDisplay);
        
        // 缩略图预览区域
        const previewLabel = document.createElement('p');
        previewLabel.textContent = '缩略图预览:';
        previewLabel.className = 'info-label';
        modalContent.appendChild(previewLabel);
        
        const thumbnailPreview = document.createElement('div');
        thumbnailPreview.className = 'thumbnail-preview';
        thumbnailPreview.id = 'thumbnailPreview';
        modalContent.appendChild(thumbnailPreview);
        
        const urlActions = document.createElement('div');
        urlActions.className = 'url-actions';
        
        const copyVideoIdBtn = document.createElement('button');
        copyVideoIdBtn.className = 'url-btn copy-btn';
        copyVideoIdBtn.id = 'copyVideoIdBtn';
        copyVideoIdBtn.textContent = '复制视频ID';
        urlActions.appendChild(copyVideoIdBtn);
        
        const copyThumbnailBtn = document.createElement('button');
        copyThumbnailBtn.className = 'url-btn copy-btn';
        copyThumbnailBtn.id = 'copyThumbnailBtn';
        copyThumbnailBtn.textContent = '复制缩略图URL';
        urlActions.appendChild(copyThumbnailBtn);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'url-btn close-btn';
        closeBtn.id = 'closeModalBtn';
        closeBtn.textContent = '关闭';
        urlActions.appendChild(closeBtn);
        
        modalContent.appendChild(urlActions);
        
        const copiedMessage = document.createElement('div');
        copiedMessage.className = 'copied-message';
        copiedMessage.id = 'copiedMessage';
        copiedMessage.textContent = '已复制到剪贴板！';
        modalContent.appendChild(copiedMessage);
        
        urlModal.appendChild(modalContent);
        document.body.appendChild(urlModal);

        // 为按钮和弹窗绑定事件
        bindEvents(floatingBtn, urlModal);
    }

    // 绑定事件处理函数
    function bindEvents(floatingBtn, urlModal) {
        const videoIdDisplay = document.getElementById('videoIdDisplay');
        const thumbnailDisplay = document.getElementById('thumbnailDisplay');
        const thumbnailPreview = document.getElementById('thumbnailPreview');
        const copyVideoIdBtn = document.getElementById('copyVideoIdBtn');
        const copyThumbnailBtn = document.getElementById('copyThumbnailBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const copiedMessage = document.getElementById('copiedMessage');

        floatingBtn.addEventListener('click', function() {
            const videoId = getYouTubeVideoId();
            
            if (videoId) {
                videoIdDisplay.textContent = videoId;
                
                const thumbnailUrl = generateThumbnailUrl(videoId);
                thumbnailDisplay.textContent = thumbnailUrl;
                
                // 创建缩略图预览 - 完全使用DOM方法
                // 清空预览区域
                while (thumbnailPreview.firstChild) {
                    thumbnailPreview.removeChild(thumbnailPreview.firstChild);
                }
                
                const img = document.createElement('img');
                img.src = thumbnailUrl;
                img.alt = 'YouTube缩略图';
                img.className = 'thumbnail-img';
                img.onerror = function() {
                    // 如果高清缩略图不存在，尝试使用默认缩略图
                    const defaultThumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                    img.src = defaultThumbnailUrl;
                    thumbnailDisplay.textContent = defaultThumbnailUrl;
                };
                thumbnailPreview.appendChild(img);
            } else {
                videoIdDisplay.textContent = '未找到视频ID';
                thumbnailDisplay.textContent = '无法生成缩略图URL';
                
                // 清空预览区域
                while (thumbnailPreview.firstChild) {
                    thumbnailPreview.removeChild(thumbnailPreview.firstChild);
                }
                
                const noPreviewText = document.createElement('p');
                noPreviewText.textContent = '无预览可用';
                noPreviewText.className = 'no-preview-text';
                thumbnailPreview.appendChild(noPreviewText);
            }
            
            urlModal.classList.add('active');
        });

        // 复制视频ID到剪贴板
        copyVideoIdBtn.addEventListener('click', function() {
            const videoId = videoIdDisplay.textContent;
            if (videoId && videoId !== '未找到视频ID') {
                copyToClipboard(videoId, copiedMessage);
            }
        });

        // 复制缩略图URL到剪贴板
        copyThumbnailBtn.addEventListener('click', function() {
            const thumbnailUrl = thumbnailDisplay.textContent;
            if (thumbnailUrl && thumbnailUrl !== '无法生成缩略图URL') {
                copyToClipboard(thumbnailUrl, copiedMessage);
            }
        });

        function copyToClipboard(text, messageElement) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    showMessage(messageElement);
                }).catch(function(err) {
                    console.error('复制失败: ', err);
                    fallbackCopyTextToClipboard(text, messageElement);
                });
            } else {
                fallbackCopyTextToClipboard(text, messageElement);
            }
        }

        function fallbackCopyTextToClipboard(text, messageElement) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showMessage(messageElement);
            } catch (err) {
                console.error('复制失败: ', err);
                alert('复制失败，请手动复制');
            }
            document.body.removeChild(textArea);
        }

        function showMessage(messageElement) {
            messageElement.classList.add('show');
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 2000);
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
                max-width: 600px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                color: #333;
                text-align: center;
            }
            
            .url-modal-content h2 {
                margin-bottom: 20px;
                color: #ff6b6b;
            }
            
            .info-label {
                text-align: left;
                font-weight: bold;
                margin: 15px 0 5px 0;
                color: #555;
            }
            
            .url-display {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 10px;
                word-break: break-all;
                font-family: monospace;
                text-align: left;
                max-height: 80px;
                overflow-y: auto;
                font-size: 14px;
            }
            
            .thumbnail-preview {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 150px;
            }
            
            .thumbnail-img {
                max-width: 100%;
                max-height: 200px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .no-preview-text {
                color: #888;
                font-style: italic;
            }
            
            .url-actions {
                display: flex;
                flex-wrap: wrap;
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
                flex: 1;
                min-width: 120px;
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
                
                .url-actions {
                    flex-direction: column;
                }
                
                .url-btn {
                    width: 100%;
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
