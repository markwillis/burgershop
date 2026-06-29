import { useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { menu } from "../data/menu";
import { useOrders } from "../hooks/useOrders";
import { CartItem, Category, MenuItemType } from "../types";
import MenuItem from "../components/MenuItem";
import CategoryTabs from "../components/CategoryTabs";
import Cart from "../components/Cart";
import OrderTicket from "../components/OrderTicket";
import ChangeCalculator from "../components/ChangeCalculator";

export default function OrderScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const sessionCode = searchParams.get("code") || "";

  const { orders, placeOrder, completeOrder } = useOrders(sessionId || null);
  const [category, setCategory] = useState<Category>("burgers");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderCount, setOrderCount] = useState(1);
  const [showCalculator, setShowCalculator] = useState<string | null>(null);
  const [view, setView] = useState<"menu" | "orders">("menu");

  const filteredMenu = menu.filter((item) => item.category === category);

  const readyOrders = orders.filter((o) => o.status === "ready");
  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "cooking",
  );

  const handleAddToCart = useCallback((item: MenuItemType) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: number, qty: number) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: qty } : c)),
    );
  }, []);

  const handleRemove = useCallback((id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    await placeOrder(cart, orderCount);
    setOrderCount((c) => c + 1);
    setCart([]);
  }

  const calculatorOrder = showCalculator
    ? orders.find((o) => o.id === showCalculator)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold font-serif">🍔 Burger Game</h1>
          <p className="text-sm text-gray-500">Order Screen</p>
        </div>
        <div className="flex items-center gap-3">
          {readyOrders.length > 0 && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
              {readyOrders.length} Ready!
            </span>
          )}
          <div className="bg-amber-100 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-500">Kitchen Code</p>
            <p className="text-2xl font-mono font-bold tracking-widest">
              {sessionCode}
            </p>
          </div>
        </div>
      </header>

      {/* View Toggle */}
      <div className="flex gap-2 p-4 pb-0">
        <button
          onClick={() => setView("menu")}
          className={`px-5 py-2 rounded-full font-bold transition-all ${
            view === "menu"
              ? "bg-amber-400 text-black"
              : "bg-white text-gray-600"
          }`}
        >
          📋 Menu
        </button>
        <button
          onClick={() => setView("orders")}
          className={`px-5 py-2 rounded-full font-bold transition-all ${
            view === "orders"
              ? "bg-amber-400 text-black"
              : "bg-white text-gray-600"
          }`}
        >
          📦 Orders{" "}
          {activeOrders.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
              {activeOrders.length}
            </span>
          )}
        </button>
      </div>

      {view === "menu" && (
        <div className="p-4 pb-48">
          <CategoryTabs active={category} onChange={setCategory} />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {filteredMenu.map((item) => (
              <MenuItem key={item.id} item={item} onAdd={handleAddToCart} />
            ))}
          </div>
        </div>
      )}

      {view === "orders" && (
        <div className="p-4 space-y-4">
          {readyOrders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-green-600">
                ✅ Ready to Serve
              </h2>
              <div className="space-y-3">
                {readyOrders.map((order) => (
                  <div key={order.id}>
                    <OrderTicket order={order} />
                    <button
                      onClick={() => setShowCalculator(order.id)}
                      className="mt-2 w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 rounded-xl text-lg transition-all hover:scale-105 active:scale-95"
                    >
                      💰 Calculate Change & Serve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeOrders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3">📦 Active Orders</h2>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <OrderTicket key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {orders.filter((o) => o.status === "served").length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-400">
                🎉 Served
              </h2>
              <div className="space-y-3 opacity-60">
                {orders
                  .filter((o) => o.status === "served")
                  .map((order) => (
                    <OrderTicket key={order.id} order={order} />
                  ))}
              </div>
            </div>
          )}

          {orders.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <span className="text-5xl block mb-3">📭</span>
              <p className="text-xl font-bold">No orders yet</p>
              <p>Switch to the Menu tab to start taking orders!</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-20">
        <Cart
          items={cart}
          onPlaceOrder={handlePlaceOrder}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
        />
      </div>

      {/* Change Calculator Modal */}
      {calculatorOrder && (
        <ChangeCalculator
          order={calculatorOrder}
          onComplete={async (amountPaid, changeDue) => {
            await completeOrder(calculatorOrder.id, amountPaid, changeDue);
            setShowCalculator(null);
          }}
        />
      )}
    </div>
  );
}
