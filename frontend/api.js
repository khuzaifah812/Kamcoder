/* ==========================================================
   DEVSPHERE LMS - API helper
   Replaces every direct localStorage read/write of app data
   (students, libraryBooks, borrowedBooks, notifications) with
   calls to the Django REST backend. Only the JWT access/refresh
   tokens are kept in localStorage now - that's just an auth
   token, not a copy of the database.
   ========================================================== */

const API_BASE = "/api";
 // change to your deployed API URL

const Auth = {
  getAccess() { return localStorage.getItem("accessToken"); },
  getRefresh() { return localStorage.getItem("refreshToken"); },
  setTokens(access, refresh) {
    localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
  },
  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("cachedStudent");
  },
  isLoggedIn() { return !!this.getAccess(); },
};

async function apiFetch(path, { method = "GET", body, auth = true, retry = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && Auth.getAccess()) headers["Authorization"] = `Bearer ${Auth.getAccess()}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Access token expired - try refreshing once
  if (res.status === 401 && retry && Auth.getRefresh()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiFetch(path, { method, body, auth, retry: false });
  }

  let data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }

  if (!res.ok) {
    const message = data ? (data.detail || Object.values(data)[0] || "Request failed") : "Request failed";
    throw new Error(Array.isArray(message) ? message[0] : message);
  }
  return data;
}

async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: Auth.getRefresh() }),
    });
    if (!res.ok) { Auth.clear(); return false; }
    const data = await res.json();
    Auth.setTokens(data.access);
    return true;
  } catch (e) {
    Auth.clear();
    return false;
  }
}

const Api = {
  // ---- Auth / students ----
  register(payload) {
    return apiFetch("/auth/register/", { method: "POST", body: payload, auth: false });
  },
  async login(registration, password) {
    const data = await apiFetch("/auth/login/", {
      method: "POST", body: { registration, password }, auth: false,
    });
    Auth.setTokens(data.access, data.refresh);
    localStorage.setItem("cachedStudent", JSON.stringify(data.student));
    return data.student;
  },
  me() { return apiFetch("/auth/me/"); },
  logout() { Auth.clear(); },

  adminLogin: async (username, password) => {
    const data = await apiFetch("/auth/admin/login/", {
      method: "POST", body: { username, password }, auth: false,
    });
    Auth.setTokens(data.access, data.refresh);
    localStorage.setItem("isAdminLoggedIn", "true");
    return data;
  },
  adminStudents() { return apiFetch("/auth/admin/students/"); },
  adminReports() { return apiFetch("/borrow/admin/reports/"); },

  // ---- Books ----
  listBooks(search = "") {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    return apiFetch(`/books/${q}`).then((d) => d.results ?? d);
  },
  addBook(book) { return apiFetch("/books/", { method: "POST", body: book }); },
  deleteBook(id) { return apiFetch(`/books/${id}/`, { method: "DELETE" }); },

  // ---- Borrowing ----
  myBorrows(activeOnly = false) {
    const q = activeOnly ? "?active=true" : "";
    return apiFetch(`/borrow/${q}`);
  },
  borrowBook(bookId) { return apiFetch("/borrow/borrow/", { method: "POST", body: { book_id: bookId } }); },
  returnBook(borrowId) { return apiFetch(`/borrow/${borrowId}/return/`, { method: "POST" }); },
  fines() { return apiFetch("/borrow/fines/"); },

  // ---- Notifications ----
  notifications() { return apiFetch("/notifications/").then((d) => d.results ?? d); },
  deleteNotification(id) { return apiFetch(`/notifications/${id}/`, { method: "DELETE" }); },
  clearNotifications() { return apiFetch("/notifications/clear/", { method: "DELETE" }); },
};

function getCachedStudent() {
  const raw = localStorage.getItem("cachedStudent");
  return raw ? JSON.parse(raw) : null;
}

function requireLogin() {
  if (!Auth.isLoggedIn()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function toastOn(el, message, color = "#0066ff") {
  if (!el) return;
  el.innerHTML = message;
  el.style.background = color;
  el.style.display = "block";
  el.style.position = "fixed";
  el.style.top = "20px";
  el.style.right = "20px";
  el.style.padding = "12px 20px";
  el.style.color = "white";
  el.style.borderRadius = "5px";
  el.style.zIndex = "9999";
  setTimeout(() => { el.style.display = "none"; }, 3000);
}
