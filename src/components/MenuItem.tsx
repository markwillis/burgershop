import classicBurger from "../assets/class-burger.png";

type MenuItem = {
  name: string;
  id: string;
  description: string;
  price: number;
  handleClick: (p: { name: string; id: string }) => void;
};

function AddButton() {
  return (
    <div className="add-button group text-black rounded-full bg-white w-10 h-10 color inline-flex justify-center hover:bg-amber-400 transition-colors duration-1500 ease-in-out cursor-pointer">
      <span className="place-self-center">+</span>
    </div>
  );
}

function MenuItem({ name, id, description, price, handleClick }: MenuItem) {
  return (
    <div
      onClick={() => handleClick({ name, id })}
      className="group flex flex-col shadow-3xl transition duration-1200 ease-in-out bg-yellow-500 hover:bg-amber-600 rounded-2xl items-stretch justify-stretch justify-items-stretch mr-2.5 p-1"
    >
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
        <div className="add-button-wrapper absolute bottom-4 right-4">
          <AddButton />
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
