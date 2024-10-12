import React, { ReactNode } from "react";
import { type OrderItem } from "../App.tsx";

function OrderItem({ name }) {
  return <div className="order-item">{name}</div>;
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
    return total;
  }, 0);

  return (
    <div className="side-bar-wrapper w-full md:w-1/3 p-8 h-1/4 md:h-full fixed bottom-0 right-0 left-auto">
      <div className="side-bar-inner border border-amber-500 bg-white overflow-hidden shadow-2xl shadow-gray-400 h-full p-8 rounded-2xl">
        {children}
        <ul>{orderList}</ul>
      </div>
    </div>
  );
}
export default React.memo(Sidebar);
