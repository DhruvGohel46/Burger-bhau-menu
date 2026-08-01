"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImageToSupabase } from "@/lib/storage";
import { MenuItem, MenuCategory, MenuVariant } from "@/app/data/menu";
import menuJsonData from "@/app/data/menu.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faUpload, faTag } from "@fortawesome/free-solid-svg-icons";

export default function AdminMenuPage() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [products, setProducts] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Product Modal State
    const [editProduct, setEditProduct] = useState<MenuItem | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);

    // Form fields for product
    const [prodId, setProdId] = useState("");
    const [prodName, setProdName] = useState("");
    const [prodCat, setProdCat] = useState("");
    const [prodDesc, setProdDesc] = useState("");
    const [prodImage, setProdImage] = useState("");
    const [prodPrice, setProdPrice] = useState<number>(0);
    const [prodVariants, setProdVariants] = useState<MenuVariant[]>([]);
    const [isBestseller, setIsBestseller] = useState(false);
    const [isRecommended, setIsRecommended] = useState(false);
    const [isNew, setIsNew] = useState(false);

    const loadMenuData = async () => {
        setLoading(true);

        const { data: catData } = await supabase.from("categories").select("*");
        const { data: prodData } = await supabase.from("products").select("*");

        if (catData && catData.length > 0) {
            setCategories(catData as MenuCategory[]);
        } else {
            const seededCats = menuJsonData.categories.map((c) => ({
                id: c.toLowerCase().replace(/\s+/g, "-"),
                name: c,
                icon: c.toLowerCase().replace(/\s+/g, "-"),
            }));
            setCategories(seededCats);
        }

        if (prodData && prodData.length > 0) {
            setProducts(prodData as MenuItem[]);
        } else {
            setProducts(menuJsonData.items as MenuItem[]);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadMenuData();
    }, []);

    const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImg(true);
        const url = await uploadImageToSupabase(file, "products");
        if (url) {
            setProdImage(url);
        } else {
            alert("Failed to upload product image to Supabase Storage.");
        }
        setUploadingImg(false);
    };

    const handleOpenProductModal = (product?: MenuItem) => {
        if (product) {
            setEditProduct(product);
            setProdId(product.id);
            setProdName(product.name);
            setProdCat(product.category);
            setProdDesc(product.description || "");
            setProdImage(product.image || "");
            setProdPrice(product.price || 0);
            setProdVariants(product.variants ? [...product.variants] : []);
            setIsBestseller(product.is_bestseller ?? false);
            setIsRecommended(product.is_recommended ?? false);
            setIsNew(product.is_new ?? false);
        } else {
            setEditProduct(null);
            setProdId(`item-${Date.now()}`);
            setProdName("");
            setProdCat(categories[0]?.name || "Burger");
            setProdDesc("");
            setProdImage("/productimage/burger/aalu-tikki-burger.jpg");
            setProdPrice(40);
            setProdVariants([
                { id: "regular", label: "Without Cheese", price: 40 },
                { id: "cheese", label: "With Cheese", price: 50 },
            ]);
            setIsBestseller(false);
            setIsRecommended(false);
            setIsNew(false);
        }
        setIsProductModalOpen(true);
    };

    const handleAddVariant = () => {
        setProdVariants((prev) => [
            ...prev,
            { id: `variant-${Date.now()}`, label: "New Option", price: 50 },
        ]);
    };

    const handleUpdateVariant = (index: number, key: keyof MenuVariant, value: string | number) => {
        setProdVariants((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [key]: value };
            return updated;
        });
    };

    const handleRemoveVariant = (index: number) => {
        setProdVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        // Base price calculation from variants if variants exist
        const computedPrice = prodVariants.length > 0 ? prodVariants[0].price : Number(prodPrice);

        const { error } = await supabase.from("products").upsert({
            id: prodId,
            category: prodCat,
            name: prodName,
            description: prodDesc,
            image: prodImage,
            price: computedPrice,
            variants: prodVariants,
            is_bestseller: isBestseller,
            is_recommended: isRecommended,
            is_new: isNew,
            is_available: true,
        });

        if (!error) {
            loadMenuData();
            setIsProductModalOpen(false);
        } else {
            alert(`Error saving product: ${error.message}`);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this menu item?")) return;
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } else {
            alert(`Error deleting product: ${error.message}`);
        }
    };

    const formatProductPrice = (p: MenuItem) => {
        if (p.variants && p.variants.length > 0) {
            const prices = p.variants.map((v) => v.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            if (min === max) return `₹${min}`;
            return `₹${min} - ₹${max}`;
        }
        return `₹${p.price || 0}`;
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#fff" }}>
                        Menu Management
                    </h1>
                    <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                        Manage menu items, price variants (e.g. Without Cheese / With Cheese), image uploads, and badges.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenProductModal()}
                    style={{
                        padding: "10px 18px",
                        backgroundColor: "#ff8c00",
                        color: "#000",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} /> Add New Product
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading menu items...</p>
            ) : (
                <div style={{ backgroundColor: "#141414", border: "1px solid #282828", borderRadius: "16px", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #282828", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>
                                <th style={{ padding: "14px" }}>Image</th>
                                <th style={{ padding: "14px" }}>Item Name</th>
                                <th style={{ padding: "14px" }}>Category</th>
                                <th style={{ padding: "14px" }}>Price / Variants</th>
                                <th style={{ padding: "14px" }}>Badges</th>
                                <th style={{ padding: "14px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} style={{ borderBottom: "1px solid #1e1e1e" }}>
                                    <td style={{ padding: "14px" }}>
                                        <img src={p.image} alt={p.name} style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover" }} />
                                    </td>
                                    <td style={{ padding: "14px", fontWeight: "700", color: "#fff" }}>{p.name}</td>
                                    <td style={{ padding: "14px", color: "#ff8c00" }}>{p.category}</td>
                                    <td style={{ padding: "14px" }}>
                                        <div style={{ fontWeight: "700", color: "#28a745" }}>{formatProductPrice(p)}</div>
                                        {p.variants && p.variants.length > 0 && (
                                            <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
                                                {p.variants.map((v) => v.label).join(", ")}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: "14px", fontSize: "11px" }}>
                                        {p.is_bestseller && <span style={{ backgroundColor: "#ff8c00", color: "#000", padding: "2px 6px", borderRadius: "4px", fontWeight: "700", marginRight: "4px" }}>Bestseller</span>}
                                        {p.is_recommended && <span style={{ backgroundColor: "#17a2b8", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontWeight: "700", marginRight: "4px" }}>Recommended</span>}
                                        {p.is_new && <span style={{ backgroundColor: "#28a745", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>New</span>}
                                    </td>
                                    <td style={{ padding: "14px" }}>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button onClick={() => handleOpenProductModal(p)} style={{ padding: "6px 10px", backgroundColor: "#262626", border: "1px solid #444", color: "#fff", borderRadius: "6px", cursor: "pointer" }}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(p.id)} style={{ padding: "6px 10px", backgroundColor: "rgba(255,68,68,0.2)", border: "1px solid #ff4444", color: "#ff6b6b", borderRadius: "6px", cursor: "pointer" }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Product Edit / Add Modal */}
            {isProductModalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.85)",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: "#161616", border: "1px solid #333", borderRadius: "16px", padding: "24px", maxWidth: "580px", width: "100%", maxHeight: "90vh", overflowY: "auto",
                    }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ff8c00", marginBottom: "16px" }}>
                            {editProduct ? "Edit Product" : "Add New Product"}
                        </h3>

                        <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>Item Name</label>
                                <input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} style={{ width: "100%", padding: "10px", backgroundColor: "#202020", border: "1px solid #444", borderRadius: "6px", color: "#fff" }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>Category</label>
                                    <select value={prodCat} onChange={(e) => setProdCat(e.target.value)} style={{ width: "100%", padding: "10px", backgroundColor: "#202020", border: "1px solid #444", borderRadius: "6px", color: "#fff" }}>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>Base Price (₹)</label>
                                    <input type="number" required value={prodPrice} onChange={(e) => setProdPrice(Number(e.target.value))} style={{ width: "100%", padding: "10px", backgroundColor: "#202020", border: "1px solid #444", borderRadius: "6px", color: "#fff" }} />
                                </div>
                            </div>

                            {/* Price Variants Section */}
                            <div style={{ backgroundColor: "#202020", border: "1px solid #333", borderRadius: "10px", padding: "14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#ff8c00", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <FontAwesomeIcon icon={faTag} /> Price Variants (e.g. Without Cheese / With Cheese)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddVariant}
                                        style={{ padding: "4px 10px", backgroundColor: "#ff8c00", color: "#000", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "11px", cursor: "pointer" }}
                                    >
                                        + Add Variant Option
                                    </button>
                                </div>

                                {prodVariants.length === 0 ? (
                                    <p style={{ fontSize: "12px", color: "#777", margin: 0 }}>No price variants configured. Standard single price (₹{prodPrice}) will apply.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {prodVariants.map((variant, idx) => (
                                            <div key={variant.id || idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Variant Label (e.g. With Cheese)"
                                                    value={variant.label}
                                                    onChange={(e) => handleUpdateVariant(idx, "label", e.target.value)}
                                                    style={{ flex: 2, padding: "8px", backgroundColor: "#141414", border: "1px solid #444", borderRadius: "6px", color: "#fff", fontSize: "12px" }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price (₹)"
                                                    value={variant.price}
                                                    onChange={(e) => handleUpdateVariant(idx, "price", Number(e.target.value))}
                                                    style={{ flex: 1, padding: "8px", backgroundColor: "#141414", border: "1px solid #444", borderRadius: "6px", color: "#fff", fontSize: "12px" }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveVariant(idx)}
                                                    style={{ padding: "8px 10px", backgroundColor: "rgba(255,68,68,0.2)", border: "1px solid #ff4444", color: "#ff6b6b", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Image Upload Control */}
                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>Product Image (Supabase Storage)</label>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <img src={prodImage} alt="Preview" style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }} />
                                    <input type="file" accept="image/*" onChange={handleProductImageUpload} disabled={uploadingImg} style={{ fontSize: "12px", color: "#aaa" }} />
                                </div>
                            </div>

                            {/* Badges Toggle */}
                            <div style={{ backgroundColor: "#202020", padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#fff" }}>
                                    <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} /> Mark as Bestseller ⭐
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#fff" }}>
                                    <input type="checkbox" checked={isRecommended} onChange={(e) => setIsRecommended(e.target.checked)} /> Recommended Item 👍
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#fff" }}>
                                    <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} /> New Arrival ✨
                                </label>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", color: "#aaa", marginBottom: "4px" }}>Description</label>
                                <textarea rows={3} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} style={{ width: "100%", padding: "10px", backgroundColor: "#202020", border: "1px solid #444", borderRadius: "6px", color: "#fff" }} />
                            </div>

                            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                                <button type="submit" style={{ flex: 1, padding: "12px", backgroundColor: "#ff8c00", color: "#000", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                                    Save Product
                                </button>
                                <button type="button" onClick={() => setIsProductModalOpen(false)} style={{ flex: 1, padding: "12px", backgroundColor: "#262626", border: "1px solid #444", color: "#fff", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
