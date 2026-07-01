import { useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { useMenu } from "../hooks/useMenu";
import { CartItem, Category, MenuItemType } from "../types";
import MenuItem from "../components/MenuItem";
import CategoryTabs from "../components/CategoryTabs";
import Cart from "../components/Cart";
import OrderTicket from "../components/OrderTicket";
import ChangeCalculator from "../components/ChangeCalculator";
import { useGameSession } from "../hooks/useGameSession";



export default function OrderScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [searchParams] = useSearchParams();
  const sessionCode = searchParams.get("code") || "";

  // get curret session name from useGameSession
  const {session, sessions} = useGameSession();

  console.log("sessionName", session?.name);
  console.log("sessions", sessions);

  // memoised session name getter
  const getSessionName = useCallback((id: string | null) => {
    if (!id) return "Unknown Session";
    const foundSession = sessions.find((s) => s.id === id);
    return foundSession ? foundSession.name : "Unknown Session";
  }, [sessions]);

  const { orders, placeOrder } = useOrders(sessionId || null);
  const { menuItems } = useMenu(sessionId || null);
  const [category, setCategory] = useState<Category>("burgers");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderCount, setOrderCount] = useState(1);
  const [showCalculator, setShowCalculator] = useState(false);
  const [view, setView] = useState<"menu" | "orders">("menu");

  const filteredMenu = menuItems.filter((item) => item.category === category);

  const readyOrders = orders.filter((o) => o.status === "ready");
  const cookingOrders = orders.filter((o) => o.status === "cooking");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const servedOrders = orders.filter((o) => o.status === "served");
  const activeCount = pendingOrders.length + cookingOrders.length;

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
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

  function handlePayAndOrder() {
    if (cart.length === 0) return;
    setShowCalculator(true);
  }

  async function handlePaymentComplete(amountPaid: number, changeDue: number) {
    await placeOrder(cart, orderCount, amountPaid, changeDue);
    setOrderCount((c) => c + 1);
    setCart([]);
    setShowCalculator(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">
            Welcome to {getSessionName(sessionId)}
          </h1>
          <p className="text-sm text-gray-500">Order Screen</p>
        </div>
        <div className="flex items-center gap-3">
          {readyOrders.length > 0 && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
              {readyOrders.length} Ready!
            </span>
          )}
          <div className="bg-amber-100 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-600 font-medium">Kitchen Code</p>
            <p className="text-2xl font-mono font-bold tracking-widest text-gray-900">
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
              ? "bg-amber-400 text-black shadow-md"
              : "bg-white text-gray-700 shadow-sm"
          }`}
        >
          📋 Menu
        </button>
        <button
          onClick={() => setView("orders")}
          className={`px-5 py-2 rounded-full font-bold transition-all ${
            view === "orders"
              ? "bg-amber-400 text-black shadow-md"
              : "bg-white text-gray-700 shadow-sm"
          }`}
        >
          📦 Orders{" "}
          {activeCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
              {activeCount}
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
        <div className="p-4 space-y-4 pb-8">
          {readyOrders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-green-700">
                ✅ Ready to Serve
              </h2>
              <div className="space-y-3">
                {readyOrders.map((order) => (
                  <OrderTicket key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {(pendingOrders.length > 0 || cookingOrders.length > 0) && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-800">
                📦 In Progress
              </h2>
              <div className="space-y-3">
                {[...cookingOrders, ...pendingOrders].map((order) => (
                  <OrderTicket key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {servedOrders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-500">
                🎉 Served
              </h2>
              <div className="space-y-3 opacity-60">
                {servedOrders.map((order) => (
                  <OrderTicket key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {orders.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <span className="text-5xl block mb-3">📭</span>
              <p className="text-xl font-bold">No orders yet</p>
              <p className="text-gray-600">
                Switch to the Menu tab to start taking orders!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Floating Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-20">
        <Cart
          items={cart}
          onPlaceOrder={handlePayAndOrder}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
        />
      </div>

      {/* Change Calculator Modal - shown at order time */}
      {showCalculator && (
        <ChangeCalculator
          total={cartTotal}
          onComplete={handlePaymentComplete}
          onCancel={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
}
