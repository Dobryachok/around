const ADMIN_PASSWORD_KEY = 'around-admin-password';

export function getAdminPassword() {
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY) ?? '';
}

export function setAdminPassword(password: string) {
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

export function clearAdminPassword() {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminPassword());
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const password = getAdminPassword();
  if (password) {
    headers.set('X-Admin-Password', password);
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? 'Ошибка запроса');
  }

  return payload;
}

export async function loginAdmin(password: string) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? 'Неверный пароль');
  }

  setAdminPassword(password);
  return payload;
}

export function fetchAdminPosts() {
  return adminFetch('/api/admin/posts');
}

export function createAdminPost(body: Record<string, unknown>) {
  return adminFetch('/api/admin/posts', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateAdminPost(id: number, body: Record<string, unknown>) {
  return adminFetch(`/api/admin/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function deleteAdminPost(id: number) {
  return adminFetch(`/api/admin/posts/${id}`, {
    method: 'DELETE',
  });
}

export function fetchHomePins() {
  return adminFetch('/api/admin/home-pins');
}

export function saveHomePins(payload: {
  title: string;
  categorySlug: string;
  pinnedSlugs: string[];
}) {
  return adminFetch('/api/admin/home-pins', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function fetchContentTags() {
  return adminFetch('/api/admin/tags');
}

export function saveContentTags(tags: unknown[], subtags: unknown[]) {
  return adminFetch('/api/admin/tags', {
    method: 'PUT',
    body: JSON.stringify({ tags, subtags }),
  });
}

export function fetchPostTagAssignments() {
  return adminFetch('/api/admin/post-tags');
}

export function savePostTagAssignments(assignments: Record<string, unknown>) {
  return adminFetch('/api/admin/post-tags', {
    method: 'PUT',
    body: JSON.stringify({ assignments }),
  });
}

export async function uploadAdminImage(file: File) {
  const dataUrl = await readFileAsDataUrl(file);
  const payload = await adminFetch('/api/admin/upload', {
    method: 'POST',
    body: JSON.stringify({
      filename: file.name,
      dataUrl,
    }),
  });

  return payload.url as string;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
