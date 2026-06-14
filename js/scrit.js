// MoveX Script v2
const API = "https://api.movex.services/api";

// ===== AUTH CHECK — LANDING PAGE FIRST =====
const user = JSON.parse(localStorage.getItem("user"));

// Navbar update based on login status
function updateNavbar() {
  const userPill = document.getElementById("user-pill");
  const logoutBtn = document.querySelector(".logout-btn");
  const usernameEl = document.getElementById("username");

  if(user) {
    if(usernameEl) usernameEl.innerText = user.name;
    if(userPill) userPill.style.display = "flex";
    if(logoutBtn) logoutBtn.style.display = "flex";
  } else {
    if(userPill) userPill.style.display = "none";
    if(logoutBtn) logoutBtn.style.display = "none";
  }
}
updateNavbar();

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// ===== PAGE NAVIGATION =====
function showPage(id) {
  // Auth check for protected pages
  if((id === 'dashboard' || id === 'booking') && !user) {
    alert("⚠️ Please login first to continue!");
    window.location.href = "login.html";
    return;
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if(navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if(id === 'dashboard') loadDashboard();
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
    if(i === idx) {
      const isOpen = q.classList.contains('open');
      q.classList.toggle('open', !isOpen);
      allA[i].classList.toggle('open', !isOpen);
    } else {
      q.classList.remove('open');
      allA[i].classList.remove('open');
    }
  });
}

// ===== DASHBOARD =====
let allBookings = [];
let currentTab = 'current';

function loadDashboard() {
  if(!user) { window.location.href = "login.html"; return; }
  document.getElementById('dash-name').innerText = user.name;
  document.getElementById('dash-email').innerText = user.email;
  document.getElementById('dash-username').innerText = user.name;
  document.getElementById('dash-avatar').innerText = user.name.charAt(0).toUpperCase();
  fetchBookings();
}

async function fetchBookings() {
  document.getElementById('dash-loading').style.display = 'block';
  document.getElementById('dash-empty').style.display = 'none';
  document.getElementById('dash-current-list').innerHTML = '';
  document.getElementById('dash-previous-list').innerHTML = '';

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/bookings/${user.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    allBookings = Array.isArray(data) ? data : (data.bookings || []);
    document.getElementById('dash-loading').style.display = 'none';

    const pending = allBookings.filter(b => b.status === 'Pending' || !b.status);
    const completed = allBookings.filter(b => b.status === 'Completed');
    document.getElementById('stat-total').innerText = allBookings.length;
    document.getElementById('stat-pending').innerText = pending.length;
    document.getElementById('stat-completed').innerText = completed.length;

    renderBookings();
  } catch(err) {
    document.getElementById('dash-loading').innerHTML = '<div style="color:red;text-align:center;">❌ Could not load bookings.</div>';
  }
}

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-current').style.background = tab === 'current' ? 'var(--orange)' : '#f1f5f9';
  document.getElementById('tab-current').style.color = tab === 'current' ? 'white' : 'var(--navy)';
  document.getElementById('tab-previous').style.background = tab === 'previous' ? 'var(--orange)' : '#f1f5f9';
  document.getElementById('tab-previous').style.color = tab === 'previous' ? 'white' : 'var(--navy)';
  document.getElementById('dash-current-list').style.display = tab === 'current' ? 'block' : 'none';
  document.getElementById('dash-previous-list').style.display = tab === 'previous' ? 'block' : 'none';
  renderBookings();
}

function renderBookings() {
  const current = allBookings.filter(b => b.status === 'Pending' || !b.status);
  const previous = allBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');
  const bookings = currentTab === 'current' ? current : previous;
  const listId = currentTab === 'current' ? 'dash-current-list' : 'dash-previous-list';

  if(bookings.length === 0) {
    document.getElementById('dash-empty').style.display = 'block';
    document.getElementById(listId).innerHTML = '';
    return;
  }

  document.getElementById('dash-empty').style.display = 'none';
  document.getElementById(listId).innerHTML = bookings.map(b => `
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:16px;transition:box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
        <div style="font-weight:700;color:var(--navy);font-size:0.95rem;">📦 ${b.truckType || 'Goods Transport'}</div>
        <span style="background:${b.status === 'Completed' ? '#f0fdf4' : b.status === 'Cancelled' ? '#fef2f2' : '#fef3c7'};
                     color:${b.status === 'Completed' ? '#16a34a' : b.status === 'Cancelled' ? '#dc2626' : '#d97706'};
                     padding:4px 14px;border-radius:20px;font-size:0.78rem;font-weight:600;">
          ${b.status || 'Pending'}
        </span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div style="font-size:0.85rem;color:var(--gray);">📍 <span style="color:var(--navy);font-weight:500;">Pickup:</span> ${b.pickup}</div>
        <div style="font-size:0.85rem;color:var(--gray);">🏁 <span style="color:var(--navy);font-weight:500;">Drop:</span> ${b.drop}</div>
        <div style="font-size:0.85rem;color:var(--gray);">📱 <span style="color:var(--navy);font-weight:500;">Phone:</span> ${b.phone}</div>
        <div style="font-size:0.85rem;color:var(--gray);">📅 <span style="color:var(--navy);font-weight:500;">Date:</span> ${new Date(b.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</div>
        ${b.company ? `<div style="font-size:0.85rem;color:var(--gray);">🏢 <span style="color:var(--navy);font-weight:500;">Company:</span> ${b.company}</div>` : ''}
      </div>
      ${b.notes ? `<div style="margin-top:10px;font-size:0.83rem;color:var(--gray);background:#f8fafc;padding:8px 12px;border-radius:8px;">📝 ${b.notes}</div>` : ''}
    </div>
  `).join('');
}

// ===== BOOKING FORM =====
async function submitBooking() {
  // Auth check
  if(!user) {
    alert("⚠️ Please login first to book a transport!");
    window.location.href = "login.html";
    return;
  }

  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const pickup  = document.getElementById('f-pickup').value.trim();
  const drop    = document.getElementById('f-drop').value.trim();
  const goods   = document.getElementById('f-goods').value;
  const weight  = document.getElementById('f-weight').value;
  const notes   = document.getElementById('f-notes').value.trim();
  const company = document.getElementById('f-company').value.trim();

  if(!name) { alert('❌ Please enter your full name.'); return; }
  const phoneDigits = phone.replace(/\D/g, '');
  if(!phone) { alert('❌ Please enter phone number.'); return; }
  if(phoneDigits.length < 10) { alert('❌ Phone number must be at least 10 digits.'); return; }
  if(!pickup) { alert('❌ Please enter pickup location.'); return; }
  if(!drop) { alert('❌ Please enter drop location.'); return; }
  if(!goods) { alert('❌ Please select type of goods.'); return; }

  const data = {
    userId:    user.id,
    name, phone, pickup, drop,
    truckType: goods + (weight ? ' | ' + weight : ''),
    notes, company
  };

  try {
    const res = await fetch(`${API}/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if(res.ok) {
      const ref = 'MX-' + Math.floor(10000 + Math.random() * 90000);
      document.getElementById('booking-ref').textContent = 'Reference #' + ref;
      document.getElementById('booking-form-state').classList.add('hidden');
      document.getElementById('booking-success-state').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Booking failed: ' + (result.error || result.message));
    }
  } catch(err) {
    alert('❌ Server Error. Please try again!');
  }
}

function resetBooking() {
  document.getElementById('booking-form-state').classList.remove('hidden');
  document.getElementById('booking-success-state').classList.add('hidden');
  ['f-name','f-phone','f-company','f-pickup','f-notes'].forEach(id => document.getElementById(id).value = '');
  ['f-goods','f-weight'].forEach(id => document.getElementById(id).selectedIndex = 0);
}

// ===== CONTACT FORM =====
function submitContact() {
  const name = document.getElementById('c-name').value.trim();
  const phone = document.getElementById('c-phone').value.trim();
  const msg = document.getElementById('c-message').value.trim();
  if(!name) { alert('❌ Please enter your name.'); return; }
  const phoneDigits = phone.replace(/\D/g, '');
  if(!phone || phoneDigits.length < 10) { alert('❌ Please enter valid 10 digit phone.'); return; }
  if(!msg) { alert('❌ Please enter your message.'); return; }
  document.getElementById('contact-success').classList.remove('hidden');
  ['c-name','c-phone','c-email','c-message'].forEach(id => document.getElementById(id).value = '');
  setTimeout(() => document.getElementById('contact-success').classList.add('hidden'), 6000);
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.trust-card,.service-card,.testi-card,.why-feature,.value-card,.faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});