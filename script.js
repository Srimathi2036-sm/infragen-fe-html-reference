// ==========================================
// GLOBAL VIDEO POPUP MODAL CONTROLLERS
// ==========================================
window.openVideoModal = function() {
  const videoModal = document.getElementById('hero-video-modal');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  if (videoModal) {
    videoModal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    videoModal.classList.add('flex');
    setTimeout(() => {
      videoModal.classList.remove('opacity-0', 'pointer-events-none');
    }, 10);
    if (modalVideoPlayer) {
      modalVideoPlayer.currentTime = 0;
      modalVideoPlayer.play().catch(e => console.log('Video play error:', e));
    }
    document.body.style.overflow = 'hidden';
  }
};

window.closeVideoModal = function() {
  const videoModal = document.getElementById('hero-video-modal');
  const modalVideoPlayer = document.getElementById('modal-video-player');
  if (videoModal) {
    videoModal.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      videoModal.classList.add('hidden');
      videoModal.classList.remove('flex');
    }, 300);
    if (modalVideoPlayer) {
      modalVideoPlayer.pause();
    }
    document.body.style.overflow = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. HERO DAYLIGHT CAROUSEL CONTROLLER
  // ==========================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrevBtn = document.getElementById('hero-prev');
  const heroNextBtn = document.getElementById('hero-next');
  let currentHeroSlide = 0;
  let heroInterval = null;

  function setHeroSlide(index) {
    if (!heroSlides.length) return;
    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, idx) => {
      if (idx === currentHeroSlide) {
        slide.classList.remove('opacity-0', 'z-0');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'z-0');
      }
    });

    heroDots.forEach((dot, idx) => {
      if (idx === currentHeroSlide) {
        dot.className = 'hero-dot w-8 h-2 rounded-full bg-[#c5a880] transition-all duration-300 cursor-pointer';
      } else {
        dot.className = 'hero-dot w-2 h-2 rounded-full bg-white/40 hover:bg-white/80 transition-all duration-300 cursor-pointer';
      }
    });

    // Re-trigger text float-down and float-up animations on every slide change
    const animatedElements = document.querySelectorAll('#home .animate-float-down, #home .animate-float-up');
    animatedElements.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // trigger DOM reflow
      el.style.animation = '';
    });
  }

  function startHeroAutoplay() {
    stopHeroAutoplay();
    heroInterval = setInterval(() => {
      setHeroSlide(currentHeroSlide + 1);
    }, 4500);
  }

  function stopHeroAutoplay() {
    if (heroInterval) clearInterval(heroInterval);
  }

  if (heroSlides.length > 0) {
    setHeroSlide(0);
    startHeroAutoplay();

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', () => {
        setHeroSlide(currentHeroSlide - 1);
        startHeroAutoplay();
      });
    }

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', () => {
        setHeroSlide(currentHeroSlide + 1);
        startHeroAutoplay();
      });
    }

    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        setHeroSlide(idx);
        startHeroAutoplay();
      });
    });

    window.setHeroSlide = (idx) => {
      setHeroSlide(idx);
      startHeroAutoplay();
    };
    window.prevHeroSlide = () => {
      setHeroSlide(currentHeroSlide - 1);
      startHeroAutoplay();
    };
    window.nextHeroSlide = () => {
      setHeroSlide(currentHeroSlide + 1);
      startHeroAutoplay();
    };
  }

  const openVideoBtns = document.querySelectorAll('#open-hero-video, #open-hero-video-lg, #open-video-modal, .hero-play-btn');
  const closeVideoBtn = document.getElementById('close-video-modal');
  const videoModal = document.getElementById('hero-video-modal');

  openVideoBtns.forEach(btn => btn.addEventListener('click', window.openVideoModal));
  if (closeVideoBtn) closeVideoBtn.addEventListener('click', window.closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) window.closeVideoModal();
    });
  }
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) window.closeVideoModal();
    });
  }

  // ==========================================
  // 2. SCROLL REVEAL (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after revealing to maintain performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 2B. END-TO-END PROCESS PROGRESSIVE DRAW CONTROLLER
  // ==========================================
  const processSection = document.getElementById('process');
  const drawLine = document.getElementById('serpentine-main-path') || document.querySelector('.serpentine-draw-line');
  const pathTip = document.getElementById('serpentine-path-tip');
  const processNodes = document.querySelectorAll('.process-step-node');

  if (processSection && drawLine) {
    const totalLength = drawLine.getTotalLength ? drawLine.getTotalLength() : 2146;
    drawLine.style.strokeDasharray = totalLength;
    drawLine.style.strokeDashoffset = totalLength;

    // Relative progress thresholds along path for Steps 1-8
    const stepThresholds = [0.037, 0.154, 0.270, 0.387, 0.613, 0.730, 0.846, 0.963];
    let animationStarted = false;

    function runSerpentineAnimation() {
      const startTime = performance.now();
      const duration = 8000; // 8.0 seconds relaxed smooth draw time (decreased arrow speed)

      function animateStep(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const distance = totalLength * progress;

        // Update SVG stroke-dashoffset synchronously with progress
        drawLine.style.strokeDashoffset = totalLength * (1 - progress);

        // Update Moving Path Tip position & rotation angle around U-turn curve
        if (pathTip && drawLine.getPointAtLength) {
          const pt = drawLine.getPointAtLength(distance);
          const ptNext = drawLine.getPointAtLength(Math.min(distance + 2, totalLength));
          const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI);

          pathTip.setAttribute('transform', `translate(${pt.x}, ${pt.y}) rotate(${angle})`);
        }

        // Reveal step simultaneously when line tip touches its threshold
        processNodes.forEach((node, index) => {
          if (progress >= stepThresholds[index]) {
            node.classList.add('step-visible');
          }
        });

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        }
      }

      requestAnimationFrame(animateStep);
    }

    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;
          processSection.classList.add('process-active');
          runSerpentineAnimation();
          processObserver.unobserve(processSection);
        }
      });
    }, { threshold: 0.25 });

    processObserver.observe(processSection);
  }

  // ==========================================
  // 3. WHY CHOOSE US - HORIZONTAL SCROLL CAROUSEL TRACK
  // ==========================================
  const scrollTrack = document.getElementById('why-choose-scroll-track');
  const prevBtn = document.getElementById('why-choose-prev-btn');
  const nextBtn = document.getElementById('why-choose-next-btn');

  if (scrollTrack && prevBtn && nextBtn) {
    const cardWidth = 380; // approximate width of card + gap

    function updateWhyChooseArrows() {
      const tolerance = 8;
      const maxScroll = Math.max(0, scrollTrack.scrollWidth - scrollTrack.clientWidth);
      const isAtStart = scrollTrack.scrollLeft <= tolerance;
      const isAtEnd = scrollTrack.scrollLeft >= maxScroll - tolerance;

      // Update Prev / Back Button
      prevBtn.disabled = isAtStart;
      if (isAtStart) {
        prevBtn.classList.add('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
        prevBtn.classList.remove('cursor-pointer');
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.classList.remove('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
        prevBtn.classList.add('cursor-pointer');
        prevBtn.setAttribute('aria-disabled', 'false');
      }

      // Update Next / Front Button
      nextBtn.disabled = isAtEnd;
      if (isAtEnd) {
        nextBtn.classList.add('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
        nextBtn.classList.remove('cursor-pointer');
        nextBtn.setAttribute('aria-disabled', 'true');
      } else {
        nextBtn.classList.remove('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
        nextBtn.classList.add('cursor-pointer');
        nextBtn.setAttribute('aria-disabled', 'false');
      }
    }

    prevBtn.addEventListener('click', () => {
      scrollTrack.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
      setTimeout(updateWhyChooseArrows, 320);
    });

    nextBtn.addEventListener('click', () => {
      scrollTrack.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
      setTimeout(updateWhyChooseArrows, 320);
    });

    scrollTrack.addEventListener('scroll', updateWhyChooseArrows, { passive: true });
    window.addEventListener('resize', updateWhyChooseArrows);
    setTimeout(updateWhyChooseArrows, 150);
  }

  // ==========================================
  // 4. CONSTANT NAVBAR (Maintains #381e23 Luxury Brown Background Across All Sections)
  // ==========================================

  // ==========================================
  // 5. INQUIRY FORM MAIL & CONTACT HANDLER WITH VALIDATION
  // ==========================================
  const inquiryForm = document.getElementById('inquiry-form');
  const successToast = document.getElementById('success-toast');

  if (inquiryForm) {
    const nameInput = document.getElementById('inquiry-name');
    const nameWrapper = document.getElementById('inquiry-name-wrapper');
    const nameError = document.getElementById('inquiry-name-error');

    const emailInput = document.getElementById('inquiry-email');
    const emailWrapper = document.getElementById('inquiry-email-wrapper');
    const emailError = document.getElementById('inquiry-email-error');

    const phoneInput = document.getElementById('inquiry-phone');
    const phoneWrapper = document.getElementById('inquiry-phone-wrapper');
    const phoneError = document.getElementById('inquiry-phone-error');

    function setFieldError(wrapper, errorEl, message) {
      if (!wrapper || !errorEl) return;
      if (message) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        wrapper.classList.add('!border-red-500', '!ring-2', '!ring-red-500/20');
        wrapper.classList.remove('!border-emerald-500/60');
      } else {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
        wrapper.classList.remove('!border-red-500', '!ring-2', '!ring-red-500/20');
        wrapper.classList.add('!border-emerald-500/60');
      }
    }

    function clearFieldError(wrapper, errorEl) {
      if (!wrapper || !errorEl) return;
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
      wrapper.classList.remove('!border-red-500', '!ring-2', '!ring-red-500/20', '!border-emerald-500/60');
    }

    function validateNameField(isTyping = false) {
      if (!nameInput) return true;
      const raw = nameInput.value;
      const val = raw.trim();

      // Instantly detect numbers typed into name
      if (/\d/.test(raw)) {
        setFieldError(nameWrapper, nameError, 'Name does not contain number');
        return false;
      }

      if (isTyping) {
        if (!nameError.classList.contains('hidden') && nameError.textContent === 'Name does not contain number' && !/\d/.test(raw)) {
          clearFieldError(nameWrapper, nameError);
        }
        return true;
      }

      if (!val) {
        setFieldError(nameWrapper, nameError, 'Please enter your name.');
        return false;
      }
      if (val.length < 2) {
        setFieldError(nameWrapper, nameError, 'Name must be at least 2 characters.');
        return false;
      }
      if (!/^[a-zA-Z\s\.\'-]{2,50}$/.test(val)) {
        setFieldError(nameWrapper, nameError, 'Name does not contain number');
        return false;
      }
      clearFieldError(nameWrapper, nameError);
      return true;
    }

    function validateEmailField(isTyping = false) {
      if (!emailInput) return true;
      const val = emailInput.value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (isTyping) {
        if (!emailError.classList.contains('hidden') && emailRegex.test(val)) {
          clearFieldError(emailWrapper, emailError);
        }
        return true;
      }
      if (!val) {
        setFieldError(emailWrapper, emailError, 'Please enter your email address.');
        return false;
      }
      if (!emailRegex.test(val)) {
        setFieldError(emailWrapper, emailError, 'Please enter a valid email address.');
        return false;
      }
      clearFieldError(emailWrapper, emailError);
      return true;
    }

    function validatePhoneField(isTyping = false) {
      if (!phoneInput) return true;
      const raw = phoneInput.value;
      const val = raw.trim();

      // Instantly detect characters/letters typed into phone number
      if (/[a-zA-Z]/.test(raw)) {
        setFieldError(phoneWrapper, phoneError, 'Phone number does not contain characters');
        return false;
      }

      if (isTyping) {
        if (!phoneError.classList.contains('hidden') && phoneError.textContent === 'Phone number does not contain characters' && !/[a-zA-Z]/.test(raw)) {
          clearFieldError(phoneWrapper, phoneError);
        }
        return true;
      }

      if (!val) {
        setFieldError(phoneWrapper, phoneError, 'Please enter your phone number.');
        return false;
      }
      const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
      if (!phoneRegex.test(val.replace(/[\s\-\(\)]/g, ''))) {
        setFieldError(phoneWrapper, phoneError, 'Please enter a valid 10-digit mobile number.');
        return false;
      }
      clearFieldError(phoneWrapper, phoneError);
      return true;
    }

    // Real-time live validation on input and blur
    if (nameInput) {
      nameInput.addEventListener('input', () => validateNameField(true));
      nameInput.addEventListener('blur', () => validateNameField(false));
    }
    if (emailInput) {
      emailInput.addEventListener('input', () => validateEmailField(true));
      emailInput.addEventListener('blur', () => validateEmailField(false));
    }
    if (phoneInput) {
      phoneInput.addEventListener('input', () => validatePhoneField(true));
      phoneInput.addEventListener('blur', () => validatePhoneField(false));
    }

    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateNameField(true);
      const isEmailValid = validateEmailField(true);
      const isPhoneValid = validatePhoneField(true);

      if (!isNameValid || !isEmailValid || !isPhoneValid) {
        if (!isNameValid && nameInput) nameInput.focus();
        else if (!isEmailValid && emailInput) emailInput.focus();
        else if (!isPhoneValid && phoneInput) phoneInput.focus();
        return;
      }

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const messageEl = document.getElementById('inquiry-message') || document.getElementById('inquiry-msg');
      const customMsg = messageEl ? messageEl.value.trim() : '';

      const constantToEmail = 'srissa2006@gmail.com';
      const defaultMessage = "Hii! I'm interested can I know about more details";
      const finalMessage = customMsg !== '' ? customMsg : defaultMessage;

      const subject = encodeURIComponent(`Property Inquiry from ${name || 'Client'} - Vizhi Infragen`);
      const body = encodeURIComponent(`${finalMessage}\n\n---\nClient Contact Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`);

      const mailtoUrl = `mailto:${constantToEmail}?subject=${subject}&body=${body}`;

      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Opening Mail...`;
      }

      // Open user's default email application with prefilled fields
      window.location.href = mailtoUrl;

      setTimeout(() => {
        if (successToast) {
          successToast.classList.remove('translate-y-24', 'opacity-0');
          successToast.classList.add('translate-y-0', 'opacity-100');

          setTimeout(() => {
            successToast.classList.remove('translate-y-0', 'opacity-100');
            successToast.classList.add('translate-y-24', 'opacity-0');
          }, 4000);
        }

        inquiryForm.reset();
        clearFieldError(nameWrapper, nameError);
        clearFieldError(emailWrapper, emailError);
        clearFieldError(phoneWrapper, phoneError);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 1000);
    });
  }

  // ==========================================
  // 5.5 PROPERTY CARD IMAGE CAROUSEL / SLIDER
  // ==========================================
  const propertyCards = document.querySelectorAll('.property-card');

  const cardGalleries = [
    ['assets/images/plot-layout-1.jpg', 'assets/images/plot-layout-2.jpg', 'assets/images/plot-layout-3.jpg', 'assets/images/land-development.jpg'],
    ['assets/images/plot-layout-2.jpg', 'assets/images/plot-layout-1.jpg', 'assets/images/plot-layout-3.jpg', 'assets/images/about-property-management.jpg'],
    ['assets/images/plot-layout-3.jpg', 'assets/images/plot-layout-1.jpg', 'assets/images/plot-layout-2.jpg', 'assets/images/experience.jpg'],
    ['assets/images/land-development.jpg', 'assets/images/plot-layout-1.jpg', 'assets/images/plot-layout-2.jpg', 'assets/images/hero-1.jpg'],
    ['assets/images/about-property-management.jpg', 'assets/images/plot-layout-3.jpg', 'assets/images/plot-layout-1.jpg', 'assets/images/hero-3.jpg'],
    ['assets/images/hero-2.jpg', 'assets/images/plot-layout-1.jpg', 'assets/images/plot-layout-2.jpg', 'assets/images/hero-4.jpg']
  ];

  propertyCards.forEach((card, index) => {
    const prevBtn = card.querySelector('.card-prev-btn');
    const nextBtn = card.querySelector('.card-next-btn');
    const imgEl = card.querySelector('.property-slider-img');
    const dots = card.querySelectorAll('.dot-indicator');
    const gallery = cardGalleries[index % cardGalleries.length];

    let currentIndex = 0;

    function updateCardImage(newIndex) {
      if (!imgEl || !gallery.length) return;
      currentIndex = (newIndex + gallery.length) % gallery.length;

      imgEl.style.opacity = '0.4';
      imgEl.src = gallery[currentIndex];
      setTimeout(() => {
        imgEl.style.opacity = '1';
      }, 200);

      dots.forEach((dot, dotIdx) => {
        if (dotIdx === currentIndex) {
          dot.classList.add('opacity-100');
          dot.classList.remove('opacity-40');
        } else {
          dot.classList.remove('opacity-100');
          dot.classList.add('opacity-40');
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCardImage(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCardImage(currentIndex + 1);
      });
    }
  });

  // ==========================================
  // 5.6 BUILT ON EXPERIENCE AUTOMATIC IMAGE CAROUSEL (1 SECOND FAST CYCLE)
  // ==========================================
  const trustImages = document.querySelectorAll('.trust-carousel-img');
  if (trustImages.length > 0) {
    let trustIndex = 0;
    setInterval(() => {
      trustImages[trustIndex].classList.add('opacity-0');
      trustImages[trustIndex].classList.remove('opacity-100');
      trustIndex = (trustIndex + 1) % trustImages.length;
      trustImages[trustIndex].classList.remove('opacity-0');
      trustImages[trustIndex].classList.add('opacity-100');
    }, 1000); // 1 second rapid change
  }

  // ==========================================
  // 6. SIDE DRAWER TOGGLE (3-LINE MENU OVERLAY)
  // ==========================================
  const openDrawerBtn = document.getElementById('open-side-drawer');
  const closeDrawerBtn = document.getElementById('close-side-drawer');
  const sideDrawer = document.getElementById('side-drawer');
  const drawerOverlay = document.getElementById('side-drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (sideDrawer && drawerOverlay) {
      sideDrawer.classList.remove('translate-x-full');
      drawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (sideDrawer && drawerOverlay) {
      sideDrawer.classList.add('translate-x-full');
      drawerOverlay.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    }
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // ==========================================
  // CONSTANT SOLID LUXURY BROWN NAVBAR (#381e23)
  // ==========================================

  // ==========================================
  // SERVICE CARDS 3D FLIP ON TOUCH / CLICK
  // ==========================================
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Toggle 3D flip class for touch interaction
      card.classList.toggle('flipped');
    });
  });

  // ==========================================
  // STATS COUNTER ANIMATION
  // Only starts counting when user scrolls down to the stats bar
  // ==========================================
  (function() {
    var statsBar = document.getElementById('stats-counter-bar');
    var statCounters = document.querySelectorAll('.stat-counter');
    var hasAnimated = false;

    if (!statsBar || statCounters.length === 0) return;

    // Always reset to 0 on page load
    statCounters.forEach(function(el) {
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = '0' + suffix;
    });

    function isInViewport(el) {
      var rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight - 50 && rect.bottom > 50;
    }

    function countUp(el, target, suffix, delay) {
      setTimeout(function() {
        var current = 0;
        var stepTime = 30; // ms between each tick
        var timer = setInterval(function() {
          var remaining = target - current;
          var increment = Math.max(1, Math.ceil(remaining / 10));
          current = Math.min(current + increment, target);
          el.textContent = current + suffix;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          }
        }, stepTime);
      }, delay);
    }

    function startAnimation() {
      if (hasAnimated) return;
      hasAnimated = true;

      // Reset to 0 before animating
      statCounters.forEach(function(el) {
        var suffix = el.getAttribute('data-suffix') || '';
        el.textContent = '0' + suffix;
      });

      // Start each counter with a stagger
      statCounters.forEach(function(el, i) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        countUp(el, target, suffix, i * 250);
      });
    }

    // Listen on scroll — only trigger when stats bar enters the viewport
    function onScroll() {
      if (isInViewport(statsBar)) {
        startAnimation();
        window.removeEventListener('scroll', onScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // ==========================================
  // SERVICES SLIDER WITH CONTINUOUS RUNNABLE ANIMATION & INTERACTIVE ARROW CONTROLS
  // ==========================================
  const servicesTrack = document.getElementById('services-track');
  const servicesPrevBtn = document.getElementById('services-track-left');
  const servicesNextBtn = document.getElementById('services-track-right');

  if (servicesTrack && (servicesPrevBtn || servicesNextBtn)) {
    const getStep = () => {
      const firstCard = servicesTrack.querySelector('.service-float-card');
      return firstCard ? firstCard.offsetWidth + 24 : 390;
    };

    let lastStart = null;
    let lastEnd = null;

    function updateServicesArrows() {
      const tolerance = 8;
      const maxScroll = Math.max(0, servicesTrack.scrollWidth - servicesTrack.clientWidth);
      const currentScroll = servicesTrack.scrollLeft;

      const isAtStart = currentScroll <= tolerance;
      const isAtEnd = currentScroll >= maxScroll - tolerance;

      if (isAtStart === lastStart && isAtEnd === lastEnd) return;
      lastStart = isAtStart;
      lastEnd = isAtEnd;

      if (servicesPrevBtn) {
        servicesPrevBtn.disabled = isAtStart;
        if (isAtStart) {
          servicesPrevBtn.classList.add('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
          servicesPrevBtn.classList.remove('cursor-pointer');
          servicesPrevBtn.setAttribute('aria-disabled', 'true');
        } else {
          servicesPrevBtn.classList.remove('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
          servicesPrevBtn.classList.add('cursor-pointer');
          servicesPrevBtn.setAttribute('aria-disabled', 'false');
        }
      }

      if (servicesNextBtn) {
        servicesNextBtn.disabled = isAtEnd;
        if (isAtEnd) {
          servicesNextBtn.classList.add('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
          servicesNextBtn.classList.remove('cursor-pointer');
          servicesNextBtn.setAttribute('aria-disabled', 'true');
        } else {
          servicesNextBtn.classList.remove('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
          servicesNextBtn.classList.add('cursor-pointer');
          servicesNextBtn.setAttribute('aria-disabled', 'false');
        }
      }
    }

    // Interactive arrow clicks smoothly move cards
    if (servicesPrevBtn) {
      servicesPrevBtn.addEventListener('click', () => {
        pauseAutoRun(6000);
        servicesTrack.style.scrollBehavior = 'smooth';
        servicesTrack.scrollBy({ left: -getStep(), behavior: 'smooth' });
        setTimeout(updateServicesArrows, 350);
      });
    }

    if (servicesNextBtn) {
      servicesNextBtn.addEventListener('click', () => {
        pauseAutoRun(6000);
        servicesTrack.style.scrollBehavior = 'smooth';
        servicesTrack.scrollBy({ left: getStep(), behavior: 'smooth' });
        setTimeout(updateServicesArrows, 350);
      });
    }

    servicesTrack.addEventListener('scroll', updateServicesArrows, { passive: true });
    window.addEventListener('resize', updateServicesArrows);

    // Continuous Runnable Auto-Scroll Animation (60FPS smooth continuous glide)
    let isPaused = false;
    let pauseTimeout = null;
    let autoRunRAF = null;
    const runSpeed = 0.85; // smooth gliding speed in pixels per frame

    function pauseAutoRun(duration = 5000) {
      isPaused = true;
      if (pauseTimeout) clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        isPaused = false;
      }, duration);
    }

    servicesTrack.addEventListener('mouseenter', () => { isPaused = true; });
    servicesTrack.addEventListener('mouseleave', () => { pauseAutoRun(1200); });
    servicesTrack.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
    servicesTrack.addEventListener('touchend', () => { pauseAutoRun(2500); }, { passive: true });

    function autoRunStep() {
      if (!isPaused && servicesTrack) {
        const maxScroll = Math.max(0, servicesTrack.scrollWidth - servicesTrack.clientWidth);
        if (maxScroll > 10) {
          if (servicesTrack.scrollLeft >= maxScroll - 4) {
            // Reached the end! Front arrow disables
            updateServicesArrows();
            isPaused = true;
            // Pause 3 seconds at the end, then smoothly rewind to start
            setTimeout(() => {
              servicesTrack.style.scrollBehavior = 'smooth';
              servicesTrack.scrollTo({ left: 0, behavior: 'smooth' });
              setTimeout(() => {
                isPaused = false;
                updateServicesArrows();
              }, 900);
            }, 3000);
          } else {
            servicesTrack.style.scrollBehavior = 'auto';
            servicesTrack.scrollLeft += runSpeed;
            updateServicesArrows();
          }
        }
      }
      autoRunRAF = requestAnimationFrame(autoRunStep);
    }

    // Start running animation
    autoRunRAF = requestAnimationFrame(autoRunStep);

    // Initial arrow state
    setTimeout(updateServicesArrows, 150);
  }

});


