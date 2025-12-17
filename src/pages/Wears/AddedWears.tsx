import React, { useEffect, useState } from "react";
import { fetchWears, deleteWear, updateWear } from "../../api";
import { type Wear } from "../../types";
import "../Wears/styles/AddedWears.css";
import { useToast } from "../../context/ToastContext";
import Confirm from "../../components/Confirm";

const categories = ["all", "asoebi", "corporate", "male", "kiddies"];

const ITEMS_PER_PAGE = 8;

const AddedWears: React.FC = () => {
  const [wears, setWears] = useState<Wear[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [editingWear, setEditingWear] = useState<Wear | null>(null);
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const { showToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchWears()
      .then((d: any) => setWears(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const onDelete = async (id: number) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;

    try {
      await deleteWear(pendingDeleteId);
      setWears((w) => w.filter((x) => x.id !== pendingDeleteId));
      showToast("Wear deleted");
    } catch (e) {
      console.error(e);
      showToast("Failed to delete wear");
    } finally {
      setPendingDeleteId(null);
      setShowConfirm(false);
    }
  };

  const handleEdit = (wear: Wear) => {
    setEditingWear(wear);
    setPreview(wear.image || null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpdatedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!editingWear) return;

    const formData = new FormData();
    formData.append("wearName", editingWear.wearName);
    formData.append("price", String(editingWear.price));
    formData.append("description", editingWear.description);
    formData.append("category", editingWear.category);
    if (updatedImage) formData.append("image", updatedImage);

    try {
      const updated = await updateWear(editingWear.id, formData);
      setWears((prev) =>
        prev.map((w) => (w.id === editingWear.id ? updated : w))
      );

      setEditingWear(null);
      setUpdatedImage(null);
      setPreview(null);
      setShowPopup(true);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  /** ---------------------
   * FILTERING
   ---------------------- */
  const filtered = wears.filter((p) => {
    const catOK = category === "all" ? true : p.category === category;
    const q = query.trim().toLowerCase();
    const searchOK =
      !q ||
      `${p.wearName} ${p.price} ${p.description} ${p.category}`.toLowerCase().includes(q);

    return catOK && searchOK;
  });

  /** ---------------------
   * SORTING
   ---------------------- */
  const sorted = [...filtered];

  if (sort === "newest") {
    sorted.sort((a, b) => b.id - a.id);
  } else if (sort === "a-z") {
    sorted.sort((a, b) => a.wearName.localeCompare(b.wearName));
  } else if (sort === "z-a") {
    sorted.sort((a, b) => b.wearName.localeCompare(a.wearName));
  } else if (sort === "price-low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    // Default sorting: ID ASC
    sorted.sort((a, b) => a.id - b.id);
  }

  /** ---------------------
   * PAGINATION
   ---------------------- */
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);

  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    // Reset to page 1 whenever filters change
    setCurrentPage(1);
  }, [query, category, sort]);

  return (
    <section className="added-wears container">
      <div className="header-top">
        <div className="title-section">
          <h2>Added Wears</h2>
          <p className="muted">
            View, edit or delete wears you've added to the shop.
          </p>
        </div>

        <div className="search-sort">
          <input
            className="added-wears-input"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="added-wears-input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort by Default</option>
            <option value="newest">Newest</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="added-wears-category-wrapper">
        <div className="added-wears-category-list">
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="added-wears-grid">
        {loading ? (
          <p>Loading...</p>
        ) : paginated.length ? (
          paginated.map((w) => (
            <div key={w.id} className="added-wears-card">
              <div className="img-wrap">
                <img src={w.image || ""} alt={w.wearName} />
              </div>
              <div className="added-wears-card-body">
                <h3>{w.wearName}</h3>
                <p className="added-wears-price">₦{w.price.toLocaleString()}</p>
                <p className="added-wears-category">{w.category}</p>

                <div className="added-wears-actions">
                  <button className="added-wears-btn" onClick={() => handleEdit(w)}>
                    Edit
                  </button>
                  <button className="added-wears-btn" onClick={() => onDelete(w.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="added-wears-no-results">No wears found.</p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="added-wears-pagination">
          <button
            className="added-wears-page-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`added-wears-page-number ${
                currentPage === i + 1 ? "active" : ""
              }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="added-wears-page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingWear && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Wear</h3>

            <input
              className="added-wears-input"
              value={editingWear.wearName}
              onChange={(e) =>
                setEditingWear({ ...editingWear, wearName: e.target.value })
              }
              placeholder="Name"
            />

            <input
              className="added-wears-input"
              type="number"
              value={editingWear.price}
              onChange={(e) =>
                setEditingWear({
                  ...editingWear,
                  price: Number(e.target.value),
                })
              }
              placeholder="Price"
            />

            <textarea
              className="added-wears-input"
              value={editingWear.description}
              onChange={(e) =>
                setEditingWear({
                  ...editingWear,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <select
              className="added-wears-input"
              value={editingWear.category}
              onChange={(e) =>
                setEditingWear({ ...editingWear, category: e.target.value })
              }
            >
              {categories
                .filter((c) => c !== "all")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>

            <div className="img-preview-section">
              {preview && <img src={preview} alt="Preview" />}
              <input type="file" onChange={handleImageChange} />
            </div>

            <div className="edit-modal-actions">
              <button className="btn gold" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="added-wears-btn"
                onClick={() => {
                  setEditingWear(null);
                  setPreview(null);
                  setUpdatedImage(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Wear updated successfully 🎉</p>
            <button className="btn gold" onClick={() => setShowPopup(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showConfirm && (
        <Confirm
          title="Delete Wear?"
          message="Are you sure you want to delete this wear permanently?"
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

export default AddedWears;
