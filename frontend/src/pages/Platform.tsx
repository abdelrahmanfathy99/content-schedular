import React, { useEffect, useState } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';
import { getPlatformStats, platformStats } from '../services/postService';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';


const Platform = () => {
  const [stats, setStats] = useState<platformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getPlatformStats(token);
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <p>Loading Platform...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaFacebook className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Facebook</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.facebook ?? 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaTwitter className="w-6 h-6 text-sky-400" />
            <h2 className="text-lg font-semibold text-gray-800">Twitter</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.twitter ?? 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaLinkedin className="w-6 h-6 text-blue-700" />
            <h2 className="text-lg font-semibold text-gray-800">Linkedin</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.linkedin ?? 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaInstagram className="w-6 h-6 text-pink-500" />
            <h2 className="text-lg font-semibold text-gray-800">Instagram</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.instagram ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Platform;
