import { Category } from "../types";
import { categories } from "../data/menu";

export default function CategoryTabs({
  active,
  onChange,
}: {
  active: Category;
  onChange: (cat: Category) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`flex items-center gap-2 px-5 py-3 rounded-full text-lg font-bold whitespace-nowrap transition-all ${
            active === cat.key
              ? "bg-amber-400 text-black scale-105 shadow-lg"
              : "bg-white/80 text-gray-700 hover:bg-amber-100"
          }`}
        >
          <span className="text-2xl">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
