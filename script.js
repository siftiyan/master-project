/**
 * Script Simpel - Portal Akses Project Brighton
 * Fitur: Pencarian Real-Time, Salin Akun (Copy) 1-Klik, & Auto-Slider Cepat Project 07
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  const cards = document.querySelectorAll('.card');
  const cardCount = document.getElementById('cardCount');
  const noResult = document.getElementById('noResult');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');

  let toastTimeout;

  // 1. Tampilkan Pop-up Notifikasi Berhasil Salin
  function triggerToast(text) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastText.textContent = `Tersalin: ${text}`;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  // 2. Fitur Salin Clipboard 1-Klik
  document.addEventListener('click', (e) => {
    const copyTarget = e.target.closest('[data-copy]');
    if (copyTarget) {
      e.preventDefault();
      const value = copyTarget.getAttribute('data-copy');
      
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(() => triggerToast(value));
      } else {
        // Fallback untuk browser / webview lama
        const temp = document.createElement('textarea');
        temp.value = value;
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand('copy');
          triggerToast(value);
        } catch (err) {
          triggerToast('Gagal menyalin');
        }
        document.body.removeChild(temp);
      }
    }
  });

  // 3. Pencarian Kata Kunci Real-Time
  function searchProjects() {
    const query = searchInput.value.trim().toLowerCase();
    let count = 0;

    // Tampilkan tombol 'X' hanya saat ada teks
    clearBtn.style.display = query ? 'block' : 'none';

    cards.forEach((card) => {
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const content = card.innerText.toLowerCase();

      if (query === '' || content.includes(query) || keywords.includes(query)) {
        card.classList.remove('hidden');
        count++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (cardCount) cardCount.textContent = count;
    
    // Kelola tampilan jika tidak ada kartu yang cocok
    if (noResult) {
      if (count === 0) {
        noResult.classList.remove('hidden');
      } else {
        noResult.classList.add('hidden');
      }
    }
  }

  searchInput.addEventListener('input', searchProjects);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchProjects();
    searchInput.focus();
  });

  // 4. Auto-Sliding Gallery Cepat untuk Project 07
  const p7Slider = document.getElementById('p7Slider');
  const p7Slides = document.getElementById('p7Slides');
  const p7DotsContainer = document.getElementById('p7Dots');

  if (p7Slider && p7Slides && p7DotsContainer) {
    const slides = p7Slides.querySelectorAll('.p7-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let slideInterval;

    // Fallback ekstensi otomatis (.jpg -> .JPG -> .png -> .jpeg -> .webp)
    slides.forEach((slide) => {
      const img = slide.querySelector('img');
      if (!img) return;
      const exts = ['.JPG', '.png', '.jpeg', '.webp'];
      let attempt = 0;
      img.addEventListener('error', () => {
        if (attempt < exts.length) {
          const base = img.src.replace(/\.[^/.]+$/, '');
          img.src = base + exts[attempt++];
        }
      });
    });

    // Buat indikator titik (dots) sesuai jumlah foto
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'p7-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Foto ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartAutoSlide();
      });
      p7DotsContainer.appendChild(dot);
    });

    const dots = p7DotsContainer.querySelectorAll('.p7-dot');

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      p7Slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function startAutoSlide() {
      slideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 2000); // Bergeser otomatis setiap 2 detik
    }

    function restartAutoSlide() {
      clearInterval(slideInterval);
      startAutoSlide();
    }

    // Jeda otomatis saat kursor diarahkan ke foto (desktop)
    p7Slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    p7Slider.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }
});