import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { Category, MenuItemType } from "../types";
import { categories } from "../data/menu";

const EMOJI_OPTIONS = [
  "🍔", "🍗", "🥦", "🥩", "🍟", "🧅", "🍗", "🇨🇦",
  "🥤", "🥛", "🧃", "🍨", "🍪", "🍩", "🌮", "🌭",
  "🥪", "🥗", "🧁", "🍕", "🥞", "🧇", "🍿", "🫐",
];

function MenuItemEditor({
  item,
  onSave,
  onDelete,
  onCancel,
}: {
  item?: MenuItemType;
  onSave: (data: {
    name: string;
    description: string;
    emoji: string;
    price: number;
    category: Category;
  }) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [emoji, setEmoji] = useState(item?.emoji || "🍔");
  const [price, setPrice] = useState(item?.price?.toString() || "");
  const [category, setCategory] = useState<Category>(
    item?.category || "burgers",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p = parseFloat(price);
    if (!name || isNaN(p) || p <= 0) return;
    onSave({ name, description, emoji, price: p, category });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-gray-900 overflow-hidden"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {item ? "Edit Item" : "Add New Item"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Emoji
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {EMOJI_OPTIONS.map((e, i) => (
                <button
                  key={`${e}-${i}`}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-xl w-9 h-9 rounded-lg transition-all shrink-0 ${
                    emoji === e
                      ? "bg-amber-200 scale-110 shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Super Burger"
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg text-gray-900 focus:border-amber-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. The best burger in town"
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-gray-900 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5.00"
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg text-gray-900 focus:border-amber-400 focus:outline-none"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg text-gray-900 focus:border-amber-400 focus:outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-4 rounded-xl transition-all"
            >
              🗑️ Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            {item ? "Save" : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function MenuEditor() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { menuItems, menuLoaded, addMenuItem, updateMenuItem, deleteMenuItem, seedDefaultMenu } =
    useMenu(sessionId || null);
  const [editing, setEditing] = useState<MenuItemType | null>(null);
  const [adding, setAdding] = useState(false);
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");

  const filtered =
    filterCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === filterCategory);

  const hasDbMenu = menuItems.some(
    (item) => "session_id" in item,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <header className="bg-black/30 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold font-serif">📝 Menu Editor</h1>
          <p className="text-sm text-gray-400">
            {menuItems.length} items on the menu
          </p>
        </div>
        <button
          onClick={() => navigate(`/kitchen/${sessionId}`)}
          className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl transition-all"
        >
          ← Back to Kitchen
        </button>
      </header>

      <div className="p-4 space-y-4">
        {menuLoaded && !hasDbMenu && (
          <div className="bg-amber-500/20 border border-amber-400 rounded-2xl p-4 text-center">
            <p className="text-amber-200 mb-3">
              You're using the default menu. Load it into your restaurant so you
              can customize it!
            </p>
            <button
              onClick={seedDefaultMenu}
              className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-6 rounded-xl text-lg transition-all hover:scale-105 active:scale-95"
            >
              🍔 Load Default Menu
            </button>
          </div>
        )}

        {/* Filter + Add */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
              filterCategory === "all"
                ? "bg-amber-400 text-black"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                filterCategory === cat.key
                  ? "bg-amber-400 text-black"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
          <button
            onClick={() => setAdding(true)}
            className="ml-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-full text-sm whitespace-nowrap transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            + Add Item
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setEditing(item)}
              className="bg-white/10 hover:bg-white/20 rounded-2xl p-4 text-left transition-all flex items-center gap-4"
            >
              <span className="text-4xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{item.name}</h3>
                <p className="text-gray-400 text-sm truncate">
                  {item.description}
                </p>
              </div>
              <span className="bg-amber-400 text-black font-bold px-3 py-1 rounded-full text-lg shrink-0">
                ${item.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <span className="text-5xl block mb-3">🍽️</span>
            <p className="text-xl font-bold">No items in this category</p>
            <p>Tap "+ Add Item" to create one!</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {adding && (
        <MenuItemEditor
          onSave={async (data) => {
            await addMenuItem(data);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* Edit Modal */}
      {editing && (
        <MenuItemEditor
          item={editing}
          onSave={async (data) => {
            await updateMenuItem(editing.id, data);
            setEditing(null);
          }}
          onDelete={async () => {
            await deleteMenuItem(editing.id);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
