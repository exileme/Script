// ==UserScript==
// @name         获取页面URL悬浮按钮 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面右下角添加悬浮按钮，点击获取当前页面URL
// @author       YourName
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
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
            font-size: 24px;
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

        /* URL弹窗样式 */
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

        .url-modal h2 {
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

        /* 响应式设计 */
        @media (max-width: 768px) {
            .url-floating-btn {
                width: 55px;
                height: 55px;
                font-size: 22px;
                bottom: 20px;
                right: 20px;
            }

            .url-modal-content {
                padding: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮按钮
    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'url-floating-btn';
    floatingBtn.innerHTML = '<i class="fas fa-link"></i>';
    document.body.appendChild(floatingBtn);

    // 创建URL弹窗
    const urlModal = document.createElement('div');
    urlModal.className = 'url-modal';
    urlModal.innerHTML = `
        <div class="url-modal-content">
            <h2>当前页面URL</h2>
            <div class="url-display" id="urlDisplay"></div>
            <div class="url-actions">
                <button class="url-btn copy-btn" id="copyUrlBtn">复制URL</button>
                <button class="url-btn close-btn" id="closeModalBtn">关闭</button>
            </div>
            <div class="copied-message" id="copiedMessage">URL已复制到剪贴板！</div>
        </div>
    `;
    document.body.appendChild(urlModal);

    // 获取DOM元素
    const urlDisplay = document.getElementById('urlDisplay');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const copiedMessage = document.getElementById('copiedMessage');

    // 点击悬浮按钮显示URL
    floatingBtn.addEventListener('click', function() {
        const currentUrl = window.location.href;
        /**
        * YouTuBe获取封面地址
        * URl:https://img.youtube.com/vi/62wpvzAMruE/maxresdefault.jpg
        * 其中封面ID：62wpvzAMruE
        */
        urlDisplay.textContent = currentUrl;
        urlModal.classList.add('active');
    });

    // 复制URL到剪贴板
    copyUrlBtn.addEventListener('click', function() {
        const url = urlDisplay.textContent;
        navigator.clipboard.writeText(url).then(function() {
            // 显示复制成功消息
            copiedMessage.classList.add('show');
            setTimeout(function() {
                copiedMessage.classList.remove('show');
            }, 2000);
        }).catch(function(err) {
            console.error('复制失败: ', err);
            alert('复制失败，请手动复制URL');
        });
    });

    // 关闭弹窗
    closeModalBtn.addEventListener('click', function() {
        urlModal.classList.remove('active');
    });

    // 点击弹窗外部关闭
    urlModal.addEventListener('click', function(e) {
        if (e.target === urlModal) {
            urlModal.classList.remove('active');
        }
    });

    // ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && urlModal.classList.contains('active')) {
            urlModal.classList.remove('active');
        }
    });
})();
