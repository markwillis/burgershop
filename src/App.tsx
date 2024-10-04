import React, { ReactNode } from "react";
import "./App.css";
import classicBurger from "./assets/class-burger.png";

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
    name: "George Burger",
    description: "The George Burger is a 4oz burger with only mayo.",
    price: { regular: 8 },
    featured: false,
    categories: ["burgers"],
  },
];

function MenuItem({ name, id, description, price, handleClick }) {
  return (
    <div
      onClick={() => handleClick({ name, id })}
      className="group flex flex-col shadow-3xl transition duration-400 ease-in-out bg-yellow-500 hover:bg-amber-600 rounded-2xl items-stretch justify-stretch justify-items-stretch mr-2.5 p-1"
    >
      <div className="flex justify-center">
        <img
          className="mb-4 group-hover:scale-110 transition duration-400 ease-in-out "
          src={classicBurger}
          width="200px"
          height="200px"
          alt=""
          style={{ marginBottom: "15px" }}
        />
      </div>
      {/*  black inner section */}
      <div className="bg-black relative px-6 py-10 grow flex flex-col items-start justify-items-start text-white rounded-2xl">
        <h4 className="text-2xl font-bold font-serif">{name}</h4>
        <p className="text-left">{description}</p>
        <div className="price-wrapper absolute -top-4 right-10">
          <div className="w-full h-full bg-yellow-500 absolute top-0 left-0 group-hover:animate-ping rounded-2xl" />
          <p className="bg-white rounded-2xl px-6 py-1.5 relative text-black">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Heading({ title }: { title: string }) {
  return (
    <h1 className="heading text-4xl font-bold mb-2 font-serif">{title}</h1>
  );
}

function MainPage({ children }: { children: ReactNode }) {
  return <div className="w-2/3 py-12 px-4">{children}</div>;
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

function SideBar({ children, orders }) {
  // const currentOrders = Object.entries(accumulatedOrders).map(
  //   ([key, value]) => {
  //     return (
  //       <li key={key} className="flex row">
  //         <div className="grow select-none">
  //           {key} ({value.quantity})
  //         </div>
  //       </li>
  //     );
  //   },
  // );

  return (
    <div className="side-bar w-1/3 p-8 h-full fixed top-0 right-0 left-auto">
      <div className="border border-amber-500 shadow-2xl shadow-gray-400 h-full p-8 rounded-2xl">
        {children}
        {/*<ul>{currentOrders}</ul>*/}
      </div>
    </div>
  );
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
        <div className="menu-item-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          {menuItems}
        </div>
      </MainPage>
      <SideBar orders={orders}>
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
      </SideBar>
    </div>
  );
}

export default App;
