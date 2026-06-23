'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API_URL } from '../../../components/Providers';
import { Users, Search, Loader2, ShieldAlert, Trash2, CheckCircle, ShieldOff, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const { token, user: currentUser } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'applications'
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (token) {
      loadUsers();
      loadApplications();
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

  const loadApplications = async () => {
    setAppsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/seller-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setApplications(data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleModerateApplication = async (userId, status) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`${API_URL}/api/users/seller-applications/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Seller application ${status === 'approved' ? 'approved (user promoted to Seller)' : 'rejected'}`);
        setApplications(applications.filter((app) => app._id !== userId));
        loadUsers(); // refresh the users list
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('Network error during application moderation');
    } finally {
      setUpdatingId(null);
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
        <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">Admin Users Portal</h2>
        <p className="text-xs text-gray-500">Moderate seller requests, change user roles, and enforce moderation safety bounds</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 pb-px">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'users'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 font-extrabold'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          User Accounts
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
            activeTab === 'applications'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 font-extrabold'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          Seller Applications
          {applications.length > 0 && (
            <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 text-white rounded-full font-bold">
              {applications.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'applications' ? (
        appsLoading && applications.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : applications.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Requested Status</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-850/40 transition">
                      <td className="p-4 flex gap-3 items-center">
                        <img
                          src={app.photo || 'https://i.pravatar.cc/300?img=default'}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <span className="font-bold text-gray-900 dark:text-white">{app.name}</span>
                      </td>
                      <td className="p-4 text-gray-500">{app.email}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-250 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-full uppercase">
                          Pending
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(app.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleModerateApplication(app._id, 'approved')}
                            disabled={updatingId === app._id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-success-600 hover:bg-success-700 disabled:opacity-50 text-white text-[10px] font-bold rounded-xl shadow-sm transition"
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            onClick={() => handleModerateApplication(app._id, 'rejected')}
                            disabled={updatingId === app._id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-danger-600 hover:bg-danger-700 disabled:opacity-50 text-white text-[10px] font-bold rounded-xl shadow-sm transition"
                          >
                            <X size={12} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl">
            <CheckCircle className="mx-auto text-success-500" size={32} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">All Clear!</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              No pending seller applications to audit right now.
            </p>
          </div>
        )
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
