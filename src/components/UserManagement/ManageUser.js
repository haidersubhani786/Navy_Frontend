"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import config from "../../../config";
import { toast } from "react-toastify";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(null);
  const [editUserPopup, setEditUserPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [editUserData, setEditUserData] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
  });

  const baseUrl = `${config.BASE_URL}`;

  useEffect(() => {
    const t = localStorage.getItem("authToken");
    setToken(t);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/users/allUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("[ManageUser] fetchUsers error", err);
      toast.error(err.response?.data?.message || "Failed to fetch users!");
    }
  }, [baseUrl, token]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/roles/allrole`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data?.data || []);
    } catch (err) {
      console.error("[ManageUser] fetchRoles error", err);
      toast.error(err.response?.data?.message || "Failed to fetch roles!");
    }
  }, [baseUrl, token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRoles();
    }
  }, [token, fetchUsers, fetchRoles]);

  const handleSort = useCallback(
    (key, directionOverride = null, userList) => {
      let direction = directionOverride || "asc";
      if (
        !directionOverride &&
        sortConfig.key === key &&
        sortConfig.direction === "asc"
      ) {
        direction = "desc";
      }

      setSortConfig({ key, direction });

      const list = userList ?? filteredUsers;
      const sorted = [...(list || [])].sort((a, b) => {
        let valA = a[key] ?? "";
        let valB = b[key] ?? "";

        if (typeof valA === "object" && valA !== null) valA = valA.name;
        if (typeof valB === "object" && valB !== null) valB = valB.name;

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });

      setFilteredUsers(sorted);
    },
    [filteredUsers, sortConfig.key, sortConfig.direction]
  );

  const handleSearch = useCallback(
    (term) => {
      const filtered = users.filter((user) =>
        `${user.name ?? ""} ${user.email ?? ""} ${user.role?.name ?? ""}`
          .toLowerCase()
          .includes((term || "").toLowerCase())
      );
      setFilteredUsers(filtered);
      handleSort(sortConfig.key, sortConfig.direction, filtered);
    },
    [users, sortConfig.key, sortConfig.direction, handleSort]
  );

  // Drive search whenever users or searchTerm changes
  useEffect(() => {
    handleSearch(searchTerm);
  }, [users, searchTerm, handleSearch]);

  const handleDeleteUser = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="mb-2 font-semibold">Are you sure you want to delete?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${baseUrl}/users/delete/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  toast.success("User has been removed successfully.");
                  fetchUsers();
                } catch (error) {
                  toast.error(
                    error.response?.data?.message || "Failed to delete user!"
                  );
                } finally {
                  closeToast();
                }
              }}
              className="bg-[#1f5897] cursor-pointer hover:bg-[#90abcaff] text-white text-sm px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm text-white bg-gray-400 rounded cursor-pointer hover:bg-gray-500"
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

  const handleUpdateUser = async () => {
    try {
      await axios.patch(
        `${baseUrl}/users/update/${editUserData._id}`,
        {
          name: editUserData.name,
          email: editUserData.email,
          role: editUserData.role,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User updated successfully!");
      setEditUserPopup(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user!");
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaSortUp className="inline-block ml-1 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline-block ml-1 text-[#F7D035]" />
    ) : (
      <FaSortDown className="inline-block ml-1 text-[#F7D035]" />
    );
  };

  return (
    <div>
      {/* Search Input */}
      <div className="flex flex-col items-stretch justify-end gap-2 mb-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-500 rounded-md shadow-sm dark:text-white focus:outline-[#FFDF00] sm:w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-300 rounded-md dark:bg-gray-900">
        <table className="min-w-[600px] w-full text-xs md:text-sm text-gray-800 dark:text-white">
          <thead className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white dark:text-white font-semibold font-raleway text-[13px] md:text-[15.34px] leading-[125%] h-[40px] md:h-[45px] border-l border-l-[rgba(26,104,178,0.32)] border-r border-r-[rgba(26,104,178,0.32)]">
            <tr>
              <th className="px-2 py-2 text-left md:px-4 md:py-3 whitespace-nowrap">
                Sr No
              </th>
              <th
                className="px-2 py-2 text-left cursor-pointer select-none md:px-4 md:py-3 whitespace-nowrap"
                onClick={() => handleSort("name", null, filteredUsers)}
              >
                User Name  
              </th>
              <th
                className="px-2 py-2 text-left cursor-pointer select-none md:px-4 md:py-3 whitespace-nowrap"
                onClick={() => handleSort("email", null, filteredUsers)}
              >
                User Email
              </th>
              <th
                className="px-2 py-2 text-left cursor-pointer select-none md:px-4 md:py-3 whitespace-nowrap"
                onClick={() => handleSort("role", null, filteredUsers)}
              >
                User Role 
              </th>
              <th className="px-2 py-2 text-center md:px-4 md:py-3 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#323234]">
            {filteredUsers.map((user, i) => (
              <tr
                key={user._id}
                className="hover:bg-blue-50 dark:text-white dark:hover:bg-[#2A2A2A] transition duration-150 ease-in-out h-[40px] md:h-[45px]"
              >
                <td className="px-2 py-2 font-bold border border-gray-300 md:px-4">
                  {i + 1}
                </td>
                <td className="px-2 py-2 border border-gray-300 md:px-4">
                  {user.name}
                </td>
                <td className="px-2 py-2 border border-gray-300 md:px-4">
                  {user.email}
                </td>
                <td className="px-2 py-2 border border-gray-300 md:px-4">
                  {user.role?.name || "N/A"}
                </td>
                <td className="px-2 py-2 text-center border border-gray-300 md:px-4">
                  <div className="flex justify-center gap-2 md:gap-3">
                    {/* Edit */}
                    <button
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => {
                        setEditUserData({
                          _id: user._id,
                          name: user.name,
                          email: user.email,
                          role: user.role?._id || "",
                        });
                        setEditUserPopup(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 16.0002L4 20.0002L8 19.0002L19.586 7.41419C19.9609 7.03913 20.1716 6.53051 20.1716 6.00019C20.1716 5.46986 19.9609 4.96124 19.586 4.58619L19.414 4.41419C19.0389 4.03924 18.5303 3.82861 18 3.82861C17.4697 3.82861 16.9611 4.03924 16.586 4.41419L5 16.0002Z"
                          stroke="#FFDF00"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M5 16L4 20L8 19L18 9L15 6L5 16Z" fill="#FFDF00" />
                        <path
                          d="M15 6L18 9M13 20H21"
                          stroke="#FFDF00"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {/* Delete */}
                    <button
                      className="w-6 h-6"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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

      {/* Edit Modal */}
      {editUserPopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#323234] rounded-lg shadow-lg border-2 border-gray-300 border-t-4 dark:border-gray-600 dark:border-t-[#FFDF00] border-t-[#FFDF00] w-[95vw] max-w-[400px] p-4 sm:p-6 animate-fadeIn">
            <h2 className="mb-4 text-lg font-bold text-gray-800 md:text-xl dark:text-white">
              Edit User
            </h2>

            <div className="mb-6 space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  value={editUserData.name}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFDF00] dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFDF00] dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                  Role
                </label>
                <select
                  value={editUserData.role}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 dark:bg-[#4f4f50] focus:ring-[#FFDF00] dark:text-white"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 font-medium text-black transition-all bg-[#dcc545] rounded-md cursor-pointer hover:bg-[#FFDF00]"
              >
                Save
              </button>
              <button
                onClick={() => setEditUserPopup(false)}
                className="px-4 py-2 font-medium text-white transition-all bg-gray-500 rounded-md cursor-pointer hover:bg-gray-600"
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
