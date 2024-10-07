import React, { ReactNode } from "react";
import "./App.css";
import MenuItem from "./components/MenuItem.tsx";
import Sidebar from "./components/Sidebar.tsx";
type CategoryType = "burgers" | "snacks" | "sides" | "drinks" | "add-ons";

type BaseMenuItem = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  featured: boolean;
};

export type MenuItemType = BaseMenuItem & {
  categories: CategoryType[];
  price: {
    [size: string]: number;
  };
};

const menu: MenuItemType[] = [
  {
    id: 1,
    name: "George Burger",
    description: "The George Burger is a 4oz burger with only mayo.",
    price: { regular: 8 },
    featured: false,
    categories: ["burgers"],
  },
  {
    id: 2,
    name: "Dad Burger",
    description:
      "An oversized piece of meat that is sure to give you the sweats just looking at it",
    price: { regular: 15 },
    featured: false,
    categories: ["burgers"],
  },
];

function Heading({ title }: { title: string }) {
  return (
    <h1 className="heading text-4xl font-bold mb-2 font-serif">{title}</h1>
  );
}

function MainPage({ children }: { children: ReactNode }) {
  return <div className="w-full md:w-2/3 py-12 px-4">{children}</div>;
}

// function calcMultipleOrders(arr) {
//   return arr.reduce((accOrders, currentOrder) => {
//     if (!accOrders[currentOrder.title]) {
//       return { ...accOrders, [currentOrder.title]: { quantity: 1 } };
//     } else {
//       // increase the quantity by 1
//       accOrders[currentOrder.title].quantity++;
//     }
//
//     return accOrders;
//   }, {});
// }

export type OrderItem = {
  name: string;
  id: number;
};

function App() {
  const [fullMenu, setFullMenu] = React.useState<MenuItemType[]>(menu);
  const [newItemInput, setNewItemInput] = React.useState("");
  const [orders, setOrders] = React.useState<Array<OrderItem>>();

  function handleClick({ name, id }: OrderItem) {
    setOrders((prevOrders) => {
      if (!prevOrders) return;
      return [...prevOrders, { name, id }];
    });
    console.log(name, id);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFullMenu((prevMenu: MenuItemType[]) => {
      return [
        ...prevMenu,
        {
          name: newItemInput,
          description: "none",
          price: { regular: 12 },
          id: prevMenu.length + 1,
          featured: false,
          categories: ["burgers"],
        },
      ];
    });
    setNewItemInput("");
  }

  const menuItems = fullMenu.map((item, i) => {
    return <MenuItem key={i} item={item} handleClick={handleClick} />;
  });

  return (
    <div className="App w-full flex flex-row relative">
      <MainPage>
        <div className="menu-item-wrapper grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {menuItems}
        </div>
      </MainPage>
      <Sidebar orders={orders}>
        <Heading title="The G&J Burger Co." />
        <form onSubmit={handleSubmit}>
          <label htmlFor="item">Item to add</label>
          <input
            id="item"
            className="border ml-2"
            type="text"
            placeholder="Item name"
            value={newItemInput}
            onChange={(e) => setNewItemInput(e.target.value)}
          />
        </form>
      </Sidebar>
    </div>
  );
}

export default App;
