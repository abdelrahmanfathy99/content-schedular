import React, { useEffect, useState } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';
import { getDashboardStats, DashboardStats } from '../services/postService';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">Total Posts</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.total ?? 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-teal-500" />
            <h2 className="text-lg font-semibold text-gray-800">Success Rate</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{(stats?.success_rate ?? 0).toFixed(2)}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-800">This Month</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.current_month_count ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800">Draft</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.draft ?? 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-teal-500" />
            <h2 className="text-lg font-semibold text-gray-800">Published</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.published ?? 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-800">Scheduled</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.scheduled ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
