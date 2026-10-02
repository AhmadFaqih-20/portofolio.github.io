// ===== DARK MODE TOGGLE =====
const darkModeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;
const body = document.body;

// Check saved preference
const savedMode = localStorage.getItem('darkMode') === 'true';
if (savedMode) {
  body.classList.add('dark-mode');
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    updateCursorColor();
  });
}

// ===== CUSTOM CURSOR =====
function updateCursorColor() {
  const isDark = body.classList.contains('dark-mode');
  const cursorColor = isDark ? '%23e94560' : '%23e94560';
  body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="3" fill="${cursorColor}"/><circle cx="16" cy="16" r="10" fill="none" stroke="${cursorColor}" stroke-width="1" opacity="0.5"/></svg>'), auto`;
}

document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  // Custom cursor effect
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }
});

// ===== AOS INITIALIZATION =====
AOS.init({
  duration: 800,
  easing: 'ease-in-out-quad',
  once: true,
  offset: 100
});

// ===== NAVBAR ACTIVE LINK =====
const navLinks = document.querySelectorAll('#navbarNav .nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || !href) return;

    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const navHeight = document.querySelector('#main-navbar')?.offsetHeight || 0;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== PROJECT CARDS MODAL =====
const projectData = [
  {
    title: 'Portfolio Website',
    description: 'Personal portfolio built with HTML5, CSS3, and Vanilla JavaScript. Features responsive design, smooth animations, and glassmorphism UI elements. Demonstrates knowledge of modern web design principles.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Responsive']
  },
  {
    title: 'Design Experiment',
    description: 'Exploration on layout, spacing, typography, branding, and creative composition for digital interfaces. This project focuses on UI/UX principles and modern design trends.',
    tech: ['UI Design', 'UX', 'Figma', 'Prototyping', 'Creativity']
  },
  {
    title: 'App Concept',
    description: 'Concept design for an innovative mobile or web application focused on productivity and user engagement. Includes wireframes, user flows, and interactive prototypes.',
    tech: ['App Design', 'Prototyping', 'User Research', 'Interaction', 'Wireframes']
  }
];

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    showProjectModal(projectData[index]);
  });
});

function showProjectModal(project) {
  const modalHTML = `
    <div class="modal fade" id="projectDetailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <h5 class="modal-title">${project.title}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="project-modal-content">
              <div class="project-modal-icon"><i class="fa-solid fa-laptop-code"></i></div>
              <p>${project.description}</p>
              <div>
                <strong style="color: #e94560; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Technologies</strong>
                <div class="project-modal-tech" style="margin-top: 10px;">
                  ${project.tech.map(t => `<span>${t}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="border-top: 1px solid rgba(233, 69, 96, 0.3);">
            <button type="button" class="btn btn-primary btn-custom" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove old modal if exists
  const oldModal = document.getElementById('projectDetailModal');
  if (oldModal) oldModal.remove();
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
  modal.show();
  
  // Remove modal from DOM when hidden
  document.getElementById('projectDetailModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
}

// ===== CONTACT FORM HANDLER =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('emailInput').value;
    const message = document.getElementById('messageInput').value;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Silakan masukkan email yang valid');
      return;
    }

    if (message.trim().length < 10) {
      alert('Pesan harus minimal 10 karakter');
      return;
    }

    // Success
    alert('Terima kasih! Pesan Anda telah berhasil dikirim. Saya akan segera menghubungi Anda.');
    contactForm.reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
    if (modal) modal.hide();
  });
}

// ===== RESUME DOWNLOAD =====
const resumeBtn = document.querySelector('.resume-download');
if (resumeBtn) {
  resumeBtn.addEventListener('click', () => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual resume URL
    link.download = 'Ahmad-Faqihm-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// ===== FOOTER YEAR =====
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===== SKILL PROGRESS ANIMATION =====
const skillBars = document.querySelectorAll('.progress-bar span');
let animated = false;

window.addEventListener('scroll', () => {
  if (!animated && document.querySelector('.skills-section')) {
    const skillsTop = document.querySelector('.skills-section').offsetTop;
    if (scrollY >= skillsTop - 300) {
      skillBars.forEach(bar => {
        bar.style.width = bar.parentElement.querySelector('span').style.width;
      });
      animated = true;
    }
  }
});

// ===== PARALLAX EFFECT =====
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      heroSection.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    }
  });
}

// ===== NAVBAR HOVER EFFECT =====
const navbar = document.querySelector('#main-navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
  } else {
    navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
  }
});

// ===== LOG =====
console.log('%c✨ Ahmad Faqihm Portfolio ✨', 'color: #e94560; font-size: 16px; font-weight: bold;');
console.log('%cGlassmorphism + Brutalism Design', 'color: #fff; font-size: 12px;');