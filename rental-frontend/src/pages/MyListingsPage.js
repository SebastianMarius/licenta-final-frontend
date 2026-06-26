import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/homepage/Navbar";
import { ImageCarousel } from "../components/generic/ImageCarousel";
import { useAppContext } from "../components/context/AppContext";
import styles from "./MyListingsPage.module.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:9000";

const EMPTY_FORM = {
    title: "",
    city: "",
    price: "",
    currency: "RON",
    address: "",
    areaSqm: "",
    roomsNumber: "",
    description: "",
    imageUrls: "",
};

function getErrorMessage(data, fallback) {
    if (Array.isArray(data?.message)) return data.message.join(", ");
    return data?.message || data?.error || fallback;
}

function getAdvertisementImageUrls(item) {
    if (!Array.isArray(item?.imageUrls)) return [];
    return item.imageUrls.map((url) => String(url).trim()).filter(Boolean);
}

function AdvertisementPhotos({ imageUrls, title }) {
    if (!imageUrls.length) {
        return (
            <div className={styles.cardMedia} aria-hidden>
                <div className={styles.cardPhotoPlaceholder}>No photos yet</div>
            </div>
        );
    }

    if (imageUrls.length === 1) {
        return (
            <div className={styles.cardMedia}>
                <img
                    src={imageUrls[0]}
                    alt={title ? `Photo of ${title}` : "Listing photo"}
                    className={styles.cardPhoto}
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                        const placeholder = event.currentTarget.nextElementSibling;
                        if (placeholder) placeholder.hidden = false;
                    }}
                />
                <div className={styles.cardPhotoPlaceholder} hidden>
                    Photo unavailable
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.cardMedia} ${styles.cardMediaCarousel}`}>
            <ImageCarousel images={imageUrls} />
        </div>
    );
}

export function MyListingsPage() {
    const { authUser, logout, openAuthModal } = useAppContext();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);

    const token = localStorage.getItem("token") || "";

    const loadMyAdvertisements = useCallback(async () => {
        if (!token) {
            setItems([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE}/advertisements/mine`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json().catch(() => ([]));

            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    openAuthModal("login");
                    throw new Error("Your session expired. Please sign in again.");
                }
                throw new Error(getErrorMessage(data, "Could not load your advertisements."));
            }

            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Could not load your advertisements.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadMyAdvertisements();
    }, [loadMyAdvertisements]);

    const resetForm = () => {
        setEditingId("");
        setForm(EMPTY_FORM);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setError("");
        setSuccess("");
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        const payload = {
            title: form.title.trim(),
            city: form.city.trim(),
            price: form.price.trim(),
            currency: form.currency,
            address: form.address.trim() || null,
            areaSqm: form.areaSqm.trim() || null,
            roomsNumber: form.roomsNumber.trim() || null,
            description: form.description.trim() || null,
            imageUrls: form.imageUrls
                .split(/\n|,/)
                .map((item) => item.trim())
                .filter(Boolean),
        };

        try {
            const response = await fetch(
                editingId
                    ? `${API_BASE}/advertisements/${editingId}`
                    : `${API_BASE}/advertisements`,
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                },
            );
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(getErrorMessage(data, "Could not save advertisement."));
            }

            setSuccess(editingId ? "Advertisement updated." : "Advertisement created.");
            resetForm();
            await loadMyAdvertisements();
        } catch (err) {
            setError(err.message || "Could not save advertisement.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setError("");
        setSuccess("");
        setForm({
            title: item.title || "",
            city: item.city || "",
            price: item.price ? String(item.price) : "",
            currency: item.currency || "RON",
            address: item.address || "",
            areaSqm: item.areaSqm ? String(item.areaSqm) : "",
            roomsNumber: item.roomsNumber ? String(item.roomsNumber) : "",
            description: item.description || "",
            imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls.join("\n") : "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        setError("");
        setSuccess("");

        if (!window.confirm("Delete this advertisement?")) return;

        try {
            const response = await fetch(`${API_BASE}/advertisements/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(getErrorMessage(data, "Could not delete advertisement."));
            }

            if (editingId === id) resetForm();
            setSuccess("Advertisement deleted.");
            await loadMyAdvertisements();
        } catch (err) {
            setError(err.message || "Could not delete advertisement.");
        }
    };

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.headerBlock}>
                    <h1 className={styles.title}>My listings</h1>
                    <p className={styles.lead}>
                        Add and manage your own apartment advertisements.
                    </p>
                    {authUser?.email && (
                        <p className={styles.subtle}>Signed in as {authUser.email}</p>
                    )}
                </div>

                {(error || success) && (
                    <div className={error ? styles.feedbackError : styles.feedbackOk}>
                        {error || success}
                    </div>
                )}

                <section className={styles.panel}>
                    <h2 className={styles.sectionTitle}>
                        {editingId ? "Edit advertisement" : "Create advertisement"}
                    </h2>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.grid}>
                            <label className={styles.field}>
                                <span>Title</span>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="2 camere, Marasti"
                                    required
                                />
                            </label>

                            <label className={styles.field}>
                                <span>City</span>
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Cluj-Napoca"
                                    required
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Price</span>
                                <input
                                    name="price"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="550"
                                    required
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Currency</span>
                                <select
                                    name="currency"
                                    value={form.currency}
                                    onChange={handleChange}
                                >
                                    <option value="RON">RON</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </label>

                            <label className={styles.field}>
                                <span>Address</span>
                                <input
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Street, area"
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Area sqm</span>
                                <input
                                    name="areaSqm"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={form.areaSqm}
                                    onChange={handleChange}
                                    placeholder="54"
                                />
                            </label>

                            <label className={styles.field}>
                                <span>Rooms</span>
                                <input
                                    name="roomsNumber"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={form.roomsNumber}
                                    onChange={handleChange}
                                    placeholder="2"
                                />
                            </label>
                        </div>

                        <label className={styles.field}>
                            <span>Description</span>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Nice apartment, close to transport..."
                                rows="5"
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Image URLs (one per line)</span>
                            <textarea
                                name="imageUrls"
                                value={form.imageUrls}
                                onChange={handleChange}
                                placeholder="https://..."
                                rows="4"
                            />
                        </label>

                        <div className={styles.actions}>
                            <button className={styles.primaryBtn} type="submit" disabled={saving}>
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update advertisement"
                                        : "Create advertisement"}
                            </button>
                            <button
                                className={styles.secondaryBtn}
                                type="button"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </section>

                <section className={styles.panel}>
                    <div className={styles.listHeader}>
                        <h2 className={styles.sectionTitle}>Your advertisements</h2>
                        <button
                            className={styles.secondaryBtn}
                            type="button"
                            onClick={loadMyAdvertisements}
                            disabled={loading}
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <p className={styles.emptyState}>Loading...</p>
                    ) : items.length === 0 ? (
                        <p className={styles.emptyState}>You have no advertisements yet.</p>
                    ) : (
                        <div className={styles.list}>
                            {items.map((item) => {
                                const imageUrls = getAdvertisementImageUrls(item);
                                return (
                                <article key={item.id} className={styles.card}>
                                    <AdvertisementPhotos
                                        imageUrls={imageUrls}
                                        title={item.title}
                                    />
                                    <div className={styles.cardHeader}>
                                        <div>
                                            <h3 className={styles.cardTitle}>{item.title}</h3>
                                            <p className={styles.cardMeta}>
                                                {item.city} · {item.price} {item.currency}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <p>{item.description || "No description."}</p>
                                        <p className={styles.cardDetails}>
                                            Address: {item.address || "-"} | Rooms: {item.roomsNumber || "-"} | Area: {item.areaSqm || "-"}
                                        </p>
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.primaryBtn}
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={styles.dangerBtn}
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
