export type Category = "burgers" | "sides" | "drinks" | "desserts";

export type MenuItemType = {
  id: number;
  name: string;
  description: string;
  emoji: string;
  price: number;
  category: Category;
};

export type CartItem = MenuItemType & {
  quantity: number;
};

export type OrderStatus = "pending" | "cooking" | "ready" | "served";

export type OrderItemData = {
  name: string;
  emoji: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  session_id: string;
  order_number: number;
  items: OrderItemData[];
  total: number;
  status: OrderStatus;
  amount_paid: number | null;
  change_due: number | null;
  created_at: string;
};

export type GameSession = {
  id: string;
  code: string;
  name: string;
  created_at: string;
};
