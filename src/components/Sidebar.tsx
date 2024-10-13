import React, { ReactNode } from "react";
import { type OrderItem } from "../App.tsx";

function OrderItem({ name }) {
  return <div className="order-item">{name}</div>;
}

function Total({ total }: { total: number }) {
  return (
    <div className="order-total w-full bg-gray-400 p-4 absolute bottom-0 left-0">
      <h2>Total: ${total.toFixed(2)}</h2>
      "some styles here"
    </div>
  );
}

function Sidebar({
  children,
  orders,
}: {
  children: ReactNode;
  orders: OrderItem[];
}) {
  React.useEffect(() => {
    console.log(orders);
  }, [orders]);

  const orderList = orders.map((item: OrderItem, index: number) => {
    return (
      <li key={index}>
        <h4>{item.name}</h4>
        <h5>{item.quantity}</h5>
      </li>
    );
  });

  const calculateTotal = orders.reduce((total, currOrder) => {
    return total + currOrder.price * currOrder.quantity;
  }, 0);

  return (
    <div className="side-bar-wrapper w-full md:w-1/3 p-8 h-1/4 md:h-full fixed bottom-0 right-0 left-auto">
      <div className="relative side-bar-inner border border-amber-500 bg-white overflow-hidden shadow-2xl shadow-gray-400 h-full p-8 rounded-2xl">
        {children}
        <ul>{orderList}</ul>
        <Total total={calculateTotal} />
      </div>
    </div>
  );
}
export default React.memo(Sidebar);
