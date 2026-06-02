// ===== AUTH CHECK =====
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "login.html";
}
document.getElementById("username").innerText = user.name;

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// ===== PAGE NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== HAMBURGER =====
function toggleMobile() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ===== SCROLL NAV =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// ===== FAQ =====
function toggleFaq(el) {
  const allQ = document.querySelectorAll('.faq-q');
  const allA = document.querySelectorAll('.faq-a');
  const idx = Array.from(allQ).indexOf(el);
  allQ.forEach((q, i) => {
    if (i === idx) {
      const isOpen = q.classList.contains('open');
      q.classList.toggle('open', !isOpen);
      allA[i].classList.toggle('open', !isOpen);
    } else {
      q.classList.remove('open');
      allA[i].classList.remove('open');
    }
  });
}

// ===== BOOKING FORM =====
const API = "http://localhost:5000/api";

async function submitBooking() {
  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const pickup  = document.getElementById('f-pickup').value.trim();
  const drop    = document.getElementById('f-drop').value;
  const goods   = document.getElementById('f-goods').value;
  const weight  = document.getElementById('f-weight').value;
  const notes   = document.getElementById('f-notes').value.trim();
  const company = document.getElementById('f-company').value.trim();

  // Validation
  if (!name || !phone || !pickup || !drop || !goods) {
    alert('Please fill in all required fields (marked with *).');
    return;
  }

  const data = {
    userId:    user.id,
    name:      name,
    phone:     phone,
    pickup:    pickup,
    drop:      drop,
    truckType: goods + (weight ? ' | ' + weight : '') , // goods + weight combine karke truckType mein bhejo
    notes:     notes,
    company:   company
  };

  try {
    const res = await fetch(`${API}/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      // Success — show success state
      const ref = 'MX-' + Math.floor(10000 + Math.random() * 90000);
      document.getElementById('booking-ref').textContent = 'Reference #' + ref;
      document.getElementById('booking-form-state').classList.add('hidden');
      document.getElementById('booking-success-state').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Booking failed: ' + (result.error || result.message));
    }

  } catch (err) {
    console.error('Booking error:', err);
    alert('Server se connect nahi ho pa raha. Backend chal raha hai? Error: ' + err.message);
  }
}

function resetBooking() {
  document.getElementById('booking-form-state').classList.remove('hidden');
  document.getElementById('booking-success-state').classList.add('hidden');
  ['f-name', 'f-phone', 'f-company', 'f-pickup', 'f-notes'].forEach(id => document.getElementById(id).value = '');
  ['f-drop', 'f-goods', 'f-weight'].forEach(id => document.getElementById(id).selectedIndex = 0);
}

// ===== CONTACT FORM =====
function submitContact() {
  const name = document.getElementById('c-name').value.trim();
  const phone = document.getElementById('c-phone').value.trim();
  const msg = document.getElementById('c-message').value.trim();
  if (!name || !phone || !msg) {
    alert('Please fill in your name, phone number, and message.');
    return;
  }
  document.getElementById('contact-success').classList.remove('hidden');
  ['c-name', 'c-phone', 'c-email', 'c-message'].forEach(id => document.getElementById(id).value = '');
  setTimeout(() => document.getElementById('contact-success').classList.add('hidden'), 6000);
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.trust-card, .service-card, .testi-card, .why-feature, .value-card, .faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});