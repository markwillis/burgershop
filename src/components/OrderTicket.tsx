import { Order } from "../types";

const statusConfig = {
  pending: {
    label: "Paid - New!",
    bg: "bg-yellow-100 border-yellow-400",
    badge: "bg-yellow-400 text-black",
    emoji: "🔔",
  },
  cooking: {
    label: "Cooking...",
    bg: "bg-orange-100 border-orange-400",
    badge: "bg-orange-400 text-white",
    emoji: "🍳",
  },
  ready: {
    label: "Ready!",
    bg: "bg-green-100 border-green-400",
    badge: "bg-green-500 text-white",
    emoji: "✅",
  },
  served: {
    label: "Served",
    bg: "bg-gray-100 border-gray-300",
    badge: "bg-gray-400 text-white",
    emoji: "🎉",
  },
};

export default function OrderTicket({
  order,
  onStatusChange,
  showActions,
}: {
  order: Order;
  onStatusChange?: (orderId: string, status: Order["status"]) => void;
  showActions?: boolean;
}) {
  const config = statusConfig[order.status];

  return (
    <div
      className={`rounded-2xl border-2 p-5 ${config.bg} transition-all ${
        order.status === "pending" ? "animate-pulse-slow" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-bold text-gray-900">
          Order #{order.order_number}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${config.badge}`}
        >
          {config.emoji} {config.label}
        </span>
      </div>

      <ul className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-lg text-gray-800">
            <span className="text-2xl">{item.emoji}</span>
            <span className="font-medium flex-1">{item.name}</span>
            <span className="font-bold text-xl text-gray-700">
              ×{item.quantity}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-gray-900">
            ${order.total.toFixed(2)}
          </span>
          {order.amount_paid != null && (
            <span className="text-sm text-gray-500 ml-2">
              (paid ${order.amount_paid.toFixed(2)}, change $
              {order.change_due?.toFixed(2)})
            </span>
          )}
        </div>

        {showActions && onStatusChange && order.status === "pending" && (
          <button
            onClick={() => onStatusChange(order.id, "cooking")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            🍳 Start Cooking!
          </button>
        )}

        {showActions && onStatusChange && order.status === "cooking" && (
          <button
            onClick={() => onStatusChange(order.id, "ready")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            ✅ Order Ready!
          </button>
        )}

        {showActions && onStatusChange && order.status === "ready" && (
          <button
            onClick={() => onStatusChange(order.id, "served")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            🎉 Served!
          </button>
        )}
      </div>
    </div>
  );
}
