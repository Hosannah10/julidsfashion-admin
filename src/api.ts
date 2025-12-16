import axios from "axios";

export const BASE = 'http://127.0.0.1:8000/api' // <-- Replace when real backend is ready

export function getAuthFetchHeaders(contentType = "application/json") {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Helper to get axios config with Authorization
export function getAxiosConfig() {
  const token = localStorage.getItem("token");
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
}

async function safeJson(res: Response) {
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}

export async function fetchWears() {
  const res = await fetch(`${BASE}/wears/`)
  if (!res.ok) throw new Error('Failed to fetch wears')
  return res.json()
}

export async function createWear(formData: FormData) {
  const res = await fetch(`${BASE}/wears/`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Failed to create wear')
  return res.json()
}

export async function updateWear(id: string | number, formData: FormData) {
  const res = await fetch(`${BASE}/wears/${id}/`, { method: 'PUT', body: formData })
  if (!res.ok) throw new Error('Failed to update wear')
  return res.json()
}

export async function deleteWear(id: string | number) {
  const res = await fetch(`${BASE}/wears/${id}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete wear')
  return res.json()
}

export async function fetchShopOrders() {
  const res = await fetch(`${BASE}/shop-orders/`, { headers: getAuthFetchHeaders() })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

// Update shop order status (use PATCH and include JSON body + auth headers)
export async function updateShopOrderStatus(id: string | number, status: 'pending' | 'completed') {
  const res = await fetch(`${BASE}/shop-orders/${id}/status/`, {
    method: 'PATCH',
    headers: getAuthFetchHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const txt = await safeJson(res).catch(() => ({}));
    const errMsg = (txt && (txt.detail || txt.message)) || 'Failed to update order';
    throw new Error(errMsg);
  }
  return safeJson(res);
}

export async function fetchShopOrderReport(){
  const res = await fetch(`${BASE}/shop-orders/`, { headers: getAuthFetchHeaders() })
  if(!res.ok) throw new Error('Failed to fetch reports')
  return res.json()
}

// Cancel (delete) a shop order (admin) - RESTful detail delete
export async function deleteShopOrder(id: number | string) {
  const r = await fetch(`${BASE}/shop-orders/${id}/`, {
    method: "DELETE",
    headers: getAuthFetchHeaders()
  });
  if (!r.ok) {
    const txt = await safeJson(r).catch(() => ({}));
    const errMsg = (txt && (txt.detail || txt.message)) || 'deleteShopOrder failed';
    throw new Error(errMsg);
  }
  return safeJson(r);
}

// ✅ New functions for Custom Orders
export const fetchCustomOrders = async () => {
  try {
    const response = await axios.get(`${BASE}/custom-orders/`, getAxiosConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching custom orders:", error);
    throw error;
  }
};

export const fetchCustomOrderById = async (id: number) => {
  try {
    const response = await axios.get(`${BASE}/custom-orders/${id}/`, getAxiosConfig());
    return response.data;
  } catch (error) {
    console.error(`Error fetching custom order ${id}:`, error);
    throw error;
  }
};

export async function updateCustomOrderStatus(id: string | number, status: 'pending' | 'completed') {
  const res = await fetch(`${BASE}/custom-orders/${id}/status/`, {
    method: 'PATCH',
    headers: getAuthFetchHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const txt = await safeJson(res).catch(() => ({}));
    const errMsg = (txt && (txt.detail || txt.message)) || 'Failed to update order';
    throw new Error(errMsg);
  }
  return safeJson(res);
}

// Cancel (delete) a custom order (admin)
export async function deleteCustomOrder(id: number | string) {
  const r = await fetch(`${BASE}/custom-orders/${id}/`, {
    method: "DELETE",
    headers: getAuthFetchHeaders()
  });
  if (!r.ok) {
    const txt = await safeJson(r).catch(() => ({}));
    const errMsg = (txt && (txt.detail || txt.message)) || 'deleteCustomOrder failed';
    throw new Error(errMsg);
  }
  return safeJson(r);
}


//  Email Notifications to user
// Notifications — POST to endpoint (no id in URL). Send JSON body { id, email, ... }
export async function notifyShopOrderCompleted(id: string | number, email?: string) {
  const res = await fetch(`${BASE}/notifications/shop-order-completed/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // notifications endpoints allow anonymous
    body: JSON.stringify({ id, email }),
  });
  if (!res.ok) {
    const txt = await safeJson(res).catch(() => ({}));
    const errMsg = (txt && (txt.detail || txt.message)) || 'notifyShopOrderCompleted failed';
    throw new Error(errMsg);
  }
  return safeJson(res);
}

//  Email Notifications to user
// Custom order notification using axios (example)
export const notifyCustomOrderCompleted = async (id: number, email?: string) => {
  try {
    const response = await axios.post(`${BASE}/notifications/custom-order-completed/`, { id, email });
    return response.data;
  } catch (error) {
    console.error("Error sending custom order notification:", error);
    throw error;
  }
};