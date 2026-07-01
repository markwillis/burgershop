import { MenuItemType } from "../types";

export default function MenuItem({
  item,
  onAdd,
}: {
  item: MenuItemType;
  onAdd: (item: MenuItemType) => void;
}) {
  return (
    <button
      onClick={() => onAdd(item)}
      className="group flex flex-col items-center bg-white hover:bg-amber-50 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-transparent hover:border-amber-300"
    >
      <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">
        {item.emoji}
      </span>
      <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
      <p className="text-gray-600 text-sm text-center mb-2">
        {item.description}
      </p>
      <span className="bg-amber-400 text-black font-bold px-4 py-1 rounded-full text-lg">
        ${item.price.toFixed(2)}
      </span>
    </button>
  );
}
