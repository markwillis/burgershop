function Sidebar({ children, orders }) {
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
    <div className="side-bar-wrapper w-full md:w-1/3 p-8 h-1/4 md:h-full fixed bottom-0 right-0 left-auto">
      <div className="side-bar-inner border border-amber-500 bg-white overflow-hidden shadow-2xl shadow-gray-400 h-full p-8 rounded-2xl">
        {children}
        {/*<ul>{currentOrders}</ul>*/}
      </div>
    </div>
  );
}
export default Sidebar;
