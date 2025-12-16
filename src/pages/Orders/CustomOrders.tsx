import React, { useEffect, useState } from "react";
import {
  fetchCustomOrders,
  updateCustomOrderStatus,
  notifyCustomOrderCompleted,
  deleteCustomOrder
} from "../../api";
import "../Orders/styles/CustomOrders.css";
import { useToast } from "../../context/ToastContext";
import { type CustomOrder } from "../../types";
import Confirm from "../../components/Confirm";

const ITEMS_PER_PAGE = 10;

const CustomOrders: React.FC = () => {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);

  // Search + Filter states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"pending" | "completed">("pending");

  // For Image Modal
  const [modalImage, setModalImage] = useState<string | null>(null);

  const { showToast } = useToast();

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchCustomOrders();
        const sorted = data.sort((a: CustomOrder, b: CustomOrder) => a.id - b.id);
        setOrders(sorted);
      } catch (error) {
        console.error("Error loading custom orders:", error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  /* --------------------- FILTER + SEARCH --------------------- */
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);

    const matchesFilter = o.status === filter;

    return matchesSearch && matchesFilter;
  });

  /* ------------------------ PAGINATION ------------------------ */
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const onToggle = async (order: CustomOrder) => {
      const next = order.status === "pending" ? "completed" : "pending";
  
      try {
        setToggling(order.id);
        await updateCustomOrderStatus(order.id, next);
        // await notifyCustomOrderCompleted(order.id, order.email);
  
        setOrders((prev) =>
          prev.map((x) => (x.id === order.id ? { ...x, status: next } : x))
        );
  
        showToast(`Order marked as ${next}`);
      } catch (err) {
        showToast("Failed to update order");
        console.error(err);
      } finally {
        setToggling(null);
      }
    };

  const deleteOrderHandler = async (id: number) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;

    try {
      await deleteCustomOrder(pendingDeleteId);
      const updated = orders.filter((o) => o.id !== pendingDeleteId);
      setOrders(updated);

      if (startIndex >= updated.length && page > 1) {
        setPage(page - 1);
      }

      showToast("Order deleted");
    } catch {
      showToast("Failed to delete Order");
    } finally {
      setPendingDeleteId(null);
      setShowConfirm(false);
    }
  };

  if (loading) return <p>Loading custom orders...</p>;

  return (
    <div className="custom-orders-container">
      <h2>Custom Orders</h2>

      {/* SEARCH & FILTER BAR */}
      <div className="orders-header">
        <div className="category-list">
          {(["pending", "completed"] as const).map((s) => (
            <button
              key={s}
              className={filter === s ? "active" : ""}
              onClick={() => {
                setFilter(s);
                setPage(1);
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          className="search-input"
          placeholder="Search orders…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="custom-orders-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
            <th>Description</th><th>Image</th><th>Status</th><th>Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>{order.phone}</td>
              <td>{order.description}</td>

              <td>
                <img
                  src={order.image}
                  alt="wear"
                  className="order-thumb"
                  onClick={() => setModalImage(order.image)}
                />
              </td>

              <td>
                <span className={`status ${order.status}`}>{order.status}</span>
              </td>

              <td className="action-buttons">
                <button
                  onClick={() => onToggle(order)}
                  disabled={toggling === order.id}
                >
                  {toggling === order.id
                    ? "Updating…"
                    : order.status === "pending"
                    ? "Mark Completed"
                    : "Mark Pending"}
                </button>

                <button
                  className="btn-delete"
                  onClick={() => deleteOrderHandler(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination-controls">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              className={page === pageNum ? "active-page" : ""}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* IMAGE MODAL */}
      {modalImage && (
        <div className="modal-overlayy">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModalImage(null)}>
              ✕
            </button>
            <img src={modalImage} alt="Full Size" />
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
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
    </div>
  );
};

export default CustomOrders;

