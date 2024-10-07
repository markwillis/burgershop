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

type MenuItem = BaseMenuItem & {
  categories: CategoryType[];
  price: {
    [size: string]: number;
  };
};

const menu: MenuItem[] = [
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

function calcMultipleOrders(arr) {
  return arr.reduce((accOrders, currentOrder) => {
    if (!accOrders[currentOrder.title]) {
      return { ...accOrders, [currentOrder.title]: { quantity: 1 } };
    } else {
      // increase the quantity by 1
      accOrders[currentOrder.title].quantity++;
    }

    return accOrders;
  }, {});
}

function App() {
  const [fullMenu, setFullMenu] = React.useState<MenuItem[]>(menu);
  const [newItemInput, setNewItemInput] = React.useState("");
  const [orders, setOrders] = React.useState([]);

  function handleClick({ title, id }: { title: string; id: string }) {
    setOrders((prevOrders) => {
      return [...prevOrders, { title, id }];
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFullMenu((prevMenu) => {
      return [
        ...prevMenu,
        { title: newItemInput, description: "none", price: 12 },
      ];
    });
    setNewItemInput("");
  }

  const menuItems = fullMenu.map((item, i) => {
    return (
      <MenuItem
        key={i}
        id={`menu-item-${i}`}
        name={item.name}
        description={item.description}
        price={item.price.regular}
        handleClick={handleClick}
      />
    );
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
