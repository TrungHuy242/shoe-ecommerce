import api from './api';

// Orders
export async function listOrders(params = {}) {
  const res = await api.get('orders/', { params });
  return Array.isArray(res.data) ? res.data : (res.data.results || []);
}

export async function getUser(userId) {
  if (!userId && userId !== 0) return null;
  try {
    const res = await api.get(`users/${userId}/`);
    return res.data || null;
  } catch {
    return null;
  }
}
export async function getOrder(orderId) {
  const res = await api.get(`orders/${orderId}/`);
  return res.data;
}

export function mapBeToUiStatus(be) {
  const s = String(be || '').toLowerCase();
  if (s === 'shipping' || s === 'shipped') return 'shipping';
  if (s === 'delivered') return 'delivered';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  // 'pending' và 'processing' đều hiển thị 'processing' cho UI
  return 'processing';
}

export function mapUiToBeStatus(ui) {
  const s = String(ui || '').toLowerCase();
  if (s === 'shipping') return 'shipped';     // quan trọng: BE dùng 'shipped'
  if (s === 'delivered') return 'delivered';
  if (s === 'cancelled') return 'cancelled';
  if (s === 'processing') return 'pending';   // nếu muốn 'processing' hiển thị nhưng BE lưu 'pending'
  return 'pending';
}

export async function updateOrderStatus(orderId, uiStatus) {
  const status = mapUiToBeStatus(uiStatus);
  await api.patch(`orders/${orderId}/`, { status });
}

// Payments
export async function getPaymentsByOrder(orderId) {
  const res = await api.get('payments/', { params: { order: orderId, page_size: 1000 } });
  const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
  return list.filter(p => p.order === orderId);
}

export function mapPaymentStatus(beStatus) {
  const s = String(beStatus || '').toLowerCase();
  if (['paid', 'captured', 'succeeded'].includes(s)) return 'paid';
  if (['refunded'].includes(s)) return 'refunded';
  if (['failed', 'canceled', 'cancelled', 'error'].includes(s)) return 'failed';
  // 'processing', 'authorized', 'pending' => hiển thị 'pending'
  return 'pending';
}

// Trả về map { [orderId]: 'paid' | 'pending' | 'refunded' | 'failed' }
export async function getPaymentStatusByOrderId() {
  const res = await api.get('payments/', { params: { page_size: 1000 } });
  const all = Array.isArray(res.data) ? res.data : (res.data.results || []);
  const latestByOrder = {};
  for (const p of all) {
    if (!latestByOrder[p.order]) {
      latestByOrder[p.order] = p;
    } else {
      const cur = latestByOrder[p.order];
      const curTime = new Date(cur.payment_date).getTime() || 0;
      const nxtTime = new Date(p.payment_date).getTime() || 0;
      if (nxtTime > curTime) latestByOrder[p.order] = p;
    }
  }
  const map = {};
  Object.keys(latestByOrder).forEach(orderId => {
    map[orderId] = mapPaymentStatus(latestByOrder[orderId].status);
  });
  return map;
}

export async function getPaymentStatusMapForOrders(orderIds = []) {
  const results = await Promise.all(
    orderIds.map(async (oid) => {
      try {
        const res = await api.get('payments/', { params: { order: oid, page_size: 1000 } });
        const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
        if (!list.length) return [oid, 'pending'];
        const latest = list.sort((a,b)=> new Date(b.payment_date) - new Date(a.payment_date))[0];
        return [oid, mapPaymentStatus(latest.status)];
      } catch {
        return [oid, 'pending'];
      }
    })
  );
  const map = {};
  results.forEach(([oid, status]) => { map[oid] = status; });
  return map;
}

export async function getOrderItems(orderId) {
  const res = await api.get('order-details/', { params: { order: orderId, page_size: 1000 } });
  const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
  return list.map(d => ({
    productId: d.product,
    quantity: d.quantity,
    price: Number(d.unit_price || 0),
    size: d.size || null,
    color: d.color || null,
  }));
} 
  export async function deleteOrder(orderId) {
    await api.delete(`orders/${orderId}/`);
  }