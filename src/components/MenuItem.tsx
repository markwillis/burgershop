import React from "react";
import classicBurger from "../assets/class-burger.png";
import { MenuItemType } from "../App.tsx";

function AddButton({
  handleClick,
  item,
  quantity,
  setQuantity,
}: {
  item: MenuItemType;
  handleClick: (item: MenuItemType, quantity: number) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}) {
  return (
    <div
      onClick={() => {
        handleClick(item, quantity);
        setQuantity(1);
      }}
      className="add-button group text-black rounded bg-white ml-2 p-4 grow h-10 color inline-flex hover:bg-amber-400 transition-colors duration-1500 ease-in-out cursor-pointer"
    >
      <span className="place-self-center">Add</span>
    </div>
  );
}

function QuantitySelector({ quantity, setQuantity, handleClick, item }) {
  return (
    <div className="flex ">
      <div className="relative w-full min-w-0 h-10">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="peer w-full h-full bg-white text-black font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <div className="input-button-wrapper absolute right-1 top-1 flex gap-0.5">
          <button
            className="decrease-button relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] text-xs bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded"
            onClick={() => setQuantity((cur) => (cur === 0 ? 0 : cur - 1))}
          >
            <span className="button-icon absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
              </svg>
            </span>
          </button>
          <button
            className="increase-button relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] text-xs bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded"
            onClick={() => setQuantity((cur) => cur + 1)}
          >
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <AddButton
        handleClick={handleClick}
        item={item}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </div>
  );
}

function MenuItem({
  item,
  handleClick,
}: {
  item: MenuItemType;
  handleClick: (item: MenuItemType, quantity: number) => void;
}) {
  const [quantity, setQuantity] = React.useState(1);
  const { name, description, price } = item;

  return (
    <div className="group flex flex-col shadow-3xl transition duration-1200 ease-in-out bg-yellow-500 hover:bg-amber-600 rounded-2xl items-stretch justify-stretch justify-items-stretch mr-2.5 p-1">
      <div className="flex justify-center">
        <img
          className="mb-4 group-hover:scale-110 transition duration-1200 ease-in-out"
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
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          handleClick={handleClick}
          item={item}
        />
      </div>
    </div>
  );
}

export default React.memo(MenuItem);
