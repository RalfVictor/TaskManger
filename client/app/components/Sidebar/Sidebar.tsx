import React from "react";
import Profile from "../Profile/Profile";
import { RadialChart } from "../RadialChart/RadialChart";

const Sidebar = () => {
  return (
    <div className=" right-0 top-0 w-[20rem]  h-[calc(100% - 5rem)">
      <Profile />
      <div className="mt-4 mx-6">
        <RadialChart />
      </div>
    </div>
  );
};

export default Sidebar;
