// "use client";

// import { useState } from "react";
// import ViewUsersTab from "../../../components/UserManagement/ManageUser";
// import AddUserTab from "../../../components/UserManagement/AddUser";
// import RolesTab from "../../../components/UserManagement/ManageRole";

// export default function UserManagement() {
//   const [activeTab, setActiveTab] = useState("roles");

//   return (
//     <div className=" bg-[#161618] p-3 md:p-6 rounded-lg shadow-lg max-w-screen h-[91vh] overflow-y-auto ">
//       <div className="text-2xl Raleway text-[#626469] dark:text-white font-semibold">
//         User Management
//       </div>
//       <div className="flex flex-wrap gap-6 md:gap-16 border-b-2 border-[rgba(0,0,0,0.14)] mt-6 md:mt-10 pb-2">
//          <button
//           onClick={() => setActiveTab("roles")}
//           className={`font-raleway cursor-pointer text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
//             activeTab === "roles"
//               ? "text-[#1A68B2]"
//               : "text-black dark:text-white"
//           }`}>
//           Roles
//         </button>
//         <button
//           onClick={() => setActiveTab("add")}
//           className={`font-raleway cursor-pointer text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
//             activeTab === "add"
//               ? "text-[#1A68B2]"
//               : "text-black dark:text-white"
//           }`}>
//           Add Users
//         </button>
//         <button
//           onClick={() => setActiveTab("view")}
//           className={`font-raleway cursor-pointer text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
//             activeTab === "view"
//               ? "text-[#1A68B2]"
//               : "text-black dark:text-white"
//           }`}>
//           View Users
//         </button>
//       </div>
//       <div className="mt-4">
//         {activeTab === "view" && <ViewUsersTab />}
//         {activeTab === "add" && <AddUserTab />}
//         {activeTab === "roles" && <RolesTab />}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import ViewUsersTab from "../../../components/UserManagement/ManageUser";
import AddUserTab from "../../../components/UserManagement/AddUser";
import RolesTab from "../../../components/UserManagement/ManageRole";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("roles");

  return (
    <div className="bg-gray-50 dark:bg-[#161618]  p-3 md:p-6 rounded-sm shadow-lg max-w-screen h-[91vh] overflow-y-auto ">
      <div className="text-2xl Raleway text-[#323234] dark:text-white font-semibold">
        User Management
      </div>
      <div className="flex flex-wrap gap-6 md:gap-16 border-b-2 border-[#323234] mt-6 md:mt-10 pb-2">
        <button
          onClick={() => setActiveTab("roles")}
          className={`font-raleway cursor-pointer text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
            activeTab === "roles"
              ? "text-[#F7D035]"
              : "text-[#323234] dark:text-white"
          }`}>
          Roles
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`font-raleway cursor-pointer text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
            activeTab === "add"
              ? "text-[#F7D035]"
              : "text-[#323234] dark:text-white"
          }`}>
          Add Users
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`font-raleway cursor-pointer text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
            activeTab === "view"
              ? "text-[#FFDF00]"
              : "text-[#323234] dark:text-white"
          }`}>
          View Users
        </button>
      </div>
      <div className={`${
    activeTab === "view"
      ? "mt-30"
      : activeTab === "add"
      ? "mt-6"
      : activeTab === "roles"
      ? "mt-30"
      : ""
  }`}>
        {activeTab === "view" && <ViewUsersTab />}
        {activeTab === "add" && <AddUserTab />}
        {activeTab === "roles" && <RolesTab />}
      </div>
    </div>
  );
}