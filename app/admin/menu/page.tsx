"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImageToSupabase } from "@/lib/storage";
import { MenuItem, MenuCategory, MenuVariant } from "@/app/data/menu";
import menuJsonData from "@/app/data/menu.json";
import styles from "./menuAdmin.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faEdit,
    faTrash,
    faTag,
    faSearch,
    faTimes,
    faFire,
    faThumbsUp,
    faRibbon,
    faBurger,
    faPizzaSlice,
    faBreadSlice,
    faUtensils,
    faBoxOpen,
    faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

function getCategoryIcon(catName: string) {
    const lower = catName.toLowerCase();
    if (lower.includes("burger")) return faBurger;
    if (lower.includes("pizza")) return faPizzaSlice;
    if (lower.includes("bread") || lower.includes("garlic")) return faBreadSlice;
    if (lower.includes("fries") || lower.includes("french")) return faBoxOpen;
    return faUtensils;
}

export default function AdminMenuPage() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [products, setProducts] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search state
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Product Modal State
    const [editProduct, setEditProduct] = useState<MenuItem | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);

    // Variant form type to support empty string when typing/deleting
    type VariantFormItem = {
        id: string;
        label: string;
        price: number | string;
    };

    const cleanNumberInput = (val: string): string => {
        if (val === "") return "";
        const numOnly = val.replace(/[^0-9]/g, "");
        if (numOnly === "") return "";
        return numOnly.replace(/^0+(?=\d)/, "");
    };

    // Form fields for product
    const [prodId, setProdId] = useState("");
    const [prodName, setProdName] = useState("");
    const [prodCat, setProdCat] = useState("");
    const [prodDesc, setProdDesc] = useState("");
    const [prodImage, setProdImage] = useState("");
    const [prodPrice, setProdPrice] = useState<number | string>(40);
    const [prodVariants, setProdVariants] = useState<VariantFormItem[]>([]);
    const [isBestseller, setIsBestseller] = useState(false);
    const [isRecommended, setIsRecommended] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
    const [isFeaturedOnLanding, setIsFeaturedOnLanding] = useState(false);

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

        try {
            let hIds: string[] = [];
            const { data: settingsData } = await supabase.from("shop_settings").select("highlighted_items").eq("id", 1).single();
            if (settingsData && Array.isArray(settingsData.highlighted_items) && settingsData.highlighted_items.length > 0) {
                hIds = settingsData.highlighted_items;
            } else {
                const local = localStorage.getItem("bb_admin_highlighted_items");
                if (local) {
                    const parsed = JSON.parse(local);
                    if (Array.isArray(parsed)) hIds = parsed;
                }
            }
            setHighlightedIds(hIds);
        } catch {
            // Keep empty
        }

        setLoading(false);
    };

    const handleToggleLandingFeature = async (productId: string) => {
        const isCurrentlyFeatured = highlightedIds.includes(productId);
        const updatedIds = isCurrentlyFeatured
            ? highlightedIds.filter((id) => id !== productId)
            : [...highlightedIds, productId];

        setHighlightedIds(updatedIds);

        try {
            localStorage.setItem("bb_admin_highlighted_items", JSON.stringify(updatedIds));
        } catch {
            // Ignore localStorage errors
        }

        try {
            await supabase
                .from("shop_settings")
                .update({ highlighted_items: updatedIds })
                .eq("id", 1);
        } catch {
            // Ignore db error
        }
    };

    useEffect(() => {
        loadMenuData();
    }, []);

    // Unique category names list
    const allCategoryNames = useMemo(() => {
        const list: string[] = [];
        categories.forEach((c) => {
            if (!list.includes(c.name)) list.push(c.name);
        });
        products.forEach((p) => {
            if (p.category && !list.includes(p.category)) {
                list.push(p.category);
            }
        });
        return list;
    }, [categories, products]);

    // Filtered products based on search query
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        const q = searchQuery.toLowerCase().trim();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
        );
    }, [products, searchQuery]);

    // Group items section-wise
    const groupedSections = useMemo(() => {
        const targetCategories =
            selectedCategory === "ALL"
                ? allCategoryNames
                : allCategoryNames.filter(
                      (c) => c.toLowerCase() === selectedCategory.toLowerCase()
                  );

        return targetCategories.map((catName) => {
            const items = filteredProducts.filter(
                (p) => p.category.toLowerCase() === catName.toLowerCase()
            );
            return {
                categoryName: catName,
                items,
            };
        });
    }, [allCategoryNames, filteredProducts, selectedCategory]);

    // Product count per category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allCategoryNames.forEach((name) => {
            counts[name] = products.filter(
                (p) => p.category.toLowerCase() === name.toLowerCase()
            ).length;
        });
        return counts;
    }, [allCategoryNames, products]);

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

    const handleOpenProductModal = (product?: MenuItem, defaultCategory?: string) => {
        if (product) {
            setEditProduct(product);
            setProdId(product.id);
            setProdName(product.name);
            setProdCat(product.category);
            setProdDesc(product.description || "");
            setProdImage(product.image || "");
            setProdPrice(product.price ?? 40);
            setProdVariants(
                product.variants && product.variants.length > 0
                    ? product.variants.map((v) => ({ ...v, price: v.price ?? "" }))
                    : []
            );
            setIsBestseller(product.is_bestseller ?? false);
            setIsRecommended(product.is_recommended ?? false);
            setIsNew(product.is_new ?? false);
            setIsFeaturedOnLanding(highlightedIds.includes(product.id));
        } else {
            setEditProduct(null);
            setProdId(`item-${Date.now()}`);
            setProdName("");
            setProdCat(defaultCategory || categories[0]?.name || "Burger");
            setProdDesc("");
            setProdImage("/BURGER-BHAU-logo.webp");
            setProdPrice(40);
            setProdVariants([
                { id: "regular", label: "Without Cheese", price: 40 },
                { id: "cheese", label: "With Cheese", price: 50 },
            ]);
            setIsBestseller(false);
            setIsRecommended(false);
            setIsNew(false);
            setIsFeaturedOnLanding(false);
        }
        setIsProductModalOpen(true);
    };

    const handleAddVariant = () => {
        setProdVariants((prev) => [
            ...prev,
            { id: `variant-${Date.now()}`, label: "New Option", price: "" },
        ]);
    };

    const handleUpdateVariant = (index: number, key: keyof VariantFormItem, value: string | number) => {
        setProdVariants((prev) => {
            const updated = [...prev];
            let finalValue = value;
            if (key === "price" && typeof value === "string") {
                finalValue = cleanNumberInput(value);
            }
            updated[index] = { ...updated[index], [key]: finalValue };
            return updated;
        });
    };

    const handleRemoveVariant = (index: number) => {
        setProdVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanVariants: MenuVariant[] = prodVariants.map((v) => ({
            id: v.id || `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            label: v.label.trim() || "Regular",
            price: v.price === "" ? 0 : Number(v.price) || 0,
        }));

        // Base price calculation from variants if variants exist
        const computedPrice =
            cleanVariants.length > 0
                ? cleanVariants[0].price
                : prodPrice === ""
                ? 0
                : Number(prodPrice) || 0;

        const { error } = await supabase.from("products").upsert({
            id: prodId,
            category: prodCat,
            name: prodName,
            description: prodDesc,
            image: prodImage && prodImage.trim() !== "" ? prodImage.trim() : "/BURGER-BHAU-logo.webp",
            price: computedPrice,
            variants: cleanVariants,
            is_bestseller: isBestseller,
            is_recommended: isRecommended,
            is_new: isNew,
            is_available: true,
        });

        if (!error) {
            const wasFeatured = highlightedIds.includes(prodId);
            if (isFeaturedOnLanding !== wasFeatured) {
                await handleToggleLandingFeature(prodId);
            }
            loadMenuData();
            setIsProductModalOpen(false);
        } else {
            alert(`Error saving product: ${error.message}`);
        }
    };

    const handleDeleteProduct = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
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
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <h1 className={styles.pageTitle}>
                        <FontAwesomeIcon icon={faUtensils} style={{ color: "var(--accent)" }} />
                        Menu Management
                    </h1>
                    <p className={styles.subtitle}>
                        Organize menu items section-wise by category, configure price variants, badges, and images.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        onClick={() => handleOpenProductModal()}
                        className={styles.primaryBtn}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add New Product
                    </button>
                </div>
            </div>

            {/* Toolbar: Search + Category Filter Tabs */}
            <div className={styles.toolbar}>
                <div className={styles.searchRow}>
                    <div className={styles.searchBox}>
                        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search products by name, description or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className={styles.clearSearchBtn}
                                title="Clear search"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </div>
                    <div className={styles.statsPill}>
                        Showing <span className={styles.statsHighlight}>{filteredProducts.length}</span> of {products.length} Items
                    </div>
                </div>

                {/* Category Navigation Pills */}
                <div className={styles.categoryTabs}>
                    <button
                        onClick={() => setSelectedCategory("ALL")}
                        className={`${styles.tabBtn} ${selectedCategory === "ALL" ? styles.tabBtnActive : ""}`}
                    >
                        <FontAwesomeIcon icon={faLayerGroup} />
                        All Sections
                        <span className={styles.tabCount}>{products.length}</span>
                    </button>
                    {allCategoryNames.map((catName) => {
                        const icon = getCategoryIcon(catName);
                        const count = categoryCounts[catName] || 0;
                        const isActive = selectedCategory.toLowerCase() === catName.toLowerCase();
                        return (
                            <button
                                key={catName}
                                onClick={() => setSelectedCategory(catName)}
                                className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ""}`}
                            >
                                <FontAwesomeIcon icon={icon} />
                                {catName}
                                <span className={styles.tabCount}>{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content: Section-wise Product Cards */}
            {loading ? (
                <div className={styles.emptyState}>
                    <p>Loading menu items and categories...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className={styles.emptyState}>
                    <FontAwesomeIcon icon={faSearch} style={{ fontSize: "32px", color: "var(--muted)" }} />
                    <div className={styles.emptyStateTitle}>No Products Found</div>
                    <div className={styles.emptyStateText}>
                        {searchQuery ? `No menu items match "${searchQuery}".` : "No products available in this section."}
                    </div>
                    {searchQuery ? (
                        <button
                            onClick={() => setSearchQuery("")}
                            className={styles.primaryBtn}
                            style={{ margin: "0 auto" }}
                        >
                            Clear Search
                        </button>
                    ) : (
                        <button
                            onClick={() => handleOpenProductModal(undefined, selectedCategory !== "ALL" ? selectedCategory : undefined)}
                            className={styles.primaryBtn}
                            style={{ margin: "0 auto" }}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add First Product
                        </button>
                    )}
                </div>
            ) : (
                groupedSections.map((section) => {
                    // Hide empty sections when user searched, unless it's explicitly filtered
                    if (section.items.length === 0 && selectedCategory === "ALL" && searchQuery) {
                        return null;
                    }

                    const categoryIcon = getCategoryIcon(section.categoryName);

                    return (
                        <div key={section.categoryName} className={styles.sectionWrapper}>
                            {/* Section Header */}
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionTitleGroup}>
                                    <div className={styles.sectionIconBox}>
                                        <FontAwesomeIcon icon={categoryIcon} />
                                    </div>
                                    <h2 className={styles.sectionTitle}>{section.categoryName}</h2>
                                    <span className={styles.sectionBadge}>
                                        {section.items.length} {section.items.length === 1 ? "Item" : "Items"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleOpenProductModal(undefined, section.categoryName)}
                                    className={styles.addInSectionBtn}
                                    title={`Add new product to ${section.categoryName}`}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Add to {section.categoryName}
                                </button>
                            </div>

                            {/* Section Product Cards Grid */}
                            {section.items.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyStateTitle}>No items in this section</div>
                                    <div className={styles.emptyStateText}>Get started by adding your first product to {section.categoryName}.</div>
                                    <button
                                        onClick={() => handleOpenProductModal(undefined, section.categoryName)}
                                        className={styles.primaryBtn}
                                        style={{ margin: "0 auto" }}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> Add Product
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.cardGrid}>
                                    {section.items.map((product) => {
                                        const imageSrc = product.image && product.image.trim() !== "" ? product.image.trim() : "/BURGER-BHAU-logo.webp";
                                        const hasVariants = product.variants && product.variants.length > 0;

                                        return (
                                            <div key={product.id} className={styles.card}>
                                                {/* Card Image Area */}
                                                <div className={styles.cardImageWrap}>
                                                    <img
                                                        src={imageSrc}
                                                        alt={product.name}
                                                        className={styles.cardImage}
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/BURGER-BHAU-logo.webp";
                                                        }}
                                                    />
                                                    <div className={styles.imageOverlayGradient} />

                                                    {/* Badges Overlay */}
                                                    <div className={styles.badgeContainer}>
                                                        <div className={styles.badgeGroup}>
                                                            {highlightedIds.includes(product.id) && (
                                                                <span className={`${styles.badgePill} ${styles.badgeLandingFeatured}`}>
                                                                    ⭐ Landing
                                                                </span>
                                                            )}
                                                            {product.is_bestseller && (
                                                                <span className={`${styles.badgePill} ${styles.badgeBestseller}`}>
                                                                    <FontAwesomeIcon icon={faFire} /> Bestseller
                                                                </span>
                                                            )}
                                                            {product.is_recommended && (
                                                                <span className={`${styles.badgePill} ${styles.badgeRecommended}`}>
                                                                    <FontAwesomeIcon icon={faThumbsUp} /> Recommended
                                                                </span>
                                                            )}
                                                            {product.is_new && (
                                                                <span className={`${styles.badgePill} ${styles.badgeNew}`}>
                                                                    <FontAwesomeIcon icon={faRibbon} /> New
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Veg indicator dot */}
                                                        <div className={styles.vegIndicator} title="Vegetarian">
                                                            <div className={styles.vegDot} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Body */}
                                                <div className={styles.cardBody}>
                                                    <div className={styles.cardHeaderRow}>
                                                        <h3 className={styles.cardTitle}>{product.name}</h3>
                                                    </div>

                                                    <p className={styles.cardDesc} title={product.description || ""}>
                                                        {product.description || "Fresh and flavorful, prepared with authentic spices and fresh ingredients."}
                                                    </p>

                                                    {/* Pricing & Variants Details */}
                                                    <div className={styles.pricingBox}>
                                                        <div className={styles.priceRow}>
                                                            <span className={styles.priceLabel}>
                                                                {hasVariants ? "Price Range" : "Price"}
                                                            </span>
                                                            <span className={styles.priceValue}>
                                                                {formatProductPrice(product)}
                                                            </span>
                                                        </div>

                                                        {hasVariants && (
                                                            <div className={styles.variantsWrap}>
                                                                {product.variants!.map((v) => (
                                                                    <div key={v.id} className={styles.variantChip}>
                                                                        <span>{v.label}</span>
                                                                        <span className={styles.variantChipPrice}>₹{v.price}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className={styles.cardActions}>
                                                        <button
                                                            onClick={() => handleOpenProductModal(product)}
                                                            className={styles.editBtn}
                                                            title="Edit this product"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} /> Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleLandingFeature(product.id)}
                                                            className={highlightedIds.includes(product.id) ? styles.landingBtnActive : styles.landingBtn}
                                                            title={highlightedIds.includes(product.id) ? "Remove from Landing Page Most Loved" : "Feature on Landing Page Most Loved"}
                                                        >
                                                            {highlightedIds.includes(product.id) ? "⭐ On Landing" : "☆ Feature"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id, product.name)}
                                                            className={styles.deleteBtn}
                                                            title="Delete this product"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })
            )}

            {/* Product Edit / Add Modal */}
            {isProductModalOpen && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {editProduct ? "Edit Product" : "Add New Product"}
                            </h3>
                            <button
                                onClick={() => setIsProductModalOpen(false)}
                                className={styles.modalCloseBtn}
                                title="Close"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className={styles.modalForm}>
                            <div className={styles.modalField}>
                                <label className={styles.modalLabel}>Item Name</label>
                                <input
                                    type="text"
                                    required
                                    value={prodName}
                                    onChange={(e) => setProdName(e.target.value)}
                                    placeholder="e.g. Aalu Tikki Burger"
                                    className={styles.modalInput}
                                />
                            </div>

                            <div className={styles.modalRow}>
                                <div className={styles.modalField}>
                                    <label className={styles.modalLabel}>Category Section</label>
                                    <select
                                        value={prodCat}
                                        onChange={(e) => setProdCat(e.target.value)}
                                        className={styles.modalSelect}
                                    >
                                        {allCategoryNames.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.modalField}>
                                    <label className={styles.modalLabel}>Base Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        value={prodPrice}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => setProdPrice(cleanNumberInput(e.target.value))}
                                        className={styles.modalInput}
                                    />
                                </div>
                            </div>

                            {/* Price Variants Section */}
                            <div className={styles.variantSection}>
                                <div className={styles.variantHeader}>
                                    <label className={styles.variantHeadingLabel}>
                                        <FontAwesomeIcon icon={faTag} /> Price Variants (e.g. Without Cheese / With Cheese)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddVariant}
                                        className={styles.variantAddBtn}
                                    >
                                        + Add Variant Option
                                    </button>
                                </div>

                                {prodVariants.length === 0 ? (
                                    <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>No price variants configured. Standard single price (₹{prodPrice || 0}) will apply.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {prodVariants.map((variant, idx) => (
                                            <div key={variant.id || idx} className={styles.variantRow}>
                                                <input
                                                    type="text"
                                                    placeholder="Variant Label (e.g. With Cheese)"
                                                    value={variant.label}
                                                    onChange={(e) => handleUpdateVariant(idx, "label", e.target.value)}
                                                    className={styles.variantInputLabel}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price (₹)"
                                                    value={variant.price}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleUpdateVariant(idx, "price", e.target.value)}
                                                    className={styles.variantInputPrice}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveVariant(idx)}
                                                    className={styles.variantDeleteBtn}
                                                    title="Remove variant"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Image Upload Control */}
                            <div className={styles.modalField}>
                                <label className={styles.modalLabel}>Product Image (Supabase Storage / URL)</label>
                                <div className={styles.imageUploadWrap}>
                                    <img
                                        src={prodImage || "/BURGER-BHAU-logo.webp"}
                                        alt="Preview"
                                        onError={(e) => { e.currentTarget.src = "/BURGER-BHAU-logo.webp"; }}
                                        className={styles.imagePreview}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProductImageUpload}
                                            disabled={uploadingImg}
                                            style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}
                                        />
                                        {uploadingImg && <span style={{ fontSize: "11px", color: "var(--accent)" }}>Uploading image to Supabase...</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Badges Toggle */}
                            <div className={styles.badgeOptionsGroup}>
                                <label className={styles.badgeCheckboxLabelAccent}>
                                    <input type="checkbox" checked={isFeaturedOnLanding} onChange={(e) => setIsFeaturedOnLanding(e.target.checked)} />
                                    Feature on Landing Page (&quot;Most Loved&quot;) ⭐
                                </label>
                                <label className={styles.badgeCheckboxLabel}>
                                    <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} />
                                    Mark as Bestseller ⭐
                                </label>
                                <label className={styles.badgeCheckboxLabel}>
                                    <input type="checkbox" checked={isRecommended} onChange={(e) => setIsRecommended(e.target.checked)} />
                                    Recommended Item 👍
                                </label>
                                <label className={styles.badgeCheckboxLabel}>
                                    <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
                                    New Arrival ✨
                                </label>
                            </div>

                            <div className={styles.modalField}>
                                <label className={styles.modalLabel}>Description</label>
                                <textarea
                                    rows={3}
                                    value={prodDesc}
                                    onChange={(e) => setProdDesc(e.target.value)}
                                    placeholder="Enter mouth-watering item description..."
                                    className={styles.modalInput}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="submit"
                                    className={styles.modalSaveBtn}
                                >
                                    Save Product
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsProductModalOpen(false)}
                                    className={styles.modalCancelBtn}
                                >
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
