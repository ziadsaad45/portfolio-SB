const Store = {
  state: {
    language: localStorage.getItem('language') || 'ar',
  },

  listeners: [],

  subscribe(listener) {
    this.listeners.push(listener);
  },

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  },

  setLanguage(lang) {
    this.state.language = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.notify();
    // Re-render the current route
    if (window.router) {
      window.router.handleRoute();
    }
    // Update Components
    renderHeader();
    renderFooter();
  },

  toggleLanguage() {
    const newLang = this.state.language === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  },

  t(ar, en) {
    return this.state.language === 'ar' ? ar : en;
  }
};

// Initial setup
document.documentElement.lang = Store.state.language;
document.documentElement.dir = Store.state.language === 'ar' ? 'rtl' : 'ltr';
function renderHeader() {
  const t = (ar, en) => Store.t(ar, en);
  const lang = Store.state.language;

  const navLinks = [
    { path: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
    { path: '/products', labelAr: 'المنتجات', labelEn: 'Products' },
    { path: '/trusted-by', labelAr: 'شركاء النجاح', labelEn: 'Trusted Partners' },
    { path: '/providers', labelAr: 'العلامات التجارية', labelEn: 'Brands' },
    { path: '/services', labelAr: 'الخدمات', labelEn: 'Services' },
    { path: '/faq', labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ' },
    { path: '/about', labelAr: 'من نحن', labelEn: 'About Us' },
    { path: '/contact', labelAr: 'تواصل معنا', labelEn: 'Contact' }
  ];

  const currentPath = window.location.hash.slice(1) || '/';
  const isActive = (path) => currentPath === path;

  const headerHtml = `
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <a href="#/" class="flex items-center gap-3">
          <div class="w-14 h-14 flex items-center justify-center">
            <img
              src="./images/logo.jpeg"
              alt="Smart Business Logo"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="hidden md:flex flex-col">
            <span class="text-xl font-bold text-gray-900">
              ${t('سمارت بيزنس', 'Smart Business')}
            </span>
            <span class="text-xs text-gray-600">
              ${t('حلول السلامة الكهربائية', 'Electrical Safety Solutions')}
            </span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-4">
          ${navLinks.map(link => `
            <a
              href="#${link.path}"
              class="text-sm font-medium transition-colors hover:text-blue-600 ${isActive(link.path) ? 'text-blue-600' : 'text-gray-700'}"
            >
              ${t(link.labelAr, link.labelEn)}
            </a>
          `).join('')}
        </nav>

        <!-- Search Bar (Desktop) -->
        <form onsubmit="handleSearch(event)" class="hidden lg:flex items-center gap-2 flex-1 max-w-xs mx-4">
          <div class="relative flex-1">
            <input
              type="text"
              name="q"
              placeholder="${t('ابحث عن منتجات...', 'Search for products...')}"
              class="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none text-sm"
              style="direction: ${lang === 'ar' ? 'rtl' : 'ltr'}"
            />
            <button
              type="submit"
              class="absolute ${lang === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="${t('بحث', 'Search')}"
            >
              <i data-lucide="search" class="w-5 h-5"></i>
            </button>
          </div>
        </form>

        <!-- Language Toggle & Mobile Menu -->
        <div class="flex items-center gap-4">
          <button
            onclick="Store.toggleLanguage()"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="${t('تغيير اللغة', 'Change Language')}"
          >
            <i data-lucide="globe" class="w-4 h-4 text-gray-700"></i>
            <span class="text-sm font-medium text-gray-700">
              ${lang === 'ar' ? 'EN' : 'AR'}
            </span>
          </button>

          <!-- Mobile Menu Button (Simple implementation) -->
          <button
            onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i data-lucide="menu" class="w-6 h-6 text-gray-700"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <nav id="mobile-menu" class="hidden lg:hidden py-4 border-t border-gray-200">
        <!-- Mobile Search Bar -->
        <form onsubmit="handleSearch(event); document.getElementById('mobile-menu').classList.add('hidden');" class="mb-4 px-4">
          <div class="relative">
            <input
              type="text"
              name="q"
              placeholder="${t('ابحث عن منتجات...', 'Search for products...')}"
              class="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
              style="direction: ${lang === 'ar' ? 'rtl' : 'ltr'}"
            />
            <button
              type="submit"
              class="absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="${t('بحث', 'Search')}"
            >
              <i data-lucide="search" class="w-5 h-5"></i>
            </button>
          </div>
        </form>

        ${navLinks.map(link => `
          <a
            href="#${link.path}"
            onclick="document.getElementById('mobile-menu').classList.add('hidden')"
            class="block py-3 px-4 text-base font-medium rounded-lg mb-1 transition-colors ${isActive(link.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}"
          >
            ${t(link.labelAr, link.labelEn)}
          </a>
        `).join('')}
      </nav>
    </div>
  `;

  const headerEl = document.getElementById('header-container');
  if (headerEl) headerEl.innerHTML = headerHtml;
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

function renderFooter() {
  const t = (ar, en) => Store.t(ar, en);

  const quickLinks = [
    { path: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
    { path: '/categories', labelAr: 'المنتجات', labelEn: 'Products' },
    { path: '/trusted-by', labelAr: 'شركاء النجاح', labelEn: 'Trusted Partners' },
    { path: '/providers', labelAr: 'العلامات التجارية', labelEn: 'Brands' },
    { path: '/services', labelAr: 'الخدمات', labelEn: 'Services' }
  ];

  const footerHtml = `
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 flex items-center justify-center">
                <img
                  src="./images/logo.jpeg"
                  alt="Smart Business Logo"
                  class="w-full h-full object-contain"
                />

              </div>
              <div>
                <h3 class="text-white font-bold text-lg">
                  ${t('سمارت بيزنس', 'Smart Business')}
                </h3>
              </div>
            </div>
            <p class="text-sm mb-4">
              ${t(
    'شريكك الموثوق في حلول السلامة الكهربائية وأجهزة الاختبار في مصر',
    'Your trusted partner for electrical safety solutions and testing instruments in Egypt'
  )}
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-white font-semibold mb-4">
              ${t('روابط سريعة', 'Quick Links')}
            </h4>
            <ul class="space-y-2">
              ${quickLinks.map(link => `
                <li>
                  <a href="#${link.path}" class="text-sm hover:text-blue-400 transition-colors">
                    ${t(link.labelAr, link.labelEn)}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h4 class="text-white font-semibold mb-4">
              ${t('معلومات التواصل', 'Contact Info')}
            </h4>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <i data-lucide="phone" class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"></i>
                <div class="flex flex-col gap-1">
                  <a href="tel:+201020046809" class="text-sm hover:text-blue-400 transition-colors">
                    +20 10 20046809
                  </a>
                  <a href="tel:+201223998378" class="text-sm hover:text-blue-400 transition-colors">
                    +20 12 23998378
                  </a>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="mail" class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"></i>
                <a href="mailto:${companyInfo.email}" class="text-sm hover:text-blue-400 transition-colors">
                  ${companyInfo.email}
                </a>
              </li>
              <li class="flex items-start gap-3">
                <i data-lucide="map-pin" class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"></i>
                <span class="text-sm">${t(companyInfo.addressAr, companyInfo.addressEn)}</span>
              </li>
            </ul>
          </div>

          <!-- Working Hours & CTA -->
          <div>
            <h4 class="text-white font-semibold mb-4">
              ${t('ساعات العمل', 'Working Hours')}
            </h4>
            <p class="text-sm mb-4">
              ${t(companyInfo.workingHoursAr, companyInfo.workingHoursEn)}
            </p>
            <a
              href="https://wa.me/201020046809"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              ${t('تواصل واتساب', 'WhatsApp Us')}
            </a>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-sm">
            ${t(
    `© ${new Date().getFullYear()} سمارت بيزنس. جميع الحقوق محفوظة.`,
    `© ${new Date().getFullYear()} Smart Business. All rights reserved.`
  )}
          </p>
        </div>
      </div>
  `;
  const footerEl = document.getElementById('footer-container');
  if (footerEl) footerEl.innerHTML = footerHtml;
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

function showToast(title, description, variant = 'default') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const bgColor = variant === 'destructive' ? 'bg-red-500' : 'bg-gray-800';

  toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 flex flex-col pointer-events-auto`;
  toast.innerHTML = `
        <strong class="font-bold">${title}</strong>
        <span class="text-sm">${description}</span>
    `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-full');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
const Pages = {
  home: () => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;
    const arrow = lang === 'ar' ? 'arrow-left' : 'arrow-right';

    // Get Featured Products (e.g., from Electrical Testing or first 4 products)
    const featuredProducts = products.slice(0, 4);
    // Use same logic as Trusted Partners page
    const topProviders = providers.filter(p => p.isTrustedPartner).slice(0, 6);

    const features = [
      { icon: 'shield-check', titleAr: 'جودة عالمية', titleEn: 'Global Quality', descAr: 'نمثل أفضل العلامات التجارية العالمية في مجال السلامة الكهربائية', descEn: 'We represent the best global brands in electrical safety' },
      { icon: 'cpu', titleAr: 'خبرة متخصصة', titleEn: 'Specialized Expertise', descAr: 'فريق من الخبراء والمهندسين لتقديم الحلول المناسبة', descEn: 'Team of experts and engineers to provide suitable solutions' },
      { icon: 'check-circle', titleAr: 'معايير معتمدة', titleEn: 'Certified Standards', descAr: 'جميع منتجاتنا مطابقة للمعايير المصرية والدولية', descEn: 'All our products comply with Egyptian and international standards' },
      { icon: 'headset', titleAr: 'دعم فني', titleEn: 'Technical Support', descAr: 'دعم فني متواصل وخدمات ما بعد البيع استثنائية', descEn: 'Continuous technical support and exceptional after-sales services' }
    ];

    return `
      <!-- Premium Hero Section -->
      <section class="relative bg-slate-900 overflow-hidden py-24 lg:py-32">
        <!-- Abstract Background Elements -->
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] mix-blend-screen animate-pulse" style="animation-delay: 2s"></div>
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="flex flex-col lg:flex-row items-center gap-16">
            <!-- Hero Text Content -->
            <div class="lg:w-1/2 text-center lg:text-start space-y-8 animate-fade-in">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-bold tracking-wide uppercase">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                ${t('الريادة في السلامة الكهربائية', 'Leadership in Electrical Safety')}
              </div>
              
              <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
                ${t('مستقبلك آمن مع <span class="text-blue-500">حلولنا</span> المبتكرة', 'Your Future is Safe with Our <span class="text-blue-500">Innovative</span> Solutions')}
              </h1>
              
              <p class="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                ${t('نوفر أحدث أجهزة الاختبار ومعدات الوقاية الكهربائية من أشهر العلامات التجارية العالمية. نضمن لك الدقة، الأمان، والاعتمادية في كل خطوة.', 'We provide the latest testing instruments and electrical safety equipment from top global brands. We guarantee precision, safety, and reliability at every step.')}
              </p>
              
              <div class="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                <a href="#/products" class="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold transition-all hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95">
                  ${t('استكشف المنتجات', 'Explore Products')}
                  <i data-lucide="${arrow}" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                </a>
                <a href="#/contact" class="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold backdrop-blur-sm hover:bg-white/10 transition-all active:scale-95">
                  ${t('اتصل بنا', 'Contact Us')}
                </a>
              </div>
            </div>

            <!-- Hero Image/Visual -->
            <div class="lg:w-1/2 relative group">
              <div class="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div class="relative bg-slate-800 rounded-3xl p-2 border border-white/10 shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
                <img src="./images/Cable.png" alt="Electrical Safety Hero" class="w-full rounded-2xl shadow-inner" />
              </div>

              <!-- Animated Small Counter Cards -->
              <div class="grid grid-cols-3 gap-3 mt-6">
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300">
                  <div class="text-2xl font-black text-blue-400 counter-value leading-none mb-1" data-target="500" data-suffix="+">0</div>
                  <div class="text-[9px] uppercase font-black text-slate-400 tracking-widest">${t('منتج', 'Products')}</div>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300">
                  <div class="text-2xl font-black text-blue-400 counter-value leading-none mb-1" data-target="1000" data-suffix="+">0</div>
                  <div class="text-[9px] uppercase font-black text-slate-400 tracking-widest">${t('عميل', 'Clients')}</div>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl text-center transform hover:scale-105 transition-transform duration-300">
                  <div class="text-2xl font-black text-blue-400 counter-value leading-none mb-1" data-target="99" data-suffix="%">0</div>
                  <div class="text-[9px] uppercase font-black text-slate-400 tracking-widest">${t('الدقة', 'Accuracy')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trusted Brand Bar -->
      <section class="py-12 bg-white border-b border-gray-100">
        <div class="container mx-auto px-4 text-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">${t('شركاء العلامات التجارية المعتمدين', 'Certified Brand Partners')}</p>
          <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            ${topProviders.map(p => `
              <div class="h-10 md:h-12 w-32 md:w-40 flex items-center justify-center transform hover:scale-110 transition-transform">
                <img src="${p.logo}" alt="${t(p.nameAr, p.nameEn)}" class="max-h-full max-w-full object-contain" />
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Modern Features Section -->
      <section class="py-24 bg-slate-50 relative overflow-hidden">
        <div class="container mx-auto px-4 relative z-10">
          <div class="max-w-3xl mx-auto text-center mb-20 space-y-4">
            <h2 class="text-3xl md:text-5xl font-bold text-slate-900">${t('لماذا تختار سمارت بيزنس؟', 'Why Choose Smart Business?')}</h2>
            <p class="text-lg text-slate-600 leading-relaxed">${t('نحن لسنا مجرد موردين، بل شركاء في رحلتك نحو الأمان والتميز الكهربائي.', 'We are not just suppliers; we are partners in your journey towards electrical safety and excellence.')}</p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            ${features.map((f, i) => `
              <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
                <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-500">
                  <i data-lucide="${f.icon}" class="w-8 h-8 text-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">${t(f.titleAr, f.titleEn)}</h3>
                <p class="text-slate-500 leading-relaxed text-sm">${t(f.descAr, f.descEn)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Featured Categories with Perspective -->
      <section class="py-24 bg-white">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div class="space-y-4">
              <h2 class="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">${t('تصفح حسب الفئة', 'Shop By Category')}</h2>
              <p class="text-slate-500 max-w-xl">${t('استكشف أكبر تشكيلة من أجهزة القياس ومعدات الحماية الشخصية.', 'Explore our vast selection of measuring instruments and safety gear.')}</p>
            </div>
            <a href="#/categories" class="group flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors">
              ${t('عرض جميع الفئات', 'View All Categories')}
              <i data-lucide="${arrow}" class="w-6 h-6 group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${categories.slice(0, 6).map(category => `
              <a href="#/products?category=${category.id}" class="group relative h-[400px] overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-700">
                <img src="${category.image}" alt="${t(category.nameAr, category.nameEn)}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div class="absolute bottom-0 inset-x-0 p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 class="text-2xl font-bold text-white mb-2">${t(category.nameAr, category.nameEn)}</h3>
                  <p class="text-white/70 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">${t(category.descriptionAr, category.descriptionEn)}</p>
                  <div class="mt-4 flex items-center gap-2 text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ${t('اكتشف الآن', 'Discover Now')}
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Featured Products / Top Deals Showcase -->
      <section class="py-24 bg-slate-900 relative overflow-hidden">
        <!-- Background Glow -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]"></div>
        
        <div class="container mx-auto px-4 relative z-10 text-center mb-16 space-y-4 text-white">
          <h2 class="text-3xl md:text-5xl font-bold">${t('أهم المنتجات المختارة', 'Featured Selection')}</h2>
          <p class="text-slate-400 max-w-2xl mx-auto">${t('أحدث التقنيات وأفضل حلول السلامة المتوفرة لدينا الآن.', 'The latest technologies and the best safety solutions available now.')}</p>
        </div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            ${featuredProducts.map(p => `
              <a href="#/product/${p.id}" class="group bg-slate-800 rounded-3xl p-4 border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                <div class="aspect-square bg-slate-700/50 rounded-2xl overflow-hidden mb-5 relative">
                  <img src="${p.mainImage}" alt="${t(p.nameAr, p.nameEn)}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div class="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">${t('موصى به', 'Featured')}</div>
                </div>
                <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">${t(p.nameAr, p.nameEn)}</h3>
                <div class="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  ${t('عرض التفاصيل', 'View Details')}
                  <i data-lucide="${arrow}" class="w-4 h-4"></i>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Enhanced Client Showcase -->
      <section class="py-24 bg-white overflow-hidden">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16 space-y-4">
            <div class="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
            <h2 class="text-3xl font-bold text-slate-900">${t('عملاء نعتز بخدمتهم', 'Clients We Proudly Serve')}</h2>
            <p class="text-slate-500 max-w-2xl mx-auto">${t('ثقة كبار الشركات تدفعنا للأمام دائماً.', 'The trust of major companies always drives us forward.')}</p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            ${(window.clients || []).map(client => `
              <div class="group relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-500">
                <div class="h-16 flex items-center justify-center mb-4">
                  ${client.logo ? `
                    <img src="${client.logo}" alt="${t(client.nameAr, client.nameEn)}" class="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                  ` : `
                    <div class="text-slate-400 font-black text-center text-xs opacity-50 uppercase">${t(client.nameAr, client.nameEn)}</div>
                  `}
                </div>
                <span class="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-widest text-center line-clamp-1">${t(client.nameAr, client.nameEn)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Ultimate CTA Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="relative bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl text-center md:text-start">
            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div class="md:w-2/3 space-y-6">
                <h2 class="text-3xl md:text-5xl font-black text-white leading-tight">
                  ${t('على استعداد للارتقاء <br>بمعايير السلامة لديك؟', 'Ready to Elevate Your <br>Safety Standards?')}
                </h2>
                <p class="text-xl text-blue-100">
                  ${t('تواصل مع خبرائنا اليوم للحصول على استشارة فنية مخصصة وعرض سعر منافس.', 'Contact our experts today for a customized technical consultation and competitive quote.')}
                </p>
              </div>
              <div class="md:w-1/3 flex flex-col gap-4">
                <a href="https://wa.me/2${companyInfo.phoneWhatsApp}" target="_blank" class="flex items-center justify-center gap-3 px-10 py-5 bg-white text-blue-800 rounded-2xl font-black text-xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all">
                  <i data-lucide="message-circle" class="w-8 h-8"></i>
                  ${t('واتساب الآن', 'WhatsApp Now')}
                </a>
                <p class="text-center text-blue-200 text-sm font-medium">${t('متاحون للرد على استفساراتكم 24/7', 'Available 24/7 to answer your inquiries')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },


  categories: () => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;
    const arrow = lang === 'ar' ? 'arrow-left' : 'arrow-right';

    return `
      <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
      <div class="container mx-auto px-4">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ${t('فئات المنتجات', 'Product Categories')}
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            ${t(
      'اكتشف مجموعتنا الشاملة من حلول السلامة الكهربائية وأجهزة الاختبار',
      'Discover our comprehensive range of electrical safety solutions and testing instruments'
    )}
          </p>
        </div>

        <!-- Categories Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${categories.map(category => `
            <a
              href="#/products?category=${category.id}"
              class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <!-- Image -->
              <div class="aspect-[4/3] overflow-hidden relative">
                <img
                  src="${category.image}"
                  alt="${t(category.nameAr, category.nameEn)}"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <h3 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  ${t(category.nameAr, category.nameEn)}
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-2">
                  ${t(category.descriptionAr, category.descriptionEn)}
                </p>
                <div class="flex items-center gap-2 text-blue-600 font-semibold">
                  ${t('عرض المنتجات', 'View Products')}
                  <i data-lucide="${arrow}" class="w-5 h-5 group-hover:translate-x-1 transition-transform" style="transform: ${lang === 'ar' ? 'scaleX(-1)' : 'none'}"></i>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
    `;
  },

  products: () => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;
    const arrow = lang === 'ar' ? 'arrow-left' : 'arrow-right';

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const initialCategoryId = urlParams.get('category') || 'all';
    const initialBrandId = urlParams.get('brand') || '';

    // Get all unique providers and trusted partners
    const allProviders = providers.filter(p => {
      const productCount = products.filter(prod => prod.providerId === p.id).length;
      return productCount > 0;
    });
    const trustedProviders = allProviders.filter(p => p.isTrustedPartner);

    return `
      <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div class="container mx-auto px-4">
          <!-- Hero Banner Section -->
          <div class="relative rounded-2xl overflow-hidden shadow-xl mb-8">
            <!-- Background Image -->
            <img src="./images/image.png" alt="${t('المنتجات', 'Products')}" class="w-full h-48 md:h-64 object-cover" />
            
            <!-- Overlay Gradient -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            
            <!-- Content Overlay -->
            <div class="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
              <!-- Breadcrumb -->
              <div class="flex items-center gap-2 text-sm text-white/90 mb-3">
                <a href="#/" class="hover:text-white transition-colors">${t('الرئيسية', 'Home')}</a>
                <span>/</span>
                <span class="text-white font-medium">${t('المنتجات', 'Products')}</span>
              </div>

              <!-- Page Title -->
              <h1 class="text-3xl md:text-5xl font-bold text-white mb-2">${t('جميع المنتجات', 'All Products')}</h1>
              <p class="text-base md:text-lg text-white/90 max-w-2xl">${t('استخدم الفلاتر للعثور على المنتج المناسب', 'Use filters to find the right product')}</p>
            </div>
          </div>

          <!-- Two Column Layout -->
          <div class="grid lg:grid-cols-4 gap-8">
            <!-- Filter Sidebar -->
            <div class="lg:col-span-1">
              <div id="filter-sidebar" class="hidden lg:block bg-white rounded-2xl shadow-md p-6 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar fixed inset-0 z-[60] lg:relative lg:inset-auto lg:z-auto lg:m-0 m-4 lg:shadow-md shadow-2xl border border-gray-100">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-bold text-gray-900">${t('الفلاتر', 'Filters')}</h2>
                  <div class="flex items-center gap-4">
                    <button onclick="clearProductFilters()" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      ${t('مسح الكل', 'Clear All')}
                    </button>
                    <!-- Close button for mobile -->
                    <button onclick="toggleMobileFilter()" class="lg:hidden p-2 text-gray-400 hover:text-gray-600">
                      <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                  </div>
                </div>

                <!-- Category Filter -->
                <div class="mb-6 pb-6 border-b border-gray-200">
                  <h3 class="text-sm font-bold text-gray-900 mb-3">${t('الفئة', 'Category')}</h3>
                  <select 
                    id="category-filter" 
                    onchange="updateProductFilters()"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none text-sm"
                  >
                    <option value="all">${t('جميع الفئات', 'All Categories')}</option>
                    ${categories.map(cat => `
                      <option value="${cat.id}" ${cat.id == initialCategoryId ? 'selected' : ''}>
                        ${t(cat.nameAr, cat.nameEn)}
                      </option>
                    `).join('')}
                  </select>
                </div>

                <!-- Sub-Category Filter -->
                <div id="subcategory-filter-section" class="mb-6 pb-6 border-b border-gray-200" style="display: none;">
                  <h3 class="text-sm font-bold text-gray-900 mb-3">${t('الفئة الفرعية', 'Sub-Category')}</h3>
                  <div id="subcategory-checkboxes" class="space-y-2 max-h-48 overflow-y-auto">
                    <!-- Populated dynamically -->
                  </div>
                </div>

                <!-- Provider Filter -->
                <div class="mb-6 pb-6 border-b border-gray-200">
                  <h3 class="text-sm font-bold text-gray-900 mb-3">${t('العلامة التجارية', 'Brand')}</h3>
                  <div class="space-y-2 max-h-48 overflow-y-auto">
                    ${allProviders.map(prov => `
                      <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input 
                            type="checkbox" 
                            class="provider-checkbox w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            value="${prov.id}"
                            onchange="updateProductFilters()"
                            ${prov.id == initialBrandId ? 'checked' : ''}
                          />
                        <span class="text-sm text-gray-700">${t(prov.nameAr, prov.nameEn)}</span>
                      </label>
                    `).join('')}
                  </div>
                </div>

                <!-- Trusted Partners Filter -->
                ${trustedProviders.length > 0 ? `
                  <div class="mb-6 pb-6 border-b border-gray-200">
                    <label class="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="trusted-filter"
                        class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        onchange="updateProductFilters()"
                      />
                      <div>
                        <div class="text-sm font-bold text-gray-900">${t('شركاء موثوقون فقط', 'Trusted Partners Only')}</div>
                        <div class="text-xs text-gray-500">${t('عرض منتجات الشركاء المعتمدين', 'Show certified partners products')}</div>
                      </div>
                    </label>
                  </div>
                ` : ''}

                <!-- In Stock Filter -->
                <div class="mb-10">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="instock-filter"
                      class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      onchange="updateProductFilters()"
                    />
                    <div>
                      <div class="text-sm font-bold text-gray-900">${t('متوفر في المخزون', 'In Stock Only')}</div>
                      <div class="text-xs text-gray-500">${t('عرض المنتجات المتوفرة فقط', 'Show available products only')}</div>
                    </div>
                  </label>
                </div>
                
                <!-- Apply Filters Button for mobile -->
                <button onclick="toggleMobileFilter()" class="lg:hidden w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">
                  ${t('تطبيق الفلاتر', 'Apply Filters')}
                </button>
              </div>

              <!-- Mobile Filter Button (Opposite side of WhatsApp) -->
              <button 
                onclick="toggleMobileFilter()"
                class="lg:hidden fixed bottom-6 left-6 bg-blue-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 z-50 transform active:scale-95 transition-all"
              >
                <i data-lucide="filter" class="w-6 h-6"></i>
                <span class="font-bold">${t('الفلاتر', 'Filters')}</span>
              </button>
            </div>

            <!-- Product Grid -->
            <div class="lg:col-span-3">
              <!-- Search Bar -->
              <div class="mb-6">
                <div class="relative">
                  <input
                    type="text"
                    id="product-search"
                    placeholder="${t('ابحث في المنتجات...', 'Search products...')}"
                    class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    style="direction: ${lang === 'ar' ? 'rtl' : 'ltr'}"
                    oninput="updateProductFilters()"
                  />
                  <i data-lucide="search" class="absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                </div>
              </div>

              <!-- View Mode Toggle & Product Count -->
              <div class="mb-4 flex items-center justify-between">
                <p class="text-sm text-gray-600">
                  <span id="product-count">${products.length}</span> ${t('منتج', 'Products')}
                </p>
                
                <!-- View Mode Buttons -->
                <div class="flex items-center gap-2">
                  <button 
                    onclick="changeViewMode('grid-4')" 
                    id="view-grid-4"
                    class="view-mode-btn p-2 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="${t('4 أعمدة', '4 Columns')}"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                      <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                      <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                      <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                    </svg>
                  </button>
                  
                  <button 
                    onclick="changeViewMode('grid-3')" 
                    id="view-grid-3"
                    class="view-mode-btn p-2 rounded-lg border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                    title="${t('3 أعمدة', '3 Columns')}"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="5" height="5" rx="1"></rect>
                      <rect x="10" y="3" width="5" height="5" rx="1"></rect>
                      <rect x="17" y="3" width="5" height="5" rx="1"></rect>
                      <rect x="3" y="10" width="5" height="5" rx="1"></rect>
                      <rect x="10" y="10" width="5" height="5" rx="1"></rect>
                      <rect x="17" y="10" width="5" height="5" rx="1"></rect>
                    </svg>
                  </button>
                  
                  <button 
                    onclick="changeViewMode('list')" 
                    id="view-list"
                    class="view-mode-btn p-2 rounded-lg border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                    title="${t('قائمة', 'List')}"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <rect x="3" y="4" width="2" height="4" rx="1"></rect>
                      <rect x="3" y="10" width="2" height="4" rx="1"></rect>
                      <rect x="3" y="16" width="2" height="4" rx="1"></rect>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Products Grid -->
              <div id="products-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${products.map(product => {
      const provider = providers.find(p => p.id == product.providerId) || {};
      const category = categories.find(c => c.id == product.categoryId) || {};
      return `
                    <a 
                      href="#/product/${product.id}" 
                      class="product-item product-grid-view group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                      data-product-id="${product.id}"
                      data-category-id="${product.categoryId}"
                      data-subcategory-id="${product.subCategoryId || ''}"
                      data-provider-id="${product.providerId}"
                      data-is-trusted="${provider.isTrustedPartner ? '1' : '0'}"
                      data-in-stock="${product.inStock ? '1' : '0'}"
                      data-search-text="${(t(product.nameAr, product.nameEn) + ' ' + t(product.shortDescAr, product.shortDescEn) + ' ' + t(category.nameAr, category.nameEn)).toLowerCase()}"
                    >
                      <!-- Grid View Content -->
                      <div class="grid-content">
                        <div class="aspect-square overflow-hidden relative">
                          <img src="${product.mainImage}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ${(provider.nameAr || provider.nameEn) ? `
                            <div class="absolute top-2 ${lang === 'ar' ? 'left-2' : 'right-2'} bg-blue-600 px-2 py-0.5 rounded-full text-[10px] font-medium text-white shadow-md">
                              ${t(provider.nameAr, provider.nameEn)}
                            </div>
                          ` : ''}
                        </div>
                        <div class="p-4">
                          <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            ${t(product.nameAr, product.nameEn)}
                          </h3>
                          <p class="text-gray-500 text-xs mb-3 line-clamp-2 h-8">${t(product.shortDescAr, product.shortDescEn)}</p>
                          <div class="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                            ${t('عرض التفاصيل', 'View Details')}
                            <i data-lucide="${arrow}" class="w-3.5 h-3.5" style="transform: ${lang === 'ar' ? 'scaleX(-1)' : 'none'}"></i>
                          </div>
                        </div>
                      </div>
                      
                      <!-- List View Content (Hidden by default) -->
                      <div class="list-content hidden">
                        <div class="flex gap-6 p-6">
                          <div class="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                            <img src="${product.mainImage}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div class="flex-1">
                            <div class="flex items-start justify-between mb-3">
                              <h3 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                ${t(product.nameAr, product.nameEn)}
                              </h3>
                              ${(provider.nameAr || provider.nameEn) ? `
                                <span class="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium text-white shadow-md">
                                  ${t(provider.nameAr, provider.nameEn)}
                                </span>
                              ` : ''}
                            </div>
                            <p class="text-gray-600 text-base mb-4 leading-relaxed">${t(product.descriptionAr || product.shortDescAr, product.descriptionEn || product.shortDescEn)}</p>
                            <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                              <i data-lucide="tag" class="w-4 h-4"></i>
                              <span>${t(category.nameAr, category.nameEn)}</span>
                            </div>
                            <div class="flex items-center gap-2 text-blue-600 font-semibold">
                              ${t('عرض التفاصيل الكاملة', 'View Full Details')}
                              <i data-lucide="${arrow}" class="w-4 h-4" style="transform: ${lang === 'ar' ? 'scaleX(-1)' : 'none'}"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  `;
    }).join('')}
              </div>

              <!-- No Results Message -->
              <div id="no-products-message" class="hidden text-center py-16">
                <i data-lucide="package-x" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                <h3 class="text-xl font-bold text-gray-900 mb-2">${t('لا توجد منتجات', 'No products found')}</h3>
                <p class="text-gray-600 mb-4">${t('جرب تغيير الفلاتر أو البحث', 'Try changing filters or search')}</p>
                <button onclick="clearProductFilters()" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  ${t('مسح الفلاتر', 'Clear Filters')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    `;
  },

  category: (params) => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;
    const arrow = lang === 'ar' ? 'arrow-left' : 'arrow-right';
    const categoryId = params.id; // Keep as string for loose comparison
    const category = categories.find(c => c.id == categoryId); // Loose equality

    if (!category) return `<div class="p-10 text-center">${t('الفئة غير موجودة', 'Category Not Found')}</div>`;

    const categoryProducts = products.filter(p => p.categoryId == categoryId); // Loose equality
    const subCategoriesForCategory = (subCategories || []).filter(s => s.categoryId == categoryId);

    // Get unique providers for this category
    const uniqueProviderIds = [...new Set(categoryProducts.map(p => p.providerId))];
    const categoryProviders = uniqueProviderIds.map(id => providers.find(p => p.id == id)).filter(Boolean);

    const subCardsSection = subCategoriesForCategory.length > 0 ? `
        <!-- Sub-categories (cards first) -->
        <div class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">${t('الفئات الفرعية', 'Sub-categories')}</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <button onclick="filterBySubCategory('all')" class="sub-filter-btn text-start rounded-xl overflow-hidden shadow-md border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-all active" data-sub-id="all">
              <div class="aspect-[4/3] bg-blue-100 flex items-center justify-center">
                <i data-lucide="layers" class="w-12 h-12 text-blue-600"></i>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-900">${t('الكل', 'All')}</h3>
                <p class="text-sm text-gray-600">${t('جميع المنتجات', 'All products')}</p>
              </div>
            </button>
            ${subCategoriesForCategory.map(sub => `
              <button onclick="filterBySubCategory('${sub.id}')" class="sub-filter-btn text-start rounded-xl overflow-hidden shadow-md border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all" data-sub-id="${sub.id}">
                <div class="aspect-[4/3] overflow-hidden">
                  <img src="${sub.image}" alt="${t(sub.nameAr, sub.nameEn)}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div class="p-4">
                  <h3 class="font-bold text-gray-900 line-clamp-1">${t(sub.nameAr, sub.nameEn)}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2">${t(sub.descAr, sub.descEn)}</p>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
    ` : '';

    return `
     <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <a href="#/" class="hover:text-blue-600">${t('الرئيسية', 'Home')}</a>
          <span>/</span>
          <a href="#/categories" class="hover:text-blue-600">${t('الفئات', 'Categories')}</a>
          <span>/</span>
          <span class="text-gray-900 font-medium">${t(category.nameAr, category.nameEn)}</span>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-8 mb-8">
            <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">${t(category.nameAr, category.nameEn)}</h1>
                <p class="text-lg text-gray-600">${t(category.descriptionAr, category.descriptionEn)}</p>
            </div>
             <div class="rounded-xl overflow-hidden">
              <img src="${category.image}" class="w-full h-64 object-cover">
             </div>
            </div>
        </div>

        ${subCardsSection}

        <!-- Provider Filter -->
        <div class="mb-8 overflow-x-auto pb-2">
            <div class="flex items-center gap-2">
                <button onclick="filterProducts('all')" class="filter-btn px-4 py-2 rounded-full text-sm font-semibold transition-all bg-blue-600 text-white shadow-md hover:scale-105 active" data-id="all">
                    ${t('الكل', 'All')}
                </button>
                ${categoryProviders.map(prov => `
                    <button onclick="filterProducts('${prov.id}')" class="filter-btn px-4 py-2 rounded-full text-sm font-semibold transition-all bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 shadow-sm border border-gray-200" data-id="${prov.id}">
                        ${t(prov.nameAr, prov.nameEn)}
                    </button>
                `).join('')}
            </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="products-grid">
            ${categoryProducts.map(product => {
      const provider = providers.find(p => p.id == product.providerId) || {};
      const subId = product.subCategoryId != null ? product.subCategoryId : '';
      return `
                  <a href="#/product/${product.id}" class="group product-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all" data-provider-id="${product.providerId}" data-sub-category-id="${subId}">
                    <div class="aspect-square overflow-hidden relative">
                      <img src="${product.mainImage}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       ${(provider.nameAr || provider.nameEn) ? `
                       <div class="absolute top-2 right-2 bg-blue-600 px-2 py-0.5 rounded-full text-[10px] font-medium text-white shadow-md">
                        ${t(provider.nameAr, provider.nameEn)}
                      </div>
                      ` : ''}
                    </div>
                    <div class="p-4">
                      <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        ${t(product.nameAr, product.nameEn)}
                      </h3>
                       <p class="text-gray-500 text-xs mb-3 line-clamp-2 h-8">
                        ${t(product.shortDescAr, product.shortDescEn)}
                      </p>
                       <div class="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                        ${t('عرض التفاصيل', 'View Details')}
                        <i data-lucide="${arrow}" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" style="transform: ${lang === 'ar' ? 'scaleX(-1)' : 'none'}"></i>
                      </div>
                    </div>
                  </a>
                `;
    }).join('')}
        </div>
        
        ${categoryProducts.length === 0 ? `<div class="text-center py-12 text-gray-600">${t('لا توجد منتجات', 'No products available')}</div>` : ''}
        <div id="no-results-msg" class="hidden text-center py-12 text-gray-600">${t('لا توجد منتجات لهذه العلامة التجارية', 'No products found for this brand')}</div>

      </div>
     </div>
    `;
  },

  product: (params) => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;
    const arrow = lang === 'ar' ? 'arrow-left' : 'arrow-right';
    const prodId = params.id; // Keep as string
    const product = products.find(p => p.id == prodId); // Loose equality

    if (!product) return `<div class="p-10 text-center">${t('المنتج غير موجود', 'Product Not Found')}</div>`;

    const provider = providers.find(p => p.id == product.providerId) || {};

    // Setup handling for form is done in app.js or inline onclick

    // Add Product Structured Data for SEO
    const productStructuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": t(product.nameAr, product.nameEn),
      "description": t(product.fullDescAr, product.fullDescEn),
      "image": [product.mainImage, ...product.subImages],
      "brand": {
        "@type": "Brand",
        "name": t(provider.nameAr, provider.nameEn)
      },
      "offers": {
        "@type": "Offer",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "priceCurrency": "EGP",
        "url": `https://www.smartbusiness-eg.com/#/product/${product.id}`
      }
    };

    return `
    <!-- Product Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(productStructuredData)}
    </script>
    
    <article class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12" itemscope itemtype="https://schema.org/Product">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb with Schema -->
        <nav aria-label="${t('مسار التنقل', 'Breadcrumb')}" class="mb-6">
          <ol class="flex items-center gap-2 text-sm text-gray-600" itemscope itemtype="https://schema.org/BreadcrumbList">
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <a href="#/" itemprop="item" class="hover:text-blue-600">
                <span itemprop="name">${t('الرئيسية', 'Home')}</span>
              </a>
              <meta itemprop="position" content="1" />
            </li>
            <span>/</span>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <a href="#/products" itemprop="item" class="hover:text-blue-600">
                <span itemprop="name">${t('المنتجات', 'Products')}</span>
              </a>
              <meta itemprop="position" content="2" />
            </li>
            <span>/</span>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <span itemprop="name" class="text-gray-900 font-medium">${t(product.nameAr, product.nameEn)}</span>
              <meta itemprop="position" content="3" />
            </li>
          </ol>
        </nav>
        
        <div class="grid lg:grid-cols-2 gap-12">
           <div>
             <div class="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
                <img id="main-product-image" src="${product.mainImage}" alt="${t(product.nameAr, product.nameEn)}" class="w-full h-64 md:h-[500px] object-cover" itemprop="image" />
             </div>
             <div class="grid grid-cols-4 gap-2 md:gap-4">
                ${[product.mainImage, ...product.subImages].map((img, index) => `
                    <button onclick="document.getElementById('main-product-image').src = '${img}'" class="rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400" aria-label="${t('عرض الصورة', 'View image')} ${index + 1}">
                        <img src="${img}" alt="${t(product.nameAr, product.nameEn)} - ${t('صورة', 'Image')} ${index + 1}" class="w-full h-24 object-cover" />
                    </button>
                `).join('')}
             </div>
           </div>
           
           <div>
             <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4" itemprop="brand" itemscope itemtype="https://schema.org/Brand">
               <span itemprop="name">${t(provider.nameAr, provider.nameEn)}</span>
             </div>
             <h1 class="text-4xl font-bold text-gray-900 mb-4" itemprop="name">${t(product.nameAr, product.nameEn)}</h1>
             <p class="text-lg text-gray-700 mb-6" itemprop="description">${t(product.shortDescAr, product.shortDescEn)}</p>
             
             <div class="bg-white rounded-xl p-6 shadow-md mb-6">
                <h2 class="text-xl font-bold text-gray-900 mb-3">${t('وصف المنتج', 'Product Description')}</h2>
                <p class="text-gray-600 leading-relaxed">${t(product.fullDescAr, product.fullDescEn)}</p>
             </div>
             
             <div class="bg-white rounded-xl p-6 shadow-md mb-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">${t('المواصفات الفنية', 'Technical Specifications')}</h3>
                <div class="space-y-3">
                    ${product.specifications.map(spec => `
                        <div class="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                           <i data-lucide="check" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></i>
                           <div class="flex-1">
                             <span class="font-semibold text-gray-900">${t(spec.labelAr, spec.labelEn)}:</span>
                             <span class="text-gray-600">${t(spec.valueAr, spec.valueEn)}</span>
                           </div>
                        </div>
                    `).join('')}
                </div>
             </div>
             
             <!-- Quote Form -->
             <div class="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md border border-blue-200">
                <h3 class="text-xl font-bold text-gray-900 mb-4">${t('طلب عرض سعر', 'Request Quote')}</h3>
                <form onsubmit="handleProductQuote(event, '${prodId}')" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                         ${t('الاسم', 'Name')} <span class="text-red-500">*</span>
                        </label>
                        <input type="text" name="name" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 outline-none" placeholder="${t('أدخل اسمك', 'Enter your name')}">
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                         ${t('رقم الهاتف', 'Phone Number')} <span class="text-red-500">*</span>
                        </label>
                        <input type="tel" name="phone" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 outline-none" placeholder="010xxxxxxx">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                         ${t('الكمية', 'Quantity')}
                        </label>
                        <input type="number" name="quantity" value="1" min="1" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 outline-none">
                    </div>
                    <button type="submit" class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all">
                        <i data-lucide="message-circle" class="w-5 h-5"></i>
                        ${t('إرسال الطلب عبر واتساب', 'Send Request via WhatsApp')}
                    </button>
                </form>
             </div>

           </div>
        </div>
      </div>
    </article>
    `;
  },

  services: () => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;

    // Service methodology steps
    const methodology = [
      { step: "01", titleAr: "الاستشارة الفنية", titleEn: "Technical Consultation", descAr: "فهم احتياجاتك وتحديد الحلول الكهربائية الأنسب.", descEn: "Understanding your needs and identifying the most suitable electrical solutions." },
      { step: "02", titleAr: "التخطيط والتوريد", titleEn: "Planning & Supply", descAr: "تجهيز وتوريد أفضل الأجهزة والمعدات بجودة عالمية.", descEn: "Preparing and supplying the best instruments and equipment with global quality." },
      { step: "03", titleAr: "التدريب والدعم", titleEn: "Training & Support", descAr: "تدريب فريقك على الاستخدام الأمثل وضمان استمرارية العمل.", descEn: "Training your team on optimal usage and ensuring work continuity." }
    ];

    // Additional benefits grid
    const benefits = [
      { icon: 'clock', titleAr: 'استجابة سريعة', titleEn: 'Quick Response', descAr: 'نحن نقدر وقتك ونلتزم بمواعيد التسليم.', descEn: 'We value your time and commit to delivery deadlines.' },
      { icon: 'shield-check', titleAr: 'ضمان الجودة', titleEn: 'Quality Assurance', descAr: 'جميع خدماتنا ومنتجاتنا تأتي بضمان معتمد.', descEn: 'All our services and products come with a certified warranty.' },
      { icon: 'headphones', titleAr: 'دعم 24/7', titleEn: '24/7 Support', descAr: 'فريقنا متاح دائماً للرد على استفساراتكم الفنية.', descEn: 'Our team is always available to answer your technical inquiries.' },
      { icon: 'thumbs-up', titleAr: 'رضا العملاء', titleEn: 'Customer Satisfaction', descAr: 'هدفنا الأساسي هو بناء شراكة طويلة الأمد.', descEn: 'Our primary goal is to build a long-term partnership.' }
    ];

    return `
    <div class="min-h-screen bg-slate-50">
        <!-- Premium Header Section -->
        <section class="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-950 py-24 relative overflow-hidden">
             <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[150px] animate-pulse"></div>
                <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[150px] animate-pulse"></div>
             </div>
             
             <div class="container mx-auto px-4 text-center relative z-10">
                <div class="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-sm font-bold tracking-widest uppercase mb-6">
                  ${t('حلول متكاملة', 'Integrated Solutions')}
                </div>
                <h1 class="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight italic">
                  ${t('خدماتنا <span class="text-blue-400">الفنية</span> والاحترافية', 'Our <span class="text-blue-400">Technical</span> & Professional Services')}
                </h1>
                <div class="w-24 h-1.5 bg-blue-400 mx-auto mb-8 rounded-full"></div>
                <p class="text-xl text-blue-100/90 max-w-4xl mx-auto leading-relaxed font-medium">
                  ${t('نحن لسنا مجرد موزعين؛ نحن شركاء نجاح نقدم باقة متكاملة من الخدمات التي تضمن لك أعلى مستويات السلامة والكفاءة الكهربائية.', 'We are not just distributors; we are success partners offering an integrated package of services that ensure the highest levels of safety and electrical efficiency.')}
                </p>
             </div>
        </section>

        <!-- Main Services Grid -->
        <section class="py-24 relative z-20">
          <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${services.map((service, index) => `
                  <div class="group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                      <i data-lucide="${service.icon.toLowerCase()}" class="w-10 h-10"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">${t(service.titleAr, service.titleEn)}</h3>
                    <p class="text-slate-600 leading-relaxed text-lg mb-6">${t(service.descAr, service.descEn)}</p>
                    <div class="h-1 w-12 bg-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </div>
                `).join('')}
            </div>
          </div>
        </section>

        <!-- Methodology Section -->
        <section class="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div class="container mx-auto px-4 relative z-10">
            <div class="text-center mb-20 space-y-4">
              <h2 class="text-3xl md:text-5xl font-bold">${t('كيف نعمل؟ استراتيجية الخبرة', 'Our Methodology: The Expertise Strategy')}</h2>
              <div class="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-12">
              ${methodology.map(m => `
                <div class="relative p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm group hover:bg-white/10 transition-all">
                  <div class="text-6xl font-black text-blue-500/20 absolute top-6 right-8 group-hover:text-blue-500/40 transition-colors">${m.step}</div>
                  <h3 class="text-2xl font-bold text-white mb-4 relative z-10">${t(m.titleAr, m.titleEn)}</h3>
                  <p class="text-slate-400 leading-relaxed relative z-10 italic">${t(m.descAr, m.descEn)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Why Choose Us Grid -->
        <section class="py-24 bg-white">
          <div class="container mx-auto px-4">
            <div class="text-center mb-16 space-y-4">
              <h2 class="text-3xl font-bold text-slate-900">${t('لماذا تختار خدمات سمارت بيزنس؟', 'Why Choose Smart Business Services?')}</h2>
              <p class="text-slate-500 max-w-2xl mx-auto">${t('نحن نجمع بين التكنولوجيا العالمية والدعم المحلي المخصص.', 'We combine global technology with dedicated local support.')}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              ${benefits.map(b => `
                <div class="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all">
                  <div class="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                    <i data-lucide="${b.icon}" class="w-8 h-8"></i>
                  </div>
                  <h4 class="text-lg font-bold text-slate-900 mb-2">${t(b.titleAr, b.titleEn)}</h4>
                  <p class="text-sm text-slate-600 leading-relaxed">${t(b.descAr, b.descEn)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        
        <!-- Action CTA -->
        <section class="py-20">
          <div class="container mx-auto px-4">
            <div class="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-12 md:p-20 text-center text-white relative shadow-2xl overflow-hidden">
               <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10"></div>
               <div class="relative z-10">
                  <h2 class="text-3xl md:text-5xl font-black mb-8">${t('اطلب استشارتك الفنية الآن', 'Request Your Technical Consultation Now')}</h2>
                  <p class="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                    ${t('فريقنا من المهندسين جاهز لمساعدتكم في اختيار أفضل الحلول الكهربائية التي تناسب حجم أعمالكم.', 'Our team of engineers is ready to help you choose the best electrical solutions that suit your business scale.')}
                  </p>
                  <div class="flex flex-wrap justify-center gap-6">
                    <a href="https://wa.me/201020046809" target="_blank" class="px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-xl hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1">
                      ${t('تواصل معنا', 'Contact Us Now')}
                    </a>
                    <a href="#/contact" class="px-10 py-5 bg-blue-500/20 border border-white/30 text-white rounded-2xl font-black text-xl backdrop-blur-sm hover:bg-blue-500/40 transition-all">
                      ${t('أرسل بريداً', 'Send Email')}
                    </a>
                  </div>
               </div>
            </div>
          </div>
        </section>
    </div>
    `;
  },


  providers: () => {
    const t = (ar, en) => Store.t(ar, en);
    return `
      <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
       <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">${t('العلامات التجارية', 'Our Brands')}</h1>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${providers
        .map(p => ({ ...p, count: products.filter(prod => prod.providerId === p.id).length }))
        .sort((a, b) => b.count - a.count)
        .map(provider => {
          const productCount = provider.count;
          const cardLink = productCount > 0 ? `href="#/products?brand=${provider.id}"` : '';
          const cardTag = productCount > 0 ? 'a' : 'div';

          return `
                <${cardTag} ${cardLink} class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group hover:shadow-md transition-all ${productCount > 0 ? 'hover:border-blue-300 hover:-translate-y-1 block' : ''}">
                    <div class="bg-white p-6 border-b border-gray-50">
                        <div class="w-full h-24 flex items-center justify-center">
                            <img src="${provider.logo}" class="max-w-full max-h-full object-contain transition-transform group-hover:scale-105">
                        </div>
                    </div>
                    <div class="p-5">
                         <h3 class="text-lg font-bold text-gray-900 mb-2 truncate" title="${t(provider.nameAr, provider.nameEn)}">${t(provider.nameAr, provider.nameEn)}</h3>
                         
                         <div class="min-h-[24px] mb-4">
                             ${productCount > 0 ? `
                             <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                                <i data-lucide="package" class="w-3.5 h-3.5 ${Store.state.language === 'ar' ? 'ml-1.5' : 'mr-1.5'}"></i>
                                ${productCount} ${t('منتج', 'Products')}
                             </span>
                             ` : ''}
                         </div>
                         
                         ${provider.website ? `
                         <span onclick="event.preventDefault(); event.stopPropagation(); window.open('${provider.website}', '_blank')" class="inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors cursor-pointer relative z-10">
                            ${t('زيارة الموقع', 'Visit Website')}
                            <i data-lucide="${Store.state.language === 'ar' ? 'arrow-left' : 'arrow-right'}" class="w-4 h-4"></i>
                         </span>
                         ` : ''}
                    </div>
                </${cardTag}>
            `;
        }).join('')}
        </div>
       </div>
      </div>
     `;
  },

  about: () => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;

    // Core Values data
    const values = [
      {
        icon: 'shield-check',
        titleAr: 'الجودة والأمان',
        titleEn: 'Quality & Safety',
        descAr: 'نلتزم بتوفير أعلى معايير الجودة والأمان في جميع توريداتنا وخدماتنا الكهربائية.',
        descEn: 'We are committed to providing the highest standards of quality and safety in all our electrical supplies and services.'
      },
      {
        icon: 'users',
        titleAr: 'الخبرة والاحترافية',
        titleEn: 'Expertise & Professionalism',
        descAr: 'فريقنا يمتلك خبرة واسعة في مجال السلامة الكهربائية لتقديم أفضل الحلول لعملائنا.',
        descEn: 'Our team possesses extensive experience in the field of electrical safety to provide the best solutions for our clients.'
      },
      {
        icon: 'award',
        titleAr: 'التفوق والتميز',
        titleEn: 'Excellence & Distinction',
        descAr: 'نسعى دائماً للتميز من خلال تمثيل كبرى العلامات التجارية العالمية في مصر.',
        descEn: 'We always strive for excellence by representing major international brands in Egypt.'
      },
      {
        icon: 'heart-handshake',
        titleAr: 'الثقة والمصداقية',
        titleEn: 'Trust & Credibility',
        descAr: 'بنينا علاقات طويلة الأمد مع عملائنا قائمة على الشفافية والمصداقية والنتائج الملموسة.',
        descEn: 'We have built long-term relationships with our clients based on transparency, credibility, and tangible results.'
      }
    ];

    return `
    <div class="min-h-screen bg-slate-50">
        <!-- Hero Section -->
        <section class="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 py-24 relative overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]"></div>
                <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]"></div>
             </div>
             
             <div class="container mx-auto px-4 text-center relative z-10">
                <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">${t('من نحن', 'About Smart Business')}</h1>
                <div class="w-24 h-1.5 bg-blue-400 mx-auto mb-8 rounded-full"></div>
                <p class="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-medium">
                  ${t(companyInfo.aboutAr, companyInfo.aboutEn)}
                </p>
             </div>
        </section>

        <!-- Stats Section -->
        <section class="py-12 -mt-16 relative z-20">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100 transform hover:-translate-y-1 transition-transform">
                <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-1 counter-value" data-target="10" data-suffix="+">0</div>
                <div class="text-gray-500 font-medium">${t('سنوات خبرة', 'Years of Experience')}</div>
              </div>
              <div class="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100 transform hover:-translate-y-1 transition-transform">
                <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-1 counter-value" data-target="1000" data-suffix="+">0</div>
                <div class="text-gray-500 font-medium">${t('عميل سعيد', 'Happy Clients')}</div>
              </div>
              <div class="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100 transform hover:-translate-y-1 transition-transform">
                <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-1 counter-value" data-target="15" data-suffix="+">0</div>
                <div class="text-gray-500 font-medium">${t('علامة تجارية', 'Top Brands')}</div>
              </div>
              <div class="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100 transform hover:-translate-y-1 transition-transform">
                <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-1 counter-value" data-target="500" data-suffix="+">0</div>
                <div class="text-gray-500 font-medium">${t('منتج متخصص', 'Specialized Products')}</div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Detailed Story Section -->
        <section class="py-20 bg-white">
          <div class="container mx-auto px-4">
            <div class="flex flex-col lg:flex-row items-center gap-16">
              <div class="lg:w-1/2">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 relative inline-block">
                  ${t('قصتنا ورحلتنا', 'Our Story & Journey')}
                  <span class="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
                </h2>
                <div class="space-y-6 text-gray-600 text-lg leading-relaxed">
                  <p>
                    ${t('تأسست سمارت بيزنس لتلبي الاحتياج المتزايد في السوق المصري لحلول السلامة الكهربائية المتطورة وأجهزة الاختبار الدقيقة. بدأنا كموزع متخصص ثم توسعنا لنصبح شركاء لأكبر الأسماء العالمية في هذا المجال.', 'Smart Business was established to meet the growing need in the Egyptian market for advanced electrical safety solutions and precision testing instruments. We started as a specialized distributor and expanded to become partners with the biggest global names in this field.')}
                  </p>
                  <p>
                    ${t('نحن نؤمن بأن السلامة الكهربائية ليست مجرد خيار، بل هي ركيزة أساسية لأي عمل صناعي أو تجاري ناجح. لذا، نحن لا نقدم فقط أجهزة، بل نقدم حلولاً متكاملة تشمل الاستشارات والدعم الفني والتدريب.', 'We believe that electrical safety is not just an option, but a fundamental pillar for any successful industrial or commercial business. Therefore, we do not just provide devices, but we provide integrated solutions that include consulting, technical support, and training.')}
                  </p>
                </div>
              </div>
              <div class="lg:w-1/2 relative">
                <div class="bg-blue-600 rounded-2xl overflow-hidden shadow-2xl skew-y-2 transform hover:skew-y-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" alt="Professional Electrical Testing" class="w-full h-80 object-cover" />
                </div>
                <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
                <div class="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Values Section -->
        <section class="py-20 bg-slate-50">
          <div class="container mx-auto px-4">
            <div class="text-center mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">${t('قيمنا الجوهرية', 'Our Core Values')}</h2>
              <p class="text-gray-500">${t('المبادئ التي تقود كل ما نقوم به في سمارت بيزنس', 'The principles that drive everything we do at Smart Business')}</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              ${values.map(val => `
                <div class="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-blue-600">
                  <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i data-lucide="${val.icon}" class="w-8 h-8"></i>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-3">${t(val.titleAr, val.titleEn)}</h3>
                  <p class="text-gray-600 leading-relaxed">${t(val.descAr, val.descEn)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Vision and Mission -->
        <section class="py-20 bg-white">
          <div class="container mx-auto px-4">
              <div class="grid md:grid-cols-2 gap-12">
                 <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <i data-lucide="eye" class="w-32 h-32"></i>
                    </div>
                    <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                      <i data-lucide="eye" class="w-8 h-8"></i>
                      ${t('رؤيتنا', 'Our Vision')}
                    </h2>
                    <p class="text-xl text-blue-50 leading-relaxed">${t(companyInfo.visionAr, companyInfo.visionEn)}</p>
                 </div>
                  <div class="bg-gradient-to-br from-indigo-800 to-blue-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <i data-lucide="target" class="w-32 h-32"></i>
                    </div>
                    <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                      <i data-lucide="target" class="w-8 h-8"></i>
                      ${t('مهمتنا', 'Our Mission')}
                    </h2>
                    <p class="text-xl text-blue-50 leading-relaxed">${t(companyInfo.missionAr, companyInfo.missionEn)}</p>
                 </div>
              </div>
          </div>
        </section>
        
        <!-- CTA Section -->
        <section class="py-20 bg-slate-50">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">${t('مستعد للبدء معنا؟', 'Ready to start with us?')}</h2>
            <div class="flex flex-wrap justify-center gap-4">
              <a href="#/contact" class="px-10 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-105">
                ${t('تواصل معنا الآن', 'Contact Us Now')}
              </a>
              <a href="#/products" class="px-10 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all transform hover:scale-105">
                ${t('تصفح منتجاتنا', 'Browse Our Products')}
              </a>
            </div>
          </div>
        </section>
    </div>
    `;
  },


  contact: () => {
    const t = (ar, en) => Store.t(ar, en);
    return `
      <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div class="container mx-auto px-4">
         <div class="text-center mb-12">
           <h1 class="text-4xl font-bold text-gray-900 mb-4">${t('تواصل معنا', 'Contact Us')}</h1>
         </div>
         <div class="grid lg:grid-cols-2 gap-12">
             <div class="space-y-6">
                 <!-- Contact Info Card -->
                 <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
                     <h2 class="text-2xl font-bold mb-6">${t('معلومات التواصل', 'Contact Information')}</h2>
                     <div class="space-y-6">
                        <div class="flex flex-col gap-3">
                          <p class="flex items-center gap-3"><i data-lucide="phone"></i> +20 10 20046809</p>
                          <p class="flex items-center gap-3"><i data-lucide="phone" class="opacity-0"></i> +20 12 23998378</p>
                        </div>
                        <p class="flex items-center gap-3"><i data-lucide="mail"></i> ${companyInfo.email}</p>
                        <p class="flex items-center gap-3"><i data-lucide="map-pin"></i> ${t(companyInfo.addressAr, companyInfo.addressEn)}</p>
                     </div>
                 </div>

                 <!-- Location Card -->
                 <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 group hover:border-blue-300 transition-all">
                     <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <i data-lucide="map" class="text-blue-600"></i>
                        ${t('موقعنا', 'Our Location')}
                     </h2>
                     <p class="text-gray-600 mb-6 text-sm">
                        ${t('تفضل بزيارتنا في مقرنا، أو انقر على الزر أدناه للحصول على الاتجاهات.', 'Visit us at our headquarters, or click the button below to get directions.')}
                     </p>
                     <a 
                        href="https://maps.app.goo.gl/TWZyYV1c5DLXkxMr8?g_st=aw" 
                        target="_blank" 
                        class="flex items-center justify-center gap-3 w-full px-6 py-4 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-md"
                     >
                        <i data-lucide="external-link" class="w-5 h-5"></i>
                        ${t('فتح في خرائط جوجل', 'Open in Google Maps')}
                     </a>
                 </div>
             </div>
            <div class="bg-white rounded-2xl shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">${t('أرسل رسالة', 'Send a Message')}</h2>
                <form onsubmit="handleContact(event)" class="space-y-6">
                    <input type="text" name="name" placeholder="${t('الاسم الكامل', 'Full Name')}" class="w-full px-4 py-3 rounded-lg border border-gray-300" required>
                    <input type="tel" name="phone" placeholder="${t('رقم الهاتف', 'Phone Number')}" class="w-full px-4 py-3 rounded-lg border border-gray-300" required>
                    <textarea name="message" rows="4" placeholder="${t('الرسالة', 'Message')}" class="w-full px-4 py-3 rounded-lg border border-gray-300" required></textarea>
                    <button type="submit" class="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-bold">${t('إرسال الرسالة', 'Send Message')}</button>
                </form>
            </div>
         </div>
        </div>
      </div>
      `;
  },

  faq: () => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;

    // FAQ Schema for SEO
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": t(faq.questionAr, faq.questionEn),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t(faq.answerAr, faq.answerEn)
        }
      }))
    };

    return `
      <!-- FAQ Schema -->
      <script type="application/ld+json">
      ${JSON.stringify(faqSchema)}
      </script>
      
      <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div class="container mx-auto px-4">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ${t('الأسئلة الشائعة', 'Frequently Asked Questions')}
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              ${t('إجابات على الأسئلة الأكثر شيوعاً حول منتجاتنا وخدماتنا', 'Answers to the most common questions about our products and services')}
            </p>
          </div>

          <!-- FAQ Items -->
          <div class="max-w-4xl mx-auto space-y-4">
            ${faqData.map((faq, index) => `
              <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-blue-300 transition-all">
                <button 
                  onclick="toggleFAQ(${index})"
                  class="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  aria-expanded="false"
                  aria-controls="faq-answer-${index}"
                >
                  <h3 class="text-lg font-bold text-gray-900 flex-1">
                    ${t(faq.questionAr, faq.questionEn)}
                  </h3>
                  <svg 
                    class="faq-icon w-6 h-6 text-blue-600 transition-transform flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div 
                  id="faq-answer-${index}" 
                  class="faq-answer hidden px-6 pb-5"
                  role="region"
                  aria-labelledby="faq-question-${index}"
                >
                  <p class="text-gray-600 leading-relaxed">
                    ${t(faq.answerAr, faq.answerEn)}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Contact CTA -->
          <div class="mt-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center">
            <h2 class="text-3xl font-bold text-white mb-4">
              ${t('لم تجد إجابة لسؤالك؟', 'Didn\'t find an answer to your question?')}
            </h2>
            <p class="text-xl text-blue-100 mb-6">
              ${t('تواصل معنا وسنكون سعداء بمساعدتك', 'Contact us and we\'ll be happy to help you')}
            </p>
            <div class="flex flex-wrap gap-4 justify-center">
              <a 
                href="https://wa.me/201020046809" 
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all hover:scale-105"
              >
                <i data-lucide="message-circle" class="w-5 h-5"></i>
                ${t('تواصل عبر واتساب', 'Contact via WhatsApp')}
              </a>
              <a 
                href="#/contact" 
                class="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-bold transition-all hover:scale-105"
              >
                <i data-lucide="mail" class="w-5 h-5"></i>
                ${t('أرسل رسالة', 'Send a Message')}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  search: (params) => {
    const t = (ar, en) => Store.t(ar, en);
    const lang = Store.state.language;
    const arrow = lang === 'ar' ? 'arrow-left' : 'arrow-right';
    const rawQuery = params.query || '';
    const query = (typeof rawQuery === 'string' ? decodeURIComponent(rawQuery) : '').trim().toLowerCase();

    if (!query) {
      return `
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
          <div class="container mx-auto px-4 text-center">
            <div class="max-w-md mx-auto py-16">
              <i data-lucide="search" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">${t('ابحث عن منتجات', 'Search for products')}</h1>
              <p class="text-gray-600">${t('استخدم شريط البحث في الأعلى لإدخال كلمة أو عبارة', 'Use the search bar above to enter a word or phrase')}</p>
            </div>
          </div>
        </div>
      `;
    }

    const matchText = (ar, en) => {
      if (!ar && !en) return false;
      return ((ar || '').toLowerCase().includes(query) || (en || '').toLowerCase().includes(query));
    };

    const matchingCategories = (categories || []).filter(c =>
      matchText(c.nameAr, c.nameEn) || matchText(c.descriptionAr, c.descriptionEn)
    );
    const matchingSubCategories = (subCategories || []).filter(s =>
      matchText(s.nameAr, s.nameEn) || matchText(s.descAr, s.descEn)
    );
    const matchingProducts = (products || []).filter(p =>
      matchText(p.nameAr, p.nameEn) ||
      matchText(p.shortDescAr, p.shortDescEn) ||
      matchText(p.fullDescAr, p.fullDescEn)
    );

    const hasResults = matchingCategories.length > 0 || matchingSubCategories.length > 0 || matchingProducts.length > 0;

    const categoriesSection = matchingCategories.length > 0 ? `
      <section class="mb-10">
        <h2 class="text-xl font-bold text-gray-900 mb-4">${t('الفئات', 'Categories')}</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${matchingCategories.map(c => `
            <a href="#/category/${c.id}" class="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all">
              <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src="${c.image}" alt="${t(c.nameAr, c.nameEn)}" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-gray-900 truncate">${t(c.nameAr, c.nameEn)}</h3>
                <p class="text-sm text-gray-500 line-clamp-1">${t(c.descriptionAr, c.descriptionEn)}</p>
              </div>
              <i data-lucide="${arrow}" class="w-5 h-5 text-blue-600 flex-shrink-0" style="transform: ${lang === 'ar' ? 'scaleX(-1)' : 'none'}"></i>
            </a>
          `).join('')}
        </div>
      </section>
    ` : '';

    const subCategoriesSection = matchingSubCategories.length > 0 ? `
      <section class="mb-10">
        <h2 class="text-xl font-bold text-gray-900 mb-4">${t('الفئات الفرعية', 'Sub-categories')}</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${matchingSubCategories.map(s => {
      const cat = (categories || []).find(c => c.id == s.categoryId);
      return `
            <a href="#/category/${s.categoryId}" class="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all">
              <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src="${s.image}" alt="${t(s.nameAr, s.nameEn)}" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-gray-900 truncate">${t(s.nameAr, s.nameEn)}</h3>
                <p class="text-sm text-gray-500 line-clamp-1">${cat ? t(cat.nameAr, cat.nameEn) : ''}</p>
              </div>
              <i data-lucide="${arrow}" class="w-5 h-5 text-blue-600 flex-shrink-0" style="transform: ${lang === 'ar' ? 'scaleX(-1)' : 'none'}"></i>
            </a>
          `;
    }).join('')}
        </div>
      </section>
    ` : '';

    const productsSection = matchingProducts.length > 0 ? `
      <section>
        <h2 class="text-xl font-bold text-gray-900 mb-4">${t('المنتجات', 'Products')}</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${matchingProducts.map(product => {
      const provider = (providers || []).find(p => p.id == product.providerId) || {};
      return `
              <a href="#/product/${product.id}" class="group product-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div class="aspect-square overflow-hidden relative">
                  <img src="${product.mainImage}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ${(provider.nameAr || provider.nameEn) ? `
                  <div class="absolute top-2 right-2 bg-blue-600 px-2 py-0.5 rounded-full text-[10px] font-medium text-white shadow-md">
                    ${t(provider.nameAr, provider.nameEn)}
                  </div>
                  ` : ''}
                </div>
                <div class="p-4">
                  <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    ${t(product.nameAr, product.nameEn)}
                  </h3>
                  <p class="text-gray-500 text-xs mb-3 line-clamp-2 h-8">${t(product.shortDescAr, product.shortDescEn)}</p>
                  <div class="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                    ${t('عرض التفاصيل', 'View Details')}
                    <i data-lucide="${arrow}" class="w-3.5 h-3.5" style="transform: ${lang === 'ar' ? 'scaleX(-1)' : 'none'}"></i>
                  </div>
                </div>
              </a>
            `;
    }).join('')}
        </div>
      </section>
    ` : '';

    const noResultsHtml = !hasResults ? `
      <div class="text-center py-16">
        <i data-lucide="package-x" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
        <h2 class="text-xl font-bold text-gray-900 mb-2">${t('لا توجد نتائج', 'No results found')}</h2>
        <p class="text-gray-600 mb-4">${t('جرب كلمات أخرى أو تصفح الفئات', 'Try different words or browse categories')}</p>
        <a href="#/categories" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          ${t('تصفح الفئات', 'Browse Categories')}
          <i data-lucide="${arrow}" class="w-5 h-5" style="transform: ${lang === 'ar' ? 'scaleX(-1)' : 'none'}"></i>
        </a>
      </div>
    ` : '';

    return `
      <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div class="container mx-auto px-4">
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <a href="#/" class="hover:text-blue-600">${t('الرئيسية', 'Home')}</a>
            <span>/</span>
            <span class="text-gray-900 font-medium">${t('بحث', 'Search')}: "${query}"</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-8">${t('نتائج البحث', 'Search Results')}</h1>
          ${categoriesSection}
          ${subCategoriesSection}
          ${productsSection}
          ${noResultsHtml}
        </div>
      </div>
    `;
  },

  trustedBy: () => {
    const t = (ar, en) => Store.t(ar, en);
    const featuredProviders = providers.filter(p => p.isTrustedPartner);

    return `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <section class="bg-gradient-to-br from-blue-600 to-blue-800 py-20 overflow-hidden text-center relative">
         <div class="relative z-10 container mx-auto px-4">
             <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">${t('شركاء النجاح', 'Trusted Partners')}</h1>
         </div>
      </section>
      
      <section class="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${t('العلامات التجارية الموثوقة', 'Trusted Brands')}</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
             ${featuredProviders.map(provider => `
                <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div class="h-40 flex items-center justify-center mb-6">
                        <img src="${provider.logo}" alt="${t(provider.nameAr, provider.nameEn)}" class="max-w-full max-h-full object-contain">
                    </div>
                    <h3 class="text-xl font-bold text-gray-900">${t(provider.nameAr, provider.nameEn)}</h3>
                </div>
             `).join('')}
          </div>
        </div>
      </section>
    </div>
    `;
  }
};

// Products Page Filter Functions
window.updateProductFilters = () => {
  const categoryFilter = document.getElementById('category-filter');
  const productSearch = document.getElementById('product-search');
  const trustedFilter = document.getElementById('trusted-filter');
  const inStockFilter = document.getElementById('instock-filter');
  const providerCheckboxes = document.querySelectorAll('.provider-checkbox');
  const subcategoryCheckboxes = document.querySelectorAll('.subcategory-checkbox');
  const productItems = document.querySelectorAll('.product-item');
  const productCount = document.getElementById('product-count');
  const noProductsMessage = document.getElementById('no-products-message');
  const productsGrid = document.getElementById('products-grid');

  if (!categoryFilter || !productItems.length) return;

  // Get filter values
  const selectedCategory = categoryFilter.value;
  const searchText = (productSearch?.value || '').toLowerCase().trim();
  const trustedOnly = trustedFilter?.checked || false;
  const inStockOnly = inStockFilter?.checked || false;

  const selectedProviders = Array.from(providerCheckboxes || [])
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const selectedSubCategories = Array.from(subcategoryCheckboxes || [])
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  // Update sub-category options based on selected category
  updateSubCategoryOptions(selectedCategory);

  let visibleCount = 0;

  productItems.forEach(item => {
    const itemCategoryId = item.dataset.categoryId;
    const itemSubCategoryId = item.dataset.subcategoryId;
    const itemProviderId = item.dataset.providerId;
    const itemIsTrusted = item.dataset.isTrusted === '1';
    const itemInStock = item.dataset.inStock === '1';
    const itemSearchText = item.dataset.searchText || '';

    // Check category filter
    const categoryMatch = selectedCategory === 'all' || itemCategoryId == selectedCategory;

    // Check sub-category filter
    const subCategoryMatch = selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(itemSubCategoryId);

    // Check provider filter
    const providerMatch = selectedProviders.length === 0 ||
      selectedProviders.includes(itemProviderId);

    // Check trusted filter
    const trustedMatch = !trustedOnly || itemIsTrusted;

    // Check in-stock filter
    const inStockMatch = !inStockOnly || itemInStock;

    // Check search filter
    const searchMatch = !searchText || itemSearchText.includes(searchText);

    // Show/hide based on all filters
    if (categoryMatch && subCategoryMatch && providerMatch && trustedMatch && inStockMatch && searchMatch) {
      item.style.display = 'block';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });

  // Update product count
  if (productCount) {
    productCount.textContent = visibleCount;
  }

  // Show/hide no results message
  if (noProductsMessage && productsGrid) {
    if (visibleCount === 0) {
      productsGrid.classList.add('hidden');
      noProductsMessage.classList.remove('hidden');
    } else {
      productsGrid.classList.remove('hidden');
      noProductsMessage.classList.add('hidden');
    }
  }

  // Reinitialize lucide icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
};

window.updateSubCategoryOptions = (categoryId) => {
  const subCategorySection = document.getElementById('subcategory-filter-section');
  const subCategoryCheckboxes = document.getElementById('subcategory-checkboxes');

  if (!subCategorySection || !subCategoryCheckboxes) return;

  if (categoryId === 'all') {
    subCategorySection.style.display = 'none';
    return;
  }

  // Get sub-categories for the selected category
  const categorySubCategories = (window.subCategories || []).filter(s => s.categoryId == categoryId);

  if (categorySubCategories.length === 0) {
    subCategorySection.style.display = 'none';
    return;
  }

  // Show section and populate checkboxes
  subCategorySection.style.display = 'block';

  const t = Store.t.bind(Store);
  subCategoryCheckboxes.innerHTML = categorySubCategories.map(sub => `
    <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
      <input 
        type="checkbox" 
        class="subcategory-checkbox w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        value="${sub.id}"
        onchange="updateProductFilters()"
      />
      <span class="text-sm text-gray-700">${t(sub.nameAr, sub.nameEn)}</span>
    </label>
  `).join('');
};

window.changeViewMode = (mode) => {
  const productsGrid = document.getElementById('products-grid');
  const productItems = document.querySelectorAll('.product-item');
  const viewButtons = document.querySelectorAll('.view-mode-btn');

  if (!productsGrid) return;

  // Update button states
  viewButtons.forEach(btn => {
    btn.classList.remove('border-blue-600', 'bg-blue-50', 'text-blue-600');
    btn.classList.add('border-gray-300', 'bg-white', 'text-gray-600');
  });

  const activeButton = document.getElementById(`view-${mode}`);
  if (activeButton) {
    activeButton.classList.remove('border-gray-300', 'bg-white', 'text-gray-600');
    activeButton.classList.add('border-blue-600', 'bg-blue-50', 'text-blue-600');
  }

  // Update grid layout
  if (mode === 'grid-4') {
    productsGrid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
    productItems.forEach(item => {
      item.classList.remove('product-list-view');
      item.classList.add('product-grid-view');
      const gridContent = item.querySelector('.grid-content');
      const listContent = item.querySelector('.list-content');
      if (gridContent) gridContent.classList.remove('hidden');
      if (listContent) listContent.classList.add('hidden');
    });
  } else if (mode === 'grid-3') {
    productsGrid.className = 'grid grid-cols-2 md:grid-cols-3 gap-4';
    productItems.forEach(item => {
      item.classList.remove('product-list-view');
      item.classList.add('product-grid-view');
      const gridContent = item.querySelector('.grid-content');
      const listContent = item.querySelector('.list-content');
      if (gridContent) gridContent.classList.remove('hidden');
      if (listContent) listContent.classList.add('hidden');
    });
  } else if (mode === 'list') {
    productsGrid.className = 'flex flex-col gap-4';
    productItems.forEach(item => {
      item.classList.remove('product-grid-view');
      item.classList.add('product-list-view');
      const gridContent = item.querySelector('.grid-content');
      const listContent = item.querySelector('.list-content');
      if (gridContent) gridContent.classList.add('hidden');
      if (listContent) listContent.classList.remove('hidden');
    });
  }

  // Reinitialize lucide icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
};

window.clearProductFilters = () => {
  const categoryFilter = document.getElementById('category-filter');
  const productSearch = document.getElementById('product-search');
  const trustedFilter = document.getElementById('trusted-filter');
  const inStockFilter = document.getElementById('instock-filter');
  const providerCheckboxes = document.querySelectorAll('.provider-checkbox');
  const subcategoryCheckboxes = document.querySelectorAll('.subcategory-checkbox');

  if (categoryFilter) categoryFilter.value = 'all';
  if (productSearch) productSearch.value = '';
  if (trustedFilter) trustedFilter.checked = false;
  if (inStockFilter) inStockFilter.checked = false;

  providerCheckboxes.forEach(cb => cb.checked = false);
  subcategoryCheckboxes.forEach(cb => cb.checked = false);

  updateProductFilters();
};

// Router Logic
const router = {
  routes: {
    '/': Pages.home,
    '/categories': Pages.categories,
    '/products': Pages.products,
    '/category/:id': Pages.category,
    '/product/:id': Pages.product,
    '/search/:query': Pages.search,
    '/providers': Pages.providers,
    '/trusted-by': Pages.trustedBy,
    '/services': Pages.services,
    '/about': Pages.about,
    '/contact': Pages.contact,
    '/faq': Pages.faq
  },

  matchRoute(hash) {
    const path = (hash.slice(1) || '/').split('?')[0];

    for (const route in this.routes) {
      if (route.includes(':')) {
        // Handle logic for dynamic routes like /product/:id
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        if (routeParts.length === pathParts.length) {
          const params = {};
          let match = true;

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              params[routeParts[i].slice(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }

          if (match) {
            return { render: this.routes[route], params };
          }
        }
      } else if (route === path) {
        return { render: this.routes[route], params: {} };
      }
    }

    return { render: Pages.home, params: {} }; // Default 404 fallback to home
  },

  handleRoute() {
    const main = document.getElementById('main-container');
    if (!main) return;

    // Re-render header to update active state
    try { renderHeader(); } catch (e) { console.error('renderHeader:', e); }

    try {
      const { render, params } = this.matchRoute(window.location.hash);
      main.innerHTML = render(params);
      window.scrollTo(0, 0);
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();

      // Initialize counters if on home page or about page
      if (window.location.hash === '' || window.location.hash === '#/' || window.location.hash === '#/about') {
        setTimeout(() => initCounters(), 100);
      }

      // If we're on the products page, explicitly trigger filter update
      // This handles deep links and brand-specific navigation
      if (typeof updateProductFilters === 'function') {
        setTimeout(() => updateProductFilters(), 0);
      }
    } catch (error) {
      console.error('Error in handleRoute:', error);
      main.innerHTML = `<div class="p-10 text-center text-red-600">Error loading page: ${error.message}</div>`;
    }
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // Initial load
    this.handleRoute();
  }
};

// Search: navigate to search results
window.handleSearch = (e) => {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[name="q"]');
  const q = (input && input.value && input.value.trim()) || '';
  if (!q) return;
  const encoded = encodeURIComponent(q);
  window.location.hash = '#/search/' + encoded;
  if (input) input.value = '';
};

// Global handlers for forms (since we use inline HTML strings)
window.handleProductQuote = (e, productId) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const phone = formData.get('phone');
  if (!name || !phone) return;

  const product = products.find(p => p.id == productId);
  const provider = providers.find(p => p.id == product.providerId);

  const quantity = formData.get('quantity');
  const t = Store.t.bind(Store); // helper

  const lang = Store.state.language;

  const message = lang === 'ar'
    ? `مرحباً، أنا ${name}\nأرغب بطلب عرض سعر للمنتج التالي:\n\n📦 ${t(product.nameAr, product.nameEn)}\n🏭 المورّد: ${t(provider.nameAr, provider.nameEn)}\n📊 الكمية: ${quantity}\n📱 رقم الهاتف: ${phone}`
    : `Hello, I'm ${name}\nI would like to request a quote for the following product:\n\n📦 ${t(product.nameAr, product.nameEn)}\nProvider: ${t(provider.nameAr, provider.nameEn)}\nQuantity: ${quantity}\nPhone: ${phone}`;

  const whatsappUrl = `https://wa.me/2${companyInfo.phoneWhatsApp}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');

  showToast(t('تم!', 'Success!'), t('جاري فتح واتساب...', 'Opening WhatsApp...'));
};

window.handleContact = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const msg = formData.get('message');

  const lang = Store.state.language;
  const t = Store.t.bind(Store);

  const message = `Name: ${name}\nPhone: ${phone}\nMessage: ${msg}`;
  const whatsappUrl = `https://wa.me/2${companyInfo.phoneWhatsApp}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank');
  showToast(t('تم!', 'Success!'), t('جاري فتح واتساب...', 'Opening WhatsApp...'));
};


// Applied when both sub and provider filters exist on the page
function applyCategoryFilters() {
  const cards = document.querySelectorAll('.product-card');
  const subActive = document.querySelector('.sub-filter-btn.active');
  const providerActive = document.querySelector('.filter-btn.active');
  const currentSub = subActive ? subActive.dataset.subId : 'all';
  const currentProvider = providerActive ? providerActive.dataset.id : 'all';
  let visibleCount = 0;

  cards.forEach(card => {
    const subMatch = currentSub === 'all' || (card.dataset.subCategoryId || '') === String(currentSub);
    const providerMatch = currentProvider === 'all' || card.dataset.providerId === String(currentProvider);
    if (subMatch && providerMatch) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const noResults = document.getElementById('no-results-msg');
  if (noResults) noResults.classList.toggle('hidden', visibleCount > 0);
}

// Filter by sub-category (when category has sub-categories)
window.filterBySubCategory = (subId) => {
  const subBtns = document.querySelectorAll('.sub-filter-btn');
  subBtns.forEach(btn => {
    if (btn.dataset.subId === String(subId)) {
      btn.classList.add('active', 'border-blue-500', 'bg-blue-50');
      btn.classList.remove('border-gray-200', 'bg-white');
    } else {
      btn.classList.remove('active', 'border-blue-500', 'bg-blue-50');
      btn.classList.add('border-gray-200', 'bg-white');
    }
  });
  applyCategoryFilters();
  if (window.lucide) lucide.createIcons();
};

// Filter Products Function (provider filter)
window.filterProducts = (providerId) => {
  const cards = document.querySelectorAll('.product-card');
  const buttons = document.querySelectorAll('.filter-btn');

  // Update provider buttons
  buttons.forEach(btn => {
    if (btn.dataset.id === String(providerId)) {
      btn.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-100');
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md', 'hover:scale-105', 'active');
    } else {
      btn.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-100');
      btn.classList.remove('bg-blue-600', 'text-white', 'shadow-md', 'hover:scale-105');
      btn.classList.remove('active');
    }
  });

  // If sub-category filters exist, apply both; otherwise legacy single filter
  if (document.querySelector('.sub-filter-btn')) {
    applyCategoryFilters();
  } else {
    let visibleCount = 0;
    cards.forEach(card => {
      if (providerId === 'all' || card.dataset.providerId === String(providerId)) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    const noResults = document.getElementById('no-results-msg');
    if (noResults) noResults.classList.toggle('hidden', visibleCount > 0);
  }
};

// Connect Router to Window
window.router = router;

// Show app with current data (used after API load or on init)
function showAppWithData() {
  try { renderHeader(); } catch (e) { console.error('renderHeader:', e); }
  try { renderFooter(); } catch (e) { console.error('renderFooter:', e); }
  if (window.router) {
    if (!window.router._listenerAttached) {
      window.addEventListener('hashchange', () => window.router.handleRoute());
      window.router._listenerAttached = true;
    }
    window.router.handleRoute();
  }
}

// App Initialization: show UI immediately, then load data in background
document.addEventListener('DOMContentLoaded', () => {
  window.categories = window.categories || [];
  window.subCategories = window.subCategories || [];
  window.providers = window.providers || [];
  window.products = window.products || [];
  window.services = window.services || [];
  window.companyInfo = window.companyInfo || {};
  window.clients = window.clients || [];

  // Show full app right away (header, footer, home with empty data)
  showAppWithData();

  // Load data in background; when done, refresh the current page
  fetchAppData()
    .then((data) => {
      if (data) {
        window.appData = data;
        window.categories = data.categories || [];
        window.subCategories = data.subCategories || [];
        window.providers = data.providers || [];
        window.products = data.products || [];
        window.services = data.services || [];
        window.companyInfo = data.companyInfo || {};

        // Prioritize "Electrical Testing" category products
        const electricalTestingCat = window.categories.find(c =>
          (c.nameEn && c.nameEn.toLowerCase().includes('electrical testing')) ||
          (c.nameAr && c.nameAr.includes('الاختبار الكهربائية'))
        );
        if (electricalTestingCat && window.products.length > 0) {
          window.products.sort((a, b) => {
            const aIsElectrical = a.categoryId == electricalTestingCat.id;
            const bIsElectrical = b.categoryId == electricalTestingCat.id;
            if (aIsElectrical && !bIsElectrical) return -1;
            if (!aIsElectrical && bIsElectrical) return 1;
            return 0;
          });
        }

        // Override WhatsApp phone number to the requested one
        if (window.companyInfo) window.companyInfo.phoneWhatsApp = '1020046809';
        window.clients = data.clients || [];
      }
      showAppWithData();
    })
    .catch((error) => {
      console.error('Failed to load data:', error);
      const main = document.getElementById('main-container');
      if (main) {
        const t = Store.t.bind(Store);
        main.innerHTML = `
          <div class="container mx-auto px-4 py-12">
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-2xl">
              <h2 class="text-lg font-bold text-amber-800 mb-2">${t('تعذر تحميل البيانات', 'Could not load data')}</h2>
              <p class="text-amber-700 mb-2">${t('التحقق من الاتصال أو تشغيل CORS. تفاصيل في Console (F12).', 'Check connection or CORS. See Console (F12) for details.')}</p>
              <p class="text-sm text-gray-600 mb-4">${String(error.message)}</p>
              <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">${t('إعادة المحاولة', 'Retry')}</button>
            </div>
          </div>`;
      }
      try { renderHeader(); } catch (e) { }
      try { renderFooter(); } catch (e) { }
    });
});

// FAQ Toggle Function
function toggleFAQ(index) {
  const answer = document.getElementById(`faq-answer-${index}`);
  const button = answer.previousElementSibling;
  const icon = button.querySelector('.faq-icon');

  if (answer.classList.contains('hidden')) {
    answer.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
    button.setAttribute('aria-expanded', 'true');
  } else {
    answer.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
    button.setAttribute('aria-expanded', 'false');
  }
}

// Mobile Filter Toggle
function toggleMobileFilter() {
  const sidebar = document.getElementById('filter-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('hidden');
    // Lock scroll when filter is open on mobile
    if (!sidebar.classList.contains('hidden')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    if (window.lucide) lucide.createIcons();
  }
}

// Global Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');
  const duration = 2000; // 2 seconds animation

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function for smooth finish
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      const currentValue = Math.floor(easedProgress * target);
      counter.innerText = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target + suffix;
      }
    }

    requestAnimationFrame(updateCount);
  });
}
