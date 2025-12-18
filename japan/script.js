document.addEventListener('DOMContentLoaded', () => {
    /* ===== 初期表示 (ヒーローヘッダー) のフェードイン ===== */
    const heroContent = document.querySelector('.hero-header .hero-content') || document.querySelector('.country-hero .hero-content');
    if (heroContent) {
        // ヒーローヘッダー内の .fadeup 要素を全て取得
        const heroFadeElements = heroContent.querySelectorAll('.fadeup');
        heroFadeElements.forEach((el, index) => {
            // 最初の要素は即座に、2番目の要素は少し遅れて表示
            setTimeout(() => {
                el.classList.add('visible');
            }, 100 + (index * 400)); // 少しずつ遅延させる
        });
    }

    /* ===== フェードアップ制御 (Intersection Observerで統一) ===== */
    // ヒーローヘッダー要素は初期表示で処理済みのため、ここでは含めない
    const fadeElements = document.querySelectorAll('.fadeup:not(.hero-header .hero-content .fadeup):not(.country-hero .hero-content .fadeup), .fadeup-footer');
    
    // 他のセクション用のObserver (30%見えたら発火)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 一度表示されたら監視を終了
            }
        });
    }, { 
        threshold: 0.3, 
    });

    // フッター専用のObserver (10%見えたら発火)
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                footerObserver.unobserve(entry.target); // 一度表示されたら監視を終了
            }
        });
    }, { 
        threshold: 0.1, 
    });

    fadeElements.forEach(el => {
        if (el.classList.contains('fadeup-footer')) {
            footerObserver.observe(el);
        } else {
            observer.observe(el);
        }
    });

    /* ===== スライドショー制御 (TOPページ用、各国詳細ページには不要) ===== */
    function setupSlideshow(id) {
        const slideshowEl = document.getElementById(id);
        if (!slideshowEl) return; // 要素が存在しない場合は何もしない

        const slides = slideshowEl.querySelectorAll('img');
        if (slides.length < 2) return; // 画像が1枚以下の場合は何もしない

        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 4000);
    }
    setupSlideshow('japan-slideshow');
    setupSlideshow('china-slideshow');
    setupSlideshow('usa-slideshow');


    /* ===== ハンバーガーメニュー制御 (共通) ===== */
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        // 1. ボタンクリックでメニュー開閉 (スライドイン/アウト)
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('show');
        });

        // 2. リンククリックでメニュー自動的に閉じる
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle.classList.contains('active')) {
                    // スクロール時のちらつき防止のため、わずかに遅延させる
                    setTimeout(() => {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('show');
                    }, 100); 
                }
            });
        });
    }
});
