import { useMemo, useState } from "react";

// ---- Utils ----
const vnd = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
});

function classNames(...arr) {
    return arr.filter(Boolean).join(" ");
}




const seedProducts = [
    { id: crypto.randomUUID(), name: "Laptop Dell XPS 13", price: 29990000, inStock: true },
    { id: crypto.randomUUID(), name: "Chuột Logitech MX Master 3S", price: 2490000, inStock: false },
    { id: crypto.randomUUID(), name: "Bàn phím Keychron K6", price: 2190000, inStock: true },
];

export default function ProductManager() {

    const [products, setProducts] = useState(seedProducts);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [inStock, setInStock] = useState(true);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);


    function resetToFirstPage() {
        setPage(1);
    }

    const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
    const pagedProducts = useMemo(() => {
        const start = (page - 1) * pageSize;
        return products.slice(start, start + pageSize);
    }, [products, page, pageSize]);

    function addProduct() {
        const trimmed = name.trim();
        const num = Number(String(price).replace(/[^\d.-]/g, ""));

        if (!trimmed) {
            alert("Vui lòng nhập tên sản phẩm");
            return;
        }
        if (!Number.isFinite(num) || num <= 0) {
            alert("Giá phải là số > 0");
            return;
        }

        const newProduct = {
            id: crypto.randomUUID(),
            name: trimmed,
            price: Math.round(num),
            inStock,
        };
        setProducts((prev) => [newProduct, ...prev]);
        setName("");
        setPrice("");
        setInStock(true);
        resetToFirstPage();
    }

    function deleteProduct(id) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if ((page - 1) * pageSize >= products.length - 1) {

            setPage((p) => Math.max(1, p - 1));
        }
    }

    function toggleStock(id) {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
        );
    }


    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            {/* Header */}
            <div className="mx-auto max-w-5xl">
                <div className="rounded-2xl bg-blue-600 text-white p-6 shadow-lg mb-6 flex items-center gap-3">
                    <span className="text-3xl">📦</span>
                    <h1 className="text-2xl md:text-3xl font-bold">Quản lý Sản phẩm</h1>
                </div>


                <div className="rounded-2xl bg-white shadow p-4 md:p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
                        <span className="text-xl">＋</span>
                        <span>Thêm sản phẩm mới</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tên sản phẩm"
                            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                            placeholder="Giá (₫)"
                            inputMode="numeric"
                            className="w-full md:w-40 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="inline-flex items-center gap-2 select-none">
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={(e) => setInStock(e.target.checked)}
                                className="h-4 w-4"
                            />
                            <span>Còn hàng</span>
                        </label>
                        <button
                            onClick={addProduct}
                            className="rounded-xl bg-blue-600 text-white px-5 py-2 font-medium hover:bg-blue-700 active:translate-y-px"
                        >
                            Thêm
                        </button>
                    </div>
                </div>


                <div className="rounded-2xl bg-white shadow p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
                        <span className="text-xl">📋</span>
                        <span>Danh sách sản phẩm</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500 border-b">
                                    <th className="py-2 pr-4">Tên sản phẩm</th>
                                    <th className="py-2 pr-4">Giá</th>
                                    <th className="py-2 pr-4">Trạng thái</th>
                                    <th className="py-2 pr-4">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-slate-500">
                                            Chưa có sản phẩm nào
                                        </td>
                                    </tr>
                                )}

                                {pagedProducts.map((p) => (
                                    <tr key={p.id} className="border-b last:border-b-0">
                                        <td className="py-3 pr-4 font-medium text-slate-800">{p.name}</td>
                                        <td className="py-3 pr-4 font-semibold">{vnd.format(p.price)}</td>
                                        <td className="py-3 pr-4">
                                            <span
                                                className={classNames(
                                                    "px-3 py-1 rounded-full text-xs font-semibold",
                                                    p.inStock
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-rose-100 text-rose-700"
                                                )}
                                            >
                                                {p.inStock ? "Còn hàng" : "Hết hàng"}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleStock(p.id)}
                                                    className="rounded-xl border px-3 py-1 hover:bg-slate-50"
                                                    title="Đổi trạng thái còn/hết hàng"
                                                >
                                                    Đánh dấu
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(p.id)}
                                                    className="rounded-xl border px-3 py-1 text-rose-700 hover:bg-rose-50"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="text-sm text-slate-600">
                            Tổng: {products.length} sản phẩm
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="rounded-lg border px-3 py-1 disabled:opacity-40"
                            >
                                ←
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const n = i + 1;
                                    return (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={classNames(
                                                "rounded-lg border px-3 py-1 text-sm",
                                                n === page ? "bg-blue-600 text-white border-blue-600" : "hover:bg-slate-50"
                                            )}
                                        >
                                            {n}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="rounded-lg border px-3 py-1 disabled:opacity-40"
                            >
                                →
                            </button>

                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    resetToFirstPage();
                                }}
                                className="ml-2 rounded-lg border px-2 py-1"
                                title="Số mục / trang"
                            >
                                {[3, 5, 10, 20].map((n) => (
                                    <option key={n} value={n}>
                                        {n} / page
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
