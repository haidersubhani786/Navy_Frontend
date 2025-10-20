// "use client";
// import { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import config from "../../../config";
// import { toast } from "react-toastify";

// export default function Roles() {
//   const [roles, setRoles] = useState([]);
//   const [privileges, setPrivileges] = useState([]);
//   const [filteredRoles, setFilteredRoles] = useState([]);
//   const [token, setToken] = useState(null);

//   const [newRole, setNewRole] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPrivileges, setSelectedPrivileges] = useState([]);
//   const [editRolePopup, setEditRolePopup] = useState(false);
//   const [showRolePopup, setShowRolePopup] = useState(false);
//   const [editRole, setEditRole] = useState(null);
//   const [editPrivileges, setEditPrivileges] = useState([]);

//   const baseUrl = `${config.BASE_URL}`;

//   // ---- read token on mount ----
//   useEffect(() => {
//     const t = localStorage.getItem("token");
//     setToken(t);
//   }, [baseUrl]);

//   // ---- search helper (declare BEFORE the effect using it) ----
//   const handleSearch = useCallback(
//     (term) => {
//       setSearchTerm(term);
//       const filtered = roles.filter((role) => {
//         const privilegesString = Array.isArray(role.privileges)
//           ? role.privileges.map((p) => p.name).join(" ")
//           : "";
//         return `${role.name} ${privilegesString}`
//           .toLowerCase()
//           .includes(term.toLowerCase());
//       });
//       setFilteredRoles(filtered);
//     },
//     [roles]
//   );

//   useEffect(() => {
//     handleSearch(searchTerm);
//   }, [roles, searchTerm, handleSearch]);

//   // ---- helpers ----
//   const enrichRoles = useCallback((rawRoles, allPrivileges) => {
//     const byId = new Map(allPrivileges.map((p) => [p._id, p]));
//     return (rawRoles || []).map((role) => ({
//       ...role,
//       privileges: (role.privelleges || role.privileges || [])
//         .map((id) => byId.get(id))
//         .filter(Boolean),
//     }));
//   }, []);

//   const loadAll = useCallback(async () => {
//     if (!token) return;
//     try {
//       const [privRes, rolesRes] = await Promise.all([
//         axios.get(`${baseUrl}/privelleges/allprivelleges`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${baseUrl}/roles/allrole`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const allPrivileges = privRes.data || [];
//       const rawRoles = rolesRes.data?.data || rolesRes.data || [];
//       const enriched = enrichRoles(rawRoles, allPrivileges);

//       setPrivileges(allPrivileges);
//       setRoles(enriched);
//       setFilteredRoles(enriched);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to load roles/privileges!");
//     }
//   }, [baseUrl, token, enrichRoles]);

//   const refreshRoles = useCallback(async () => {
//     if (!token) return;
//     try {
//       const rolesRes = await axios.get(`${baseUrl}/roles/allrole`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const rawRoles = rolesRes.data?.data || rolesRes.data || [];
//       const enriched = enrichRoles(rawRoles, privileges);
//       setRoles(enriched);
//       setFilteredRoles(enriched);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to refresh roles!");
//     }
//   }, [baseUrl, token, privileges, enrichRoles]);

//   useEffect(() => {
//     if (token) loadAll();
//   }, [token, loadAll]);

//   // ---- actions ----
//   const handleAddRole = async () => {
//     if (!newRole.trim()) {
//       toast.error("Please enter a role name.");
//       return;
//     }
//     try {
//       // 1) create role
//       const res = await axios.post(
//         `${baseUrl}/roles/addrole`,
//         { name: newRole },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const createdRole = res.data?.role || res.data?.data;

//       // 2) assign privileges (IDs)
//       if (createdRole && selectedPrivileges.length > 0) {
//         await axios.put(
//           `${baseUrl}/roles/${createdRole._id}/privelleges`,
//           { privellegeNames: selectedPrivileges },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }

//       toast.success("Role created and privileges assigned!");
//       setNewRole("");
//       setSelectedPrivileges([]);
//       setShowRolePopup(false);
//       await refreshRoles();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to add role or assign privileges!");
//     }
//   };

//   const handleUpdateRole = async () => {
//     if (!editRole) {
//       toast.error("No role selected to update.");
//       return;
//     }
//     if (editPrivileges.length === 0) {
//       toast.error("Please select at least one privilege.");
//       return;
//     }
//     try {
//       await axios.put(
//         `${baseUrl}/roles/${editRole._id}/privelleges`,
//         { privellegeNames: editPrivileges },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Privileges updated successfully!");
//       setEditRolePopup(false);
//       await refreshRoles();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to update privileges!");
//     }
//   };

//   const handleDeleteRole = (id) => {
//     toast.info(
//       ({ closeToast }) => (
//         <div>
//           <p className="mb-2 font-semibold">Are you sure you want to delete?</p>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={async () => {
//                 try {
//                   await axios.delete(`${baseUrl}/roles/deleterole/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                   });
//                   toast.success("Role has been removed.");
//                   await refreshRoles();
//                 } catch (error) {
//                   toast.error(error?.response?.data?.message || "Failed to delete role!");
//                 } finally {
//                   closeToast();
//                 }
//               }}
//               className="bg-[#1f5897] cursor-pointer hover:bg-[#90abcaff] text-white text-sm px-3 py-1 rounded"
//             >
//               Delete
//             </button>
//             <button
//               onClick={closeToast}
//               className="px-3 py-1 text-sm text-white bg-gray-400 rounded cursor-pointer hover:bg-gray-500"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ),
//       {
//         autoClose: false,
//         closeOnClick: false,
//         closeButton: false,
//         draggable: false,
//         position: "top-right",
//         toastClassName: "center-toast",
//         bodyClassName: "center-toast-body",
//       }
//     );
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-end mb-4">
//         <button
//           onClick={() => setShowRolePopup(true)}
//           className="bg-[#1F5897] cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[#17406c]"
//         >
//           + Add Role
//         </button>
//       </div>

//       <div className="flex flex-col justify-end gap-2 mb-4 sm:flex-row">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           placeholder="Search roles..."
//           className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm dark:text-white focus:outline-blue-500 sm:w-64"
//         />
//       </div>

//       <div className="w-full overflow-x-auto bg-white border border-gray-300 rounded-md dark:bg-gray-800">
//         <table className="min-w-[600px] w-full text-xs md:text-sm text-gray-800 dark:text-white">
//           <thead className="bg-[#1A68B252] dark:text-white text-[#1A68B2] font-semibold font-raleway text-[13px] md:text-[15.34px] leading-[125%] h-[40px] md:h-[45px] border-l border-l-[rgba(26,104,178,0.32)] border-r border-r-[rgba(26,104,178,0.32)]">
//             <tr>
//               <th className="px-2 py-2 text-left md:px-4 md:py-3 whitespace-nowrap">#</th>
//               <th className="px-2 py-2 text-left md:px-4 md:py-3 whitespace-nowrap">Role</th>
//               <th className="px-2 py-2 text-left md:px-4 md:py-3 whitespace-nowrap">Privileges</th>
//               <th className="px-2 py-2 text-center md:px-4 md:py-3 whitespace-nowrap">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredRoles.map((role, i) => (
//               <tr
//                 key={role._id}
//                 className="hover:bg-blue-50 dark:hover:bg-gray-900 dark:text-white transition duration-150 ease-in-out h-[40px] md:h-[45px]"
//               >
//                 <td className="px-2 py-2 border border-gray-300 md:px-4">{i + 1}</td>
//                 <td className="px-2 py-2 border border-gray-300 md:px-4">{role.name}</td>
//                 <td className="px-2 py-2 border border-gray-300 md:px-4">
//                   {(role.privileges || []).map((p) => p.name).join(", ")}
//                 </td>
//                 <td className="px-2 py-2 text-center border border-gray-300 md:px-4">
//                   <div className="flex justify-center gap-2 md:gap-3">
//                     <button
//                       className="w-6 h-6 cursor-pointer"
//                       onClick={() => {
//                         setEditRole(role);
//                         setEditPrivileges((role.privileges || []).map((p) => p._id));
//                         setEditRolePopup(true);
//                       }}
//                     >
//                       {/* edit icon */}
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24">
//                         <path
//                           d="M5 16.0002L4 20.0002L8 19.0002L19.586 7.41419C19.9609 7.03913 20.1716 6.53051 20.1716 6.00019C20.1716 5.46986 19.9609 4.96124 19.586 4.58619L19.414 4.41419C19.0389 4.03924 18.5303 3.82861 18 3.82861C17.4697 3.82861 16.9611 4.03924 16.586 4.41419L5 16.0002Z"
//                           stroke="#1A68B2"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path d="M5 16L4 20L8 19L18 9L15 6L5 16Z" fill="#1A68B2" />
//                         <path d="M15 6L18 9M13 20H21" stroke="#1A68B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                     </button>
//                     <button className="w-6 h-6 cursor-pointer" onClick={() => handleDeleteRole(role._id)}>
//                       {/* delete icon */}
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24">
//                         <path
//                           d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19Z"
//                           fill="#D90505"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Role Modal */}
//       {showRolePopup && (
//         <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 border-t-4 dark:border-gray-900 dark:border-t-[#1d5998] border-t-[#1d5998] w-[95vw] max-w-[500px] p-4 sm:p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
//             <p className="text-black dark:text-white font-raleway text-xl md:text-[27.44px] font-semibold leading-none mb-6">
//               Add New Role
//             </p>
//             <div className="mb-6 space-y-3">
//               <input
//                 type="text"
//                 placeholder="Role Name"
//                 value={newRole}
//                 onChange={(e) => setNewRole(e.target.value)}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-blue-400"
//               />
//               <div className="mt-4 font-semibold text-gray-700 dark:text-white">Select Privileges:</div>
//               <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//                 {privileges.map((p) => (
//                   <label key={p._id} className="flex items-center gap-2 text-gray-700 dark:text-white">
//                     <input
//                       type="checkbox"
//                       checked={selectedPrivileges.includes(p._id)}
//                       onChange={() =>
//                         setSelectedPrivileges((prev) =>
//                           prev.includes(p._id) ? prev.filter((id) => id !== p._id) : [...prev, p._id]
//                         )
//                       }
//                     />
//                     {p.name}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
//               <button onClick={handleAddRole} className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600">
//                 Save
//               </button>
//               <button
//                 onClick={() => {
//                   setShowRolePopup(false);
//                   setNewRole("");
//                   setSelectedPrivileges([]);
//                 }}
//                 className="px-4 py-2 font-medium text-white bg-gray-500 rounded-md cursor-pointer hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Role Modal */}
//       {editRolePopup && (
//         <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 border-t-4 dark:border-gray-900 dark:border-t-[#1d5998] border-t-[#1d5998] w-[95vw] max-w-[500px] p-4 sm:p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
//             <p className="text-black dark:text-white font-raleway text-xl md:text-[27.44px] font-semibold leading-none mb-6">
//               Edit Role: {editRole?.name}
//             </p>

//             <div className="mb-6 space-y-3">
//               <div className="font-semibold text-gray-700 dark:text-white">Update Privileges:</div>
//               <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//                 {privileges.map((p) => (
//                   <label key={p._id} className="flex items-center gap-2 text-gray-700 dark:text-white">
//                     <input
//                       type="checkbox"
//                       checked={editPrivileges.includes(p._id)}
//                       onChange={() =>
//                         setEditPrivileges((prev) =>
//                           prev.includes(p._id) ? prev.filter((id) => id !== p._id) : [...prev, p._id]
//                         )
//                       }
//                     />
//                     {p.name}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
//               <button onClick={handleUpdateRole} className="px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600">
//                 Save
//               </button>
//               <button
//                 onClick={() => setEditRolePopup(false)}
//                 className="px-4 py-2 text-white bg-gray-500 rounded-md cursor-pointer hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import config from "../../../config";
import { toast } from "react-toastify";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [token, setToken] = useState(null);

  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [editRolePopup, setEditRolePopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editPrivileges, setEditPrivileges] = useState([]);

  const baseUrl = `${config.BASE_URL}`;

  // ---- read token on mount ----
  useEffect(() => {
    const t = localStorage.getItem("authToken");
    setToken(t);
  }, [baseUrl]);
  

  // ---- search helper (declare BEFORE the effect using it) ----
  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      const filtered = roles.filter((role) => {
        const privilegesString = Array.isArray(role.privileges)
          ? role.privileges.map((p) => p.name).join(" ")
          : "";
        return `${role.name} ${privilegesString}`
          .toLowerCase()
          .includes(term.toLowerCase());
      });
      setFilteredRoles(filtered);
    },
    [roles]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [roles, searchTerm, handleSearch]);

  // ---- helpers ----
  const enrichRoles = useCallback((rawRoles, allPrivileges) => {
    const byId = new Map(allPrivileges.map((p) => [p._id, p]));
    return (rawRoles || []).map((role) => ({
      ...role,
      privileges: (role.privelleges || role.privileges || [])
        .map((id) => byId.get(id))
        .filter(Boolean),
    }));
  }, []);

  const loadAll = useCallback(async () => {
    if (!token) return;
    try {
      const [privRes, rolesRes] = await Promise.all([
        axios.get(`${baseUrl}/privelleges/allprivelleges`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseUrl}/roles/allrole`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allPrivileges = privRes.data || [];
      const rawRoles = rolesRes.data?.data || rolesRes.data || [];
      const enriched = enrichRoles(rawRoles, allPrivileges);

      setPrivileges(allPrivileges);
      setRoles(enriched);
      setFilteredRoles(enriched);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load roles/privileges!");
    }
  }, [baseUrl, token, enrichRoles]);

  const refreshRoles = useCallback(async () => {
    if (!token) return;
    try {
      const rolesRes = await axios.get(`${baseUrl}/roles/allrole`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawRoles = rolesRes.data?.data || rolesRes.data || [];
      const enriched = enrichRoles(rawRoles, privileges);
      setRoles(enriched);
      setFilteredRoles(enriched);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to refresh roles!");
    }
  }, [baseUrl, token, privileges, enrichRoles]);

  useEffect(() => {
    if (token) loadAll();
  }, [token, loadAll]);

  // ---- actions ----
  const handleAddRole = async () => {
    if (!newRole.trim()) {
      toast.error("Please enter a role name.");
      return;
    }
    try {
      // 1) create role
      const res = await axios.post(
        `${baseUrl}/roles/addrole`,
        { name: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdRole = res.data?.role || res.data?.data;

      // 2) assign privileges (IDs)
      if (createdRole && selectedPrivileges.length > 0) {
        await axios.put(
          `${baseUrl}/roles/${createdRole._id}/privelleges`,
          { privellegeNames: selectedPrivileges },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success("Role created and privileges assigned!");
      setNewRole("");
      setSelectedPrivileges([]);
      setShowRolePopup(false);
      await refreshRoles();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add role or assign privileges!");
    }
  };

  const handleUpdateRole = async () => {
    if (!editRole) {
      toast.error("No role selected to update.");
      return;
    }
    if (editPrivileges.length === 0) {
      toast.error("Please select at least one privilege.");
      return;
    }
    try {
      await axios.put(
        `${baseUrl}/roles/${editRole._id}/privelleges`,
        { privellegeNames: editPrivileges },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Privileges updated successfully!");
      setEditRolePopup(false);
      await refreshRoles();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update privileges!");
    }
  };

  const handleDeleteRole = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="mb-2 font-semibold">Are you sure you want to delete?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${baseUrl}/roles/deleterole/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  toast.success("Role has been removed.");
                  await refreshRoles();
                } catch (error) {
                  toast.error(error?.response?.data?.message || "Failed to delete role!");
                } finally {
                  closeToast();
                }
              }}
              className="bg-[#F7D035] cursor-pointer hover:bg-[#e0c12a] text-black text-sm px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="bg-[#323234] cursor-pointer hover:bg-[#242527] text-white text-sm px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        position: "top-right",
        toastClassName: "center-toast",
        bodyClassName: "center-toast-body",
      }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={() => setShowRolePopup(true)}
          className="bg-[#F7D035] cursor-pointer text-black px-4 py-2 rounded-md hover:bg-[#e0c12a]"
        >
          + Add Role
        </button>
      </div>

      <div className="flex flex-col justify-end gap-2 mb-4 sm:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search roles..."
          className="px-3 py-2 rounded-md border border-[#323234] text-[#323234] dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F7D035] w-full sm:w-64 bg-[rgba(50,50,52,0.17)]"
        />
      </div>

      <div className="overflow-x-auto bg-white border border-gray-300 rounded-md dark:bg-gray-900">
        <table className="min-w-[600px] w-full text-xs md:text-sm text-[#323234] dark:text-white">
          <thead className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white dark:text-white font-semibold font-raleway text-[13px] md:text-[15.34px] leading-[125%] h-[40px] md:h-[45px] border-l border-l-[rgba(26,104,178,0.32)] border-r border-r-[rgba(26,104,178,0.32)]">
            <tr>
              <th className="px-2 py-2 text-left md:px-4 md:py-3 whitespace-nowrap">#</th>
              <th className="px-2 py-2 text-left md:px-4 md:py-3 whitespace-nowrap">Role</th>
              <th className="px-2 py-2 text-left md:px-4 md:py-3 whitespace-nowrap">Privileges</th>
              <th className="px-2 py-2 text-center md:px-4 md:py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#323234]">
            {filteredRoles.map((role, i) => (
              <tr
                key={role._id}
                className=" hover:bg-[rgba(50,50,52,0.32)] dark:hover:bg-[rgba(50,50,52,0.32)] text-black dark:text-white transition duration-150 ease-in-out h-[40px] md:h-[45px]"
              >
                <td className="px-2 py-2 border border-gray-400 md:px-4">{i + 1}</td>
                <td className="px-2 py-2 border border-gray-400 md:px-4">{role.name}</td>
                <td className="px-2 py-2 border border-gray-400 md:px-4">
                  {(role.privileges || []).map((p) => p.name).join(", ")}
                </td>
                <td className="px-2 py-2 text-center border border-gray-400 md:px-4">
                  <div className="flex justify-center gap-2 md:gap-3">
                    <button
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => {
                        setEditRole(role);
                        setEditPrivileges((role.privileges || []).map((p) => p._id));
                        setEditRolePopup(true);
                      }}
                    >
                      {/* edit icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M5 16.0002L4 20.0002L8 19.0002L19.586 7.41419C19.9609 7.03913 20.1716 6.53051 20.1716 6.00019C20.1716 5.46986 19.9609 4.96124 19.586 4.58619L19.414 4.41419C19.0389 4.03924 18.5303 3.82861 18 3.82861C17.4697 3.82861 16.9611 4.03924 16.586 4.41419L5 16.0002Z"
                          stroke="#F7D035"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M5 16L4 20L8 19L18 9L15 6L5 16Z" fill="#F7D035" />
                        <path d="M15 6L18 9M13 20H21" stroke="#F7D035" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button className="w-6 h-6 cursor-pointer" onClick={() => handleDeleteRole(role._id)}>
                      {/* delete icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19Z"
                          fill="#D90505"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Role Modal */}
      {showRolePopup && (
        <div className="fixed inset-0 bg-[rgba(22,22,24,0.78)] flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-[#161618] rounded-lg shadow-lg border-2 border-[#323234] border-t-4 border-t-[#F7D035] w-[95vw] max-w-[500px] p-4 sm:p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <p className="text-[#323234] dark:text-white font-raleway text-xl md:text-[27.44px] font-semibold leading-none mb-6">
              Add New Role
            </p>
            <div className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Role Name"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-[#323234] bg-[rgba(50,50,52,0.17)] text-[#323234] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7D035]"
              />
              <div className="text-[#323234] dark:text-white font-semibold mt-4">Select Privileges:</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {privileges.map((p) => (
                  <label key={p._id} className="flex items-center gap-2 text-[#323234] dark:text-white">
                    <input
                      type="checkbox"
                      checked={selectedPrivileges.includes(p._id)}
                      onChange={() =>
                        setSelectedPrivileges((prev) =>
                          prev.includes(p._id) ? prev.filter((id) => id !== p._id) : [...prev, p._id]
                        )
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
              <button onClick={handleAddRole} className="bg-[#F7D035] cursor-pointer hover:bg-[#e0c12a] text-black font-medium px-4 py-2 rounded-md">
                Save
              </button>
              <button
                onClick={() => {
                  setShowRolePopup(false);
                  setNewRole("");
                  setSelectedPrivileges([]);
                }}
                className="bg-[#323234] cursor-pointer hover:bg-[#242527] text-white font-medium px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editRolePopup && (
        <div className="fixed inset-0 bg-[rgba(22,22,24,0.78)] flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-[#161618] rounded-lg shadow-lg border-2 border-[#323234] border-t-4 border-t-[#F7D035] w-[95vw] max-w-[500px] p-4 sm:p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <p className="text-[#323234] dark:text-white font-raleway text-xl md:text-[27.44px] font-semibold leading-none mb-6">
              Edit Role: {editRole?.name}
            </p>

            <div className="mb-6 space-y-3">
              <div className="text-[#323234] dark:text-white font-semibold">Update Privileges:</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {privileges.map((p) => (
                  <label key={p._id} className="flex items-center gap-2 text-[#323234] dark:text-white">
                    <input
                      type="checkbox"
                      checked={editPrivileges.includes(p._id)}
                      onChange={() =>
                        setEditPrivileges((prev) =>
                          prev.includes(p._id) ? prev.filter((id) => id !== p._id) : [...prev, p._id]
                        )
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
              <button onClick={handleUpdateRole} className="bg-[#F7D035] cursor-pointer hover:bg-[#e0c12a] text-black px-4 py-2 rounded-md">
                Save
              </button>
              <button
                onClick={() => setEditRolePopup(false)}
                className="bg-[#323234] cursor-pointer hover:bg-[#242527] text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}