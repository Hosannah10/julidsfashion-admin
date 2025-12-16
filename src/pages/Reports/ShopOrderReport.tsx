import React, { useEffect, useState, useMemo } from "react";
import { fetchShopOrderReport } from "../../api";
import "../Reports/styles/ShopOrderReport.css";

const PAGE_SIZE = 10;

const ShopOrderReport: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    fetchShopOrderReport()
      .then((d: any) => setRows(d))
      .catch(console.error);
  }, []);

  // 🔍 Search + Sort (ASC by ID)
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    const filteredRows = rows.filter((r) => {
      if (!qq) return true;

      return [
        r.name,
        r.email,
        r.phone,
        r.wearName,
        r.quantity,
        r.total,
        r.description,
        r.category,
        r.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(qq);
    });

    // ASC sort (ID: 1,2,3…)
    return filteredRows.sort((a, b) => a.id - b.id);
  }, [rows, q]);

  // 📄 Pagination calculations
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <section className="container">
      <h2>Shop Orders Report</h2>

      <input
        className="input"
        placeholder="Search orders..."
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setCurrentPage(1); // reset pagination when searching
        }}
      />

      <div className="card table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Order</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((r: any) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td>{r.wearName}</td>
                <td>{r.quantity}</td>
                <td>₦{Number(r.total).toLocaleString()}</td>
                <td>{r.description}</td>
                <td>{r.category}</td>
                {/* Click image → modal */}
                <td>
                  {r.image?
                  <img
                    src={r.image}
                    alt={r.wearName}
                    width="50"
                    style={{ cursor: "pointer" }}
                    onClick={() => setModalImage(r.image)}
                  />
                  : "-"}
                </td>
                <td>
                  <span className={`status ${r.status}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION */}
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
    </section>
  );
};

export default ShopOrderReport;
