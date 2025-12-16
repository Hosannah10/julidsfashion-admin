import React, { useEffect, useState, useMemo } from "react";
import { useToast } from "../../context/ToastContext";
import {
  fetchShopOrders,
  updateShopOrderStatus,
  notifyShopOrderCompleted,
  deleteShopOrder,
} from "../../api";
import "../Orders/styles/ShopOrders.css";
import { type Order } from "../../types";
import Confirm from "../../components/Confirm";

const PAGE_SIZE = 5;

const ShopOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<"pending" | "completed">(
    "pending"
  );
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();
  const [modalImage, setModalImage] = useState<string | undefined | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchShopOrders()
      .then((d: any) => setOrders(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🔎 Search across the fields
  const searchMatch = (o: Order, query: string) => {
    const qx = query.toLowerCase();
    return [
      o.name,
      o.email,
      o.phone,
      o.wearName,
      o.quantity,
      o.total,
      o.status
    ]
    .join(" ").toLowerCase().includes(qx);
  };

  // 🔽 Sorted + Filtered Orders
  const sortedFiltered = useMemo(() => {
    return (
      orders
        .filter((o) => searchMatch(o, q) && o.status === statusFilter)
        // ASC sorting by ID
        .sort((a, b) => a.id - b.id)
    );
  }, [orders, q, statusFilter]);

  // 📄 Pagination Logic
  const totalPages = Math.ceil(sortedFiltered.length / PAGE_SIZE);
  const paginatedOrders = sortedFiltered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const onToggle = async (o: Order) => {
    const next = o.status === "pending" ? "completed" : "pending";

    try {
      setToggling(o.id);
      await updateShopOrderStatus(o.id, next);
      // await notifyShopOrderCompleted(o.id, o.email);

      setOrders((prev) =>
        prev.map((x) => (x.id === o.id ? { ...x, status: next } : x))
      );

      showToast(`Order marked as ${next}`);
    } catch (err) {
      showToast("Failed to update order");
      console.error(err);
    } finally {
      setToggling(null);
    }
  };

  // const onDelete = async (id: number) => {
  //   if (!window.confirm("Delete this order permanently?")) return;

  //   try {
  //     await deleteShopOrder(id);
  //     setOrders((prev) => prev.filter((o) => o.id !== id));
  //     showToast("Order deleted");
  //   } catch (e) {
  //     console.error(e);
  //     showToast("Failed to delete order");
  //   }
  // };
  const onDelete = (id: number) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
  if (pendingDeleteId === null) return;

    try {
      await deleteShopOrder(pendingDeleteId);
      setOrders((prev) => prev.filter((o) => o.id !== pendingDeleteId));
      showToast("Order deleted");
    } catch (e) {
      console.error(e);
      showToast("Failed to delete order");
    } finally {
      setPendingDeleteId(null);
      setShowConfirm(false);
    }
  };

  return (
    <section className="orders container">
      <h2 className="page-title">Shop Orders</h2>

      <div className="shop-orders-header">
        <div className="shop-category-list">
          {(["pending", "completed"] as const).map((s) => (
            <button
              key={s}
              className={statusFilter === s ? "active" : ""}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          className="search-input"
          placeholder="Search orders…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="shop-orders-list">
        {loading ? (
          <p className="loading">Loading orders…</p>
        ) : paginatedOrders.length ? (
          paginatedOrders.map((o) => (
            <div key={o.id} className="shop-order-card compact">
              <div className="shop-order-image">
                {o.image?
                  <img
                    src={o.image}
                    alt={o.wearName}
                    width="50"
                    style={{ cursor: "pointer" }}
                    onClick={() => setModalImage(o.image)}
                  />
                  : "-"}
              </div>

              <div className="shop-order-details">
                <div className="shop-order-top">
                  <h3>{o.wearName}</h3>
                  <span className={`status ${o.status}`}>
                    {o.status.toUpperCase()}
                  </span>
                </div>

                <p className="shop-order-meta">
                  Ordered by <strong>{o.name}</strong> (Email: {o.email}, Phone Number: {o.phone})
                </p>

                <p className="shop-order-meta-small">Qty: {o.quantity}</p>

                <p className="shop-order-price">₦{o.total.toLocaleString()}</p>

                <div className="shop-order-actions">
                  <button
                    className="btn primary"
                    onClick={() => onToggle(o)}
                    disabled={toggling === o.id}
                  >
                    {toggling === o.id
                      ? "Updating…"
                      : o.status === "pending"
                      ? "Mark Completed"
                      : "Mark Pending"}
                  </button>

                  <button className="btn danger" onClick={() => onDelete(o.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No orders match your search.</p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
      {/* ---------------- IMAGE MODAL ---------------- */}
      {modalImage && (
        <div className="modal-overlayy">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModalImage(null)}>
              ✕
            </button>
            <img src={modalImage} alt="Full size" />
          </div>
        </div>
      )}
      {/* ---------------- CONFIRM DELETE MODAL ---------------- */}
      {showConfirm && (
        <Confirm
          title="Delete Order?"
          message="Are you sure you want to delete this order permanently?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setPendingDeleteId(null);
            setShowConfirm(false);
          }}
        />
      )}
    </section>
  );
};

export default ShopOrders;

