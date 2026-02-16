function renderHeader() {
  const t = (ar, en) => Store.t(ar, en);
  const lang = Store.state.language;

  const navLinks = [
    { path: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
    { path: '/categories', labelAr: 'المنتجات', labelEn: 'Products' },
    { path: '/trusted-by', labelAr: 'شركاء النجاح', labelEn: 'Trusted Partners' },
    { path: '/providers', labelAr: 'الموردين', labelEn: 'Providers' },
    { path: '/services', labelAr: 'الخدمات', labelEn: 'Services' },
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
              src="https://via.placeholder.com/150?text=Logo"
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

  document.getElementById('header-container').innerHTML = headerHtml;
  lucide.createIcons();
}

function renderFooter() {
  const t = (ar, en) => Store.t(ar, en);

  const quickLinks = [
    { path: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
    { path: '/categories', labelAr: 'المنتجات', labelEn: 'Products' },
    { path: '/trusted-by', labelAr: 'شركاء النجاح', labelEn: 'Trusted Partners' },
    { path: '/providers', labelAr: 'الموردين', labelEn: 'Providers' },
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
                  src="https://via.placeholder.com/150?text=Logo"
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
  document.getElementById('footer-container').innerHTML = footerHtml;
  lucide.createIcons();
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
