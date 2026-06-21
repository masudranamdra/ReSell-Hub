'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { Users, Search, Loader2, ShieldAlert, Trash2, CheckCircle, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const { token, user: currentUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token, search]);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    const nextStatus = user.status === 'blocked' ? 'active' : 'blocked';
    setUpdatingId(user._id);

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`User successfully ${nextStatus === 'blocked' ? 'blocked' : 'unblocked'}`);
        setUsers(users.map((u) => u._id === user._id ? { ...u, status: nextStatus } : u));
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('Network error modifying user status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId, nextRole) => {
    setUpdatingId(userId);

    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: nextRole })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`User role set to ${nextRole}`);
        setUsers(users.map((u) => u._id === userId ? { ...u, role: nextRole } : u));
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('Network error changing role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user account? This deletes their listing references too.')) return;

    setUpdatingId(userId);
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        toast.success('User account deleted');
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        toast.error(data.message || 'Deletion failed');
      }
    } catch (err) {
      toast.error('Network error during deletion');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleVerification = async (user) => {
    const nextVerify = !user.verified;
    setUpdatingId(user._id);

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ verified: nextVerify })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Seller verification: ${nextVerify ? 'Verified' : 'Revoked'}`);
        setUsers(users.map((u) => u._id === user._id ? { ...u, verified: nextVerify } : u));
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('Network error updating verification');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 skeleton-shimmer"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl skeleton-shimmer"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in transition-colors duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Manage Users</h2>
        <p className="text-xs text-gray-500">Edit roles, block offenders, and verify trusted marketplace sellers</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
          placeholder="Search users by name or email address..."
        />
      </div>

      {/* Users table */}
      {users.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Seller Badge</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((u) => {
                  const isSelf = u._id === currentUser.id;

                  return (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-850/40 transition">
                      <td className="p-4">
                        <div className="flex gap-3 items-center">
                          <img
                            src={u.photo}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                          />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {u.name} {isSelf && <span className="text-[10px] text-gray-400">(You)</span>}
                            </p>
                            <span className="text-[10px] text-gray-500">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          disabled={isSelf || updatingId === u._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold outline-none focus:ring-1"
                        >
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                          u.status === 'active' ? 'bg-success-50 text-success-600 dark:bg-success-950/20' : 'bg-danger-50 text-danger-500 dark:bg-danger-950/20'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.role === 'seller' ? (
                          <button
                            onClick={() => handleToggleVerification(u)}
                            disabled={updatingId === u._id}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition ${
                              u.verified
                                ? 'bg-success-50 text-success-600 hover:bg-success-100 dark:bg-success-950/20'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            {u.verified ? 'Verified' : 'Verify Seller'}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleBlock(u)}
                            disabled={isSelf || updatingId === u._id}
                            className={`p-1.5 rounded-lg border transition ${
                              u.status === 'blocked'
                                ? 'border-success-200 text-success-600 hover:bg-success-500 hover:text-white'
                                : 'border-amber-200 text-amber-600 hover:bg-amber-500 hover:text-white'
                            }`}
                            title={u.status === 'blocked' ? 'Unblock User' : 'Block User'}
                          >
                            <ShieldAlert size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            disabled={isSelf || updatingId === u._id}
                            className="p-1.5 border border-danger-200 text-danger-500 hover:bg-danger-500 hover:text-white disabled:opacity-50 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
          <Users className="mx-auto text-gray-400" size={32} />
          <h3 className="font-bold text-gray-900 dark:text-white text-base">No Users Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
