import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import OrderTicket from "../components/OrderTicket";
import { useEffect, useRef } from "react";

export default function KitchenScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders(sessionId || null);
  const prevCountRef = useRef(orders.length);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const cookingOrders = orders.filter((o) => o.status === "cooking");
  const readyOrders = orders.filter((o) => o.status === "ready");

  useEffect(() => {
    if (orders.length > prevCountRef.current) {
      try {
        const audio = new AudioContext();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.frequency.value = 800;
        gain.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audio.currentTime + 0.15);
        setTimeout(() => {
          const osc2 = audio.createOscillator();
          const gain2 = audio.createGain();
          osc2.connect(gain2);
          gain2.connect(audio.destination);
          osc2.frequency.value = 1200;
          gain2.gain.value = 0.3;
          osc2.start();
          osc2.stop(audio.currentTime + 0.15);
        }, 150);
      } catch {
        // Audio not available
      }
    }
    prevCountRef.current = orders.length;
  }, [orders.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/30 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold font-serif">👨‍🍳 Kitchen</h1>
          <p className="text-sm text-gray-400">
            {pendingOrders.length} new &middot; {cookingOrders.length} cooking
            &middot; {readyOrders.length} ready
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingOrders.length > 0 && (
            <div className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-xl animate-pulse">
              🔔 {pendingOrders.length} NEW
            </div>
          )}
          <button
            onClick={() => navigate(`/kitchen/${sessionId}/menu`)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl transition-all"
          >
            📝 Edit Menu
          </button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-yellow-400">
              🔔 New Orders (Paid)
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingOrders.map((order) => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  onStatusChange={updateOrderStatus}
                  showActions
                />
              ))}
            </div>
          </section>
        )}

        {/* Cooking Orders */}
        {cookingOrders.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-orange-400">
              🍳 Cooking
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cookingOrders.map((order) => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  onStatusChange={updateOrderStatus}
                  showActions
                />
              ))}
            </div>
          </section>
        )}

        {/* Ready Orders */}
        {readyOrders.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3 text-green-400">
              ✅ Ready to Serve
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {readyOrders.map((order) => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  onStatusChange={updateOrderStatus}
                  showActions
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {orders.filter((o) => o.status !== "served").length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <span className="text-6xl block mb-4">👨‍🍳</span>
            <h2 className="text-3xl font-bold mb-2">Kitchen is quiet...</h2>
            <p className="text-xl">Waiting for orders to come in!</p>
          </div>
        )}
      </div>
    </div>
  );
}
