"use client";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedPremium, setSelectedPremium] = useState("all");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState({ role: "", isPremium: false });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin?type=users");
      const json = await res.json();
      setUsers(json.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle premium
  const togglePremium = async (user: any) => {
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "togglePremium",
          data: { id: user._id }
        })
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle premium:", error);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesPremium = selectedPremium === "all" || 
                          (selectedPremium === "premium" && user.isPremium) ||
                          (selectedPremium === "regular" && !user.isPremium);
    
    return matchesSearch && matchesRole && matchesPremium;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">
              Total: <span className="font-semibold text-blue-600">{filteredUsers.length}</span> users
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={selectedPremium}
            onChange={(e) => setSelectedPremium(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="all">All Users</option>
            <option value="premium">Premium Only</option>
            <option value="regular">Regular Only</option>
          </select>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Active Users: {users.filter(u => !u.isSuspended).length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-6 font-semibold text-gray-700">User</th>
                  <th className="text-left p-6 font-semibold text-gray-700">Role</th>
                  <th className="text-left p-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-blue-600">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.email}
                          </p>
                          {user.name && (
                            <p className="text-sm text-gray-500">{user.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.isPremium 
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isPremium ? (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.266a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                              </svg>
                              Premium
                            </div>
                          ) : "Regular"}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          user.isSuspended ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                      </div>
                    </td>
                    
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePremium(user)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            user.isPremium
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                          }`}
                        >
                          {user.isPremium ? "Remove Premium" : "Make Premium"}
                        </button>
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination (static for now) */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800">Premium Users</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {users.filter(u => u.isPremium).length}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.266a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800">Regular Users</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {users.filter(u => !u.isPremium).length}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10 10 0 01-13.67 0" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800">Admin Users</p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}