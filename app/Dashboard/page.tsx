"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  subscribeToProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "@/lib/products";
import { useRouter } from "next/navigation";

// ─── Category options ────────────────────────────────────────────────────────
const CATEGORIES = ["Planters", "Kitchenware", "Decor", "Other"];

// ─── Empty product form ───────────────────────────────────────────────────────
const emptyForm = (): Omit<Product, "id" | "createdAt"> => ({
  name: "",
  description: "",
  price: 0,
  category: "Planters",
  image: "",
  whatsappMessage: "",
});

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyForm());
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) router.push("/Dashboard/login");
    });
    return unsub;
  }, [router]);

  // Products subscription
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToProducts(setProducts);
    return unsub;
  }, [user]);

  // Image preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(formData.image || "");
    }
  }, [imageFile, formData.image]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/Dashboard/login");
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm());
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setUploadProgress(0);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      whatsappMessage: product.whatsappMessage,
    });
    setImageFile(null);
    setImagePreview(product.image || "");
    setFormError("");
    setUploadProgress(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm());
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setUploadProgress(0);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const uploadImage = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(formData.image);
        return;
      }
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      const task = uploadBytesResumable(storageRef, imageFile);
      task.on(
        "state_changed",
        (snap) => {
          setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        }
      );
    });
  }, [imageFile, formData.image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name.trim()) { setFormError("Product name is required."); return; }
    if (formData.price <= 0) { setFormError("Price must be greater than 0."); return; }

    setFormLoading(true);
    try {
      const imageUrl = await uploadImage();
      const payload = { ...formData, image: imageUrl, price: Number(formData.price) };

      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      closeModal();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // silent
    } finally {
      setDeleteLoading(false);
    }
  };

  const autoWhatsapp = () => {
    if (formData.name && formData.price) {
      setFormData((prev) => ({
        ...prev,
        whatsappMessage: `Hi, I'm interested in the ${formData.name} (LKR ${formData.price.toLocaleString()}). Could you share more details?`,
      }));
    }
  };

  // Filtered products
  const filtered = products.filter((p) => {
    const matchCat = filterCategory === "All" || p.category === filterCategory;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Stats
  const stats = {
    total: products.length,
    planters: products.filter((p) => p.category === "Planters").length,
    kitchenware: products.filter((p) => p.category === "Kitchenware").length,
    decor: products.filter((p) => p.category === "Decor").length,
  };

  if (authLoading) {
    return (
      <div className="db-loading">
        <div className="db-spinner" />
        <p>Authenticating…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="db-root">
      {/* ── Sidebar ── */}
      <aside className={`db-sidebar ${sidebarOpen ? "db-sidebar--open" : ""}`}>
        <div className="db-sidebar-inner">
          <div className="db-brand">
            <div className="db-brand-icon">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 30,28 2,28" stroke="#EDBF7E" strokeWidth="2" fill="none" />
                <polygon points="16,8 25,26 7,26" fill="#EDBF7E" fillOpacity="0.2" />
              </svg>
            </div>
            <div>
              <span className="db-brand-name">CY International</span>
              <span className="db-brand-role">Admin</span>
            </div>
          </div>

          <nav className="db-nav">
            <button className="db-nav-item db-nav-item--active" id="nav-products">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Products
            </button>
          </nav>

          <div className="db-sidebar-footer">
            <div className="db-user-info">
              <div className="db-user-avatar">
                {user.email?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="db-user-details">
                <span className="db-user-email">{user.email}</span>
                <span className="db-user-role">Administrator</span>
              </div>
            </div>
            <button onClick={handleLogout} className="db-logout-btn" id="logout-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 11l3-3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <main className="db-main">
        {/* Topbar */}
        <header className="db-topbar">
          <button
            className="db-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="db-topbar-title">
            <h1 className="db-page-title">Products</h1>
            <span className="db-page-breadcrumb">Manage your product catalogue</span>
          </div>
          <button onClick={openAddModal} className="db-add-btn" id="add-product-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Product
          </button>
        </header>

        {/* Stats */}
        <section className="db-stats">
          {[
            { label: "Total Products", value: stats.total, icon: "📦" },
            { label: "Planters", value: stats.planters, icon: "🪴" },
            { label: "Kitchenware", value: stats.kitchenware, icon: "🍶" },
            { label: "Decor", value: stats.decor, icon: "🏺" },
          ].map((s) => (
            <div key={s.label} className="db-stat-card">
              <span className="db-stat-icon">{s.icon}</span>
              <div>
                <span className="db-stat-value">{s.value}</span>
                <span className="db-stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Filters */}
        <div className="db-filters">
          <div className="db-search-wrap">
            <svg className="db-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              className="db-search"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="product-search"
            />
          </div>
          <div className="db-cat-filters">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`db-cat-btn ${filterCategory === cat ? "db-cat-btn--active" : ""}`}
                id={`filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="db-empty">
            <div className="db-empty-icon">🏺</div>
            <p className="db-empty-title">No products found</p>
            <p className="db-empty-sub">Add your first product or adjust filters.</p>
            <button onClick={openAddModal} className="db-add-btn" style={{ marginTop: "1rem" }}>
              Add Product
            </button>
          </div>
        ) : (
          <div className="db-grid">
            {filtered.map((product) => (
              <div key={product.id} className="db-product-card">
                <div className="db-product-img-wrap">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="db-product-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='160' viewBox='0 0 200 160'%3E%3Crect fill='%231a1a1b' width='200' height='160'/%3E%3Ctext fill='%23EDBF7E' font-size='40' x='50%25' y='55%25' text-anchor='middle'%3E🏺%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  ) : (
                    <div className="db-product-img-placeholder">🏺</div>
                  )}
                  <div className="db-product-cat-badge">{product.category}</div>
                </div>
                <div className="db-product-body">
                  <h3 className="db-product-name">{product.name}</h3>
                  <p className="db-product-desc">{product.description}</p>
                  <div className="db-product-footer">
                    <span className="db-product-price">LKR {product.price.toLocaleString()}</span>
                    <div className="db-product-actions">
                      <button
                        onClick={() => openEditModal(product)}
                        className="db-action-btn db-action-btn--edit"
                        title="Edit"
                        id={`edit-${product.id}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M10 1.5L12.5 4 5 11.5H2.5V9L10 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="db-action-btn db-action-btn--delete"
                        title="Delete"
                        id={`delete-${product.id}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M4 3.5l.75 7.5h4.5L10 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="db-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="db-modal">
            <div className="db-modal-header">
              <h2 className="db-modal-title">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={closeModal} className="db-modal-close" id="modal-close-btn" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="db-modal-form">
              {/* Image upload */}
              <div className="db-form-field">
                <label className="db-form-label">Product Image</label>
                <div
                  className="db-img-upload"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  id="image-upload-zone"
                >
                  {imagePreview ? (
                    <div className="db-img-preview-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="db-img-preview" />
                      <div className="db-img-preview-overlay">
                        <span>Change image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="db-img-placeholder">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="2" y="6" width="28" height="20" rx="3" stroke="#EDBF7E" strokeWidth="1.5"/>
                        <circle cx="22" cy="13" r="2.5" stroke="#EDBF7E" strokeWidth="1.5"/>
                        <path d="M2 22l7-6 5 5 4-4 7 6" stroke="#EDBF7E" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                      <span>Click to upload image</span>
                      <small>PNG, JPG, WebP up to 5MB</small>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="db-file-input"
                  id="image-file-input"
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="db-progress">
                    <div className="db-progress-bar" style={{ width: `${uploadProgress}%` }} />
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="db-form-field">
                <label htmlFor="prod-name" className="db-form-label">Product Name *</label>
                <input
                  id="prod-name"
                  type="text"
                  className="db-form-input"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Terracotta Planter — Large"
                  required
                />
              </div>

              {/* Description */}
              <div className="db-form-field">
                <label htmlFor="prod-desc" className="db-form-label">Description</label>
                <textarea
                  id="prod-desc"
                  className="db-form-input db-form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Hand-crafted with natural clay…"
                  rows={3}
                />
              </div>

              {/* Price + Category row */}
              <div className="db-form-row">
                <div className="db-form-field">
                  <label htmlFor="prod-price" className="db-form-label">Price (LKR) *</label>
                  <input
                    id="prod-price"
                    type="number"
                    min="1"
                    className="db-form-input"
                    value={formData.price || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                    placeholder="4800"
                    required
                  />
                </div>
                <div className="db-form-field">
                  <label htmlFor="prod-category" className="db-form-label">Category</label>
                  <select
                    id="prod-category"
                    className="db-form-input db-form-select"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* WhatsApp message */}
              <div className="db-form-field">
                <div className="db-form-label-row">
                  <label htmlFor="prod-wa" className="db-form-label">WhatsApp Message</label>
                  <button type="button" onClick={autoWhatsapp} className="db-autofill-btn" id="autofill-wa-btn">
                    Auto-fill
                  </button>
                </div>
                <textarea
                  id="prod-wa"
                  className="db-form-input db-form-textarea"
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData((p) => ({ ...p, whatsappMessage: e.target.value }))}
                  placeholder="Hi, I'm interested in…"
                  rows={2}
                />
              </div>

              {formError && (
                <div className="db-form-error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.2"/>
                    <path d="M7 4.5V7" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
                    <circle cx="7" cy="9.5" r="0.6" fill="#ef4444"/>
                  </svg>
                  {formError}
                </div>
              )}

              <div className="db-modal-actions">
                <button type="button" onClick={closeModal} className="db-btn-secondary" id="cancel-modal-btn">
                  Cancel
                </button>
                <button type="submit" className="db-btn-primary" disabled={formLoading} id="submit-product-btn">
                  {formLoading ? <span className="btn-spinner-dark" /> : null}
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="db-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="db-modal db-modal--sm">
            <div className="db-modal-header">
              <h2 className="db-modal-title">Delete Product</h2>
              <button onClick={() => setDeleteTarget(null)} className="db-modal-close" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="db-delete-body">
              <div className="db-delete-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="#ef4444" strokeWidth="1.5"/>
                  <path d="M16 9v8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="16" cy="22" r="1.25" fill="#ef4444"/>
                </svg>
              </div>
              <p className="db-delete-msg">
                Are you sure you want to delete <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="db-modal-actions">
              <button onClick={() => setDeleteTarget(null)} className="db-btn-secondary" id="cancel-delete-btn">
                Cancel
              </button>
              <button onClick={handleDelete} className="db-btn-danger" disabled={deleteLoading} id="confirm-delete-btn">
                {deleteLoading ? <span className="btn-spinner-light" /> : null}
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ─── Reset / Base ─── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ─── Layout ─── */
        .db-root {
          display: flex;
          min-height: 100vh;
          background: #09090A;
          font-family: var(--font-roboto), sans-serif;
          color: #fff;
        }

        /* ─── Sidebar ─── */
        .db-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.025);
          border-right: 1px solid rgba(255,255,255,0.06);
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        @media (max-width: 900px) {
          .db-sidebar { transform: translateX(-100%); }
          .db-sidebar--open { transform: translateX(0); }
        }
        .db-sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
        }
        .db-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 1.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 1.5rem;
        }
        .db-brand-icon {
          width: 40px; height: 40px;
          background: rgba(237,191,126,0.1);
          border: 1px solid rgba(237,191,126,0.25);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .db-brand-name {
          display: block;
          font-family: var(--font-italiana), serif;
          font-size: 0.95rem;
          color: #EDBF7E;
          line-height: 1.2;
        }
        .db-brand-role {
          display: block;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .db-nav { flex: 1; }
        .db-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.7rem 0.875rem;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          font-family: var(--font-roboto);
          cursor: pointer;
          transition: all 0.18s;
          text-align: left;
        }
        .db-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .db-nav-item--active {
          background: rgba(237,191,126,0.1);
          color: #EDBF7E;
          font-weight: 500;
        }
        .db-sidebar-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .db-user-info {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .db-user-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #EDBF7E, #C9A870);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.875rem;
          color: #09090A; flex-shrink: 0;
        }
        .db-user-email {
          display: block;
          font-size: 0.8rem; color: rgba(255,255,255,0.7);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 140px;
        }
        .db-user-role {
          display: block;
          font-size: 0.68rem; color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .db-logout-btn {
          display: flex; align-items: center; gap: 0.5rem;
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.15);
          border-radius: 8px;
          color: #f87171;
          font-size: 0.85rem;
          font-family: var(--font-roboto);
          cursor: pointer;
          transition: all 0.18s;
        }
        .db-logout-btn:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); }

        /* ─── Overlay ─── */
        .db-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 99; backdrop-filter: blur(2px);
        }

        /* ─── Main content ─── */
        .db-main {
          flex: 1;
          margin-left: 260px;
          min-height: 100vh;
          display: flex; flex-direction: column;
          padding: 0 0 3rem;
        }
        @media (max-width: 900px) { .db-main { margin-left: 0; } }

        /* ─── Topbar ─── */
        .db-topbar {
          display: flex; align-items: center; gap: 1rem;
          padding: 1.25rem 2rem;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(12px);
        }
        .db-menu-btn {
          display: none; background: transparent; border: none;
          color: rgba(255,255,255,0.6); cursor: pointer; padding: 4px;
          border-radius: 6px; transition: color 0.2s;
        }
        .db-menu-btn:hover { color: #fff; }
        @media (max-width: 900px) { .db-menu-btn { display: flex; } }
        .db-topbar-title { flex: 1; }
        .db-page-title { font-size: 1.3rem; font-weight: 600; color: #fff; line-height: 1.2; }
        .db-page-breadcrumb { font-size: 0.8rem; color: rgba(255,255,255,0.35); margin-top: 0.1rem; display: block; }

        /* ─── Add button ─── */
        .db-add-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: linear-gradient(135deg, #EDBF7E 0%, #C9A870 100%);
          color: #09090A; font-weight: 700; font-size: 0.875rem;
          border: none; border-radius: 9px;
          cursor: pointer; font-family: var(--font-roboto);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(237,191,126,0.2);
          white-space: nowrap;
        }
        .db-add-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(237,191,126,0.3); }
        .db-add-btn:active { transform: translateY(0); }

        /* ─── Stats ─── */
        .db-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
          padding: 1.5rem 2rem;
        }
        @media (max-width: 700px) { .db-stats { grid-template-columns: repeat(2, 1fr); } }
        .db-stat-card {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 1.1rem 1.25rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .db-stat-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(237,191,126,0.2); }
        .db-stat-icon { font-size: 1.6rem; }
        .db-stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #EDBF7E; line-height: 1.1; }
        .db-stat-label { display: block; font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 0.1rem; }

        /* ─── Filters ─── */
        .db-filters {
          display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
          padding: 0 2rem 1.25rem;
        }
        .db-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .db-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.35); pointer-events: none;
        }
        .db-search {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px; padding: 0.6rem 0.875rem 0.6rem 2.25rem;
          color: #fff; font-size: 0.9rem; font-family: var(--font-roboto);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .db-search::placeholder { color: rgba(255,255,255,0.25); }
        .db-search:focus { border-color: rgba(237,191,126,0.4); box-shadow: 0 0 0 3px rgba(237,191,126,0.08); }
        .db-cat-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .db-cat-btn {
          padding: 0.45rem 0.875rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          color: rgba(255,255,255,0.5);
          font-size: 0.82rem; font-family: var(--font-roboto);
          cursor: pointer; transition: all 0.18s;
        }
        .db-cat-btn:hover { border-color: rgba(237,191,126,0.3); color: #EDBF7E; }
        .db-cat-btn--active { background: rgba(237,191,126,0.12); border-color: rgba(237,191,126,0.4); color: #EDBF7E; font-weight: 500; }

        /* ─── Product Grid ─── */
        .db-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem; padding: 0 2rem;
        }
        .db-product-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .db-product-card:hover {
          border-color: rgba(237,191,126,0.25);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .db-product-img-wrap { position: relative; aspect-ratio: 16/10; overflow: hidden; background: rgba(255,255,255,0.04); }
        .db-product-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
        .db-product-card:hover .db-product-img { transform: scale(1.03); }
        .db-product-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; color: rgba(237,191,126,0.3);
        }
        .db-product-cat-badge {
          position: absolute; top: 10px; left: 10px;
          background: rgba(9,9,10,0.75); border: 1px solid rgba(237,191,126,0.3);
          border-radius: 6px; padding: 2px 8px;
          font-size: 0.7rem; color: #EDBF7E; font-weight: 500; letter-spacing: 0.05em;
          backdrop-filter: blur(8px);
        }
        .db-product-body { padding: 1rem; }
        .db-product-name { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 0.4rem; line-height: 1.3; }
        .db-product-desc {
          font-size: 0.8rem; color: rgba(255,255,255,0.45); line-height: 1.5;
          margin-bottom: 0.875rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .db-product-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .db-product-price { font-size: 1rem; font-weight: 700; color: #EDBF7E; }
        .db-product-actions { display: flex; gap: 0.4rem; }
        .db-action-btn {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.35rem 0.7rem; border-radius: 7px;
          font-size: 0.78rem; font-family: var(--font-roboto);
          cursor: pointer; border: 1px solid transparent; transition: all 0.18s;
          font-weight: 500;
        }
        .db-action-btn--edit {
          background: rgba(237,191,126,0.1); border-color: rgba(237,191,126,0.2); color: #EDBF7E;
        }
        .db-action-btn--edit:hover { background: rgba(237,191,126,0.18); border-color: rgba(237,191,126,0.4); }
        .db-action-btn--delete {
          background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.15); color: #f87171;
        }
        .db-action-btn--delete:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); }

        /* ─── Empty ─── */
        .db-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 5rem 2rem; color: rgba(255,255,255,0.4);
        }
        .db-empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.4; }
        .db-empty-title { font-size: 1.1rem; font-weight: 600; color: rgba(255,255,255,0.6); }
        .db-empty-sub { font-size: 0.875rem; margin-top: 0.375rem; }

        /* ─── Modal ─── */
        .db-modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .db-modal {
          background: #111112;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; width: 100%; max-width: 560px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
          animation: slideUp 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .db-modal--sm { max-width: 420px; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .db-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .db-modal-title { font-size: 1.1rem; font-weight: 600; color: #fff; }
        .db-modal-close {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.06); border: none;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.18s;
        }
        .db-modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

        /* ─── Modal Form ─── */
        .db-modal-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .db-form-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .db-form-label { font-size: 0.78rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500; }
        .db-form-label-row { display: flex; align-items: center; justify-content: space-between; }
        .db-form-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 0.7rem 0.875rem;
          color: #fff; font-size: 0.9rem; font-family: var(--font-roboto);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .db-form-input::placeholder { color: rgba(255,255,255,0.2); }
        .db-form-input:focus { border-color: rgba(237,191,126,0.4); box-shadow: 0 0 0 3px rgba(237,191,126,0.08); }
        .db-form-textarea { resize: vertical; min-height: 72px; }
        .db-form-select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23EDBF7E' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 2rem; }
        .db-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .db-autofill-btn {
          font-size: 0.72rem; color: #EDBF7E; background: rgba(237,191,126,0.08);
          border: 1px solid rgba(237,191,126,0.2); border-radius: 5px;
          padding: 2px 8px; cursor: pointer; font-family: var(--font-roboto);
          transition: all 0.18s;
        }
        .db-autofill-btn:hover { background: rgba(237,191,126,0.15); }

        /* ─── Image upload ─── */
        .db-img-upload {
          border: 2px dashed rgba(237,191,126,0.2);
          border-radius: 12px; cursor: pointer;
          overflow: hidden; transition: border-color 0.2s;
          aspect-ratio: 16/9;
        }
        .db-img-upload:hover { border-color: rgba(237,191,126,0.4); }
        .db-img-placeholder {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.5rem; height: 100%; color: rgba(237,191,126,0.5);
          font-size: 0.875rem;
        }
        .db-img-placeholder small { font-size: 0.75rem; color: rgba(255,255,255,0.2); }
        .db-img-preview-wrap { position: relative; height: 100%; }
        .db-img-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
        .db-img-preview-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s; color: #fff; font-size: 0.875rem; font-weight: 500;
        }
        .db-img-upload:hover .db-img-preview-overlay { opacity: 1; }
        .db-file-input { display: none; }
        .db-progress {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;
          height: 6px; position: relative;
        }
        .db-progress-bar { height: 100%; background: linear-gradient(90deg, #EDBF7E, #C9A870); border-radius: 4px; transition: width 0.3s; }

        /* ─── Form error ─── */
        .db-form-error {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.7rem 0.875rem;
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px; color: #f87171; font-size: 0.85rem;
        }

        /* ─── Modal actions ─── */
        .db-modal-actions {
          display: flex; gap: 0.75rem; justify-content: flex-end;
          padding: 1.25rem 1.5rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .db-btn-secondary {
          padding: 0.65rem 1.25rem;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 9px; color: rgba(255,255,255,0.7);
          font-family: var(--font-roboto); font-size: 0.875rem;
          cursor: pointer; transition: all 0.18s;
        }
        .db-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .db-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 1.5rem;
          background: linear-gradient(135deg, #EDBF7E, #C9A870);
          border: none; border-radius: 9px;
          color: #09090A; font-weight: 700; font-size: 0.875rem;
          font-family: var(--font-roboto); cursor: pointer;
          transition: opacity 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(237,191,126,0.2);
        }
        .db-btn-primary:hover:not(:disabled) { opacity: 0.9; box-shadow: 0 6px 24px rgba(237,191,126,0.3); }
        .db-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .db-btn-danger {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3);
          border-radius: 9px; color: #f87171; font-weight: 600; font-size: 0.875rem;
          font-family: var(--font-roboto); cursor: pointer; transition: all 0.18s;
        }
        .db-btn-danger:hover:not(:disabled) { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.5); }
        .db-btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ─── Delete modal ─── */
        .db-delete-body {
          padding: 2rem 1.5rem 1rem;
          display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center;
        }
        .db-delete-icon { }
        .db-delete-msg { font-size: 0.9rem; color: rgba(255,255,255,0.65); line-height: 1.6; }
        .db-delete-msg strong { color: #fff; }

        /* ─── Spinners ─── */
        .btn-spinner-dark, .btn-spinner-light {
          display: inline-block; width: 15px; height: 15px;
          border-radius: 50%; border: 2px solid transparent;
          animation: spin 0.7s linear infinite;
        }
        .btn-spinner-dark { border-top-color: #09090A; border-right-color: rgba(9,9,10,0.3); }
        .btn-spinner-light { border-top-color: #f87171; border-right-color: rgba(248,113,113,0.3); }

        /* ─── Loading ─── */
        .db-loading {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 1rem;
          background: #09090A; color: rgba(255,255,255,0.4); font-size: 0.9rem;
        }
        .db-spinner {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid rgba(237,191,126,0.15);
          border-top-color: #EDBF7E;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
