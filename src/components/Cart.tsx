import { CartItem } from "../types";

export default function Cart({
  items,
  onPlaceOrder,
  onUpdateQuantity,
  onRemove,
}: {
  items: CartItem[];
  onPlaceOrder: () => void;
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur rounded-2xl p-6 text-center text-gray-400">
        <span className="text-4xl block mb-2">🛒</span>
        <p className="font-bold">Cart is empty</p>
        <p className="text-sm">Tap items to add them!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <span>🛒</span> Your Order
      </h3>
      <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <span className="text-xl">{item.emoji}</span>
            <span className="font-medium flex-1">{item.name}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  item.quantity <= 1
                    ? onRemove(item.id)
                    : onUpdateQuantity(item.id, item.quantity - 1)
                }
                className="w-7 h-7 rounded-full bg-gray-200 hover:bg-red-200 font-bold text-sm"
              >
                {item.quantity <= 1 ? "×" : "−"}
              </button>
              <span className="w-6 text-center font-bold">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-full bg-gray-200 hover:bg-green-200 font-bold text-sm"
              >
                +
              </button>
            </div>
            <span className="w-16 text-right font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t-2 border-dashed border-amber-300 pt-3 flex items-center justify-between">
        <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
        <button
          onClick={onPlaceOrder}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          Place Order!
        </button>
      </div>
    </div>
  );
}
