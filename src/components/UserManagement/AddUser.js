"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../../config";

export default function AddUser() {
  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const baseUrl = `${config.BASE_URL}`;

  // ✅ fetchRoles defined BEFORE effect
  const fetchRoles = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/roles/allrole`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch roles!");
    }
  }, [baseUrl, token]);

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
  }, []);

  useEffect(() => {
    if (token) fetchRoles();
  }, [token, fetchRoles]);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.roleId) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      await axios.post(`${config.BASE_URL}/users/addUser`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User added successfully!");
      setNewUser({ name: "", email: "", password: "", roleId: "" });
    } catch (err) {
      const message = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join("\n")
        : err.response?.data?.message || "Failed to add user!";
      toast.error(message);
    }
  };

  return (
    <div>
      <p className="text-black dark:text-white font-[Raleway] text-[18.34px] font-semibold leading-[125%] mt-[px] mb-4">
        Add New User
      </p>

      <p className="text-[#7F7F7F] dark:text-white font-[Raleway] text-[15.34px] font-normal leading-[125%] mt-5 mb-5">
        Fill in the user details and assign a role to give them access to the system
      </p>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-[#f2b600]"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-[#f2b600]"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-[#f2b600]"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
            Role
          </label>
          <select
            value={newUser.roleId}
            onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-[#f2b600] dark:bg-[#373739] "
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} 
              value={role._id}
              >
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={handleAddUser}
          className="flex cursor-pointer w-full py-3 justify-center items-center gap-[10px] shrink-0 rounded-[6px] font-[Raleway] bg-[#f2b600] text-white"
        >
          Add User
        </button>
      </div>
    </div>
  );
}
