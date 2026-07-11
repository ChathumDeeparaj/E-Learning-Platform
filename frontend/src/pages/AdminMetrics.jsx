import { useState, useEffect } from 'react';
import api from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const AdminMetrics = () => {
  const [adminKey, setAdminKey] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.get('/admin/metrics', {
        headers: { 'x-admin-key': adminKey }
      });
      setMetrics(data);
      toast.success('Metrics loaded');
    } catch (err) {
      toast.error('Invalid Admin Key or failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard - Metrics</h1>
      
      {!metrics ? (
        <form onSubmit={fetchMetrics} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-md">
          <h2 className="text-xl font-bold mb-4">Enter Admin Key</h2>
          <input 
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
            placeholder="Admin Key"
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Authenticating...' : 'View Metrics'}
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-end">
            <button onClick={() => fetchMetrics()} className="text-blue-600 hover:underline">Refresh Metrics</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1">Total Requests</div>
              <div className="text-3xl font-bold text-gray-900">{metrics.totalRequests}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1">Total Errors</div>
              <div className="text-3xl font-bold text-red-600">{metrics.totalErrors}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1">Avg Response Time</div>
              <div className="text-3xl font-bold text-blue-600">{metrics.averageResponseTime}ms</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1">Active Users (15m)</div>
              <div className="text-3xl font-bold text-green-600">{metrics.activeUsers}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Response Time History (ms)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
                    minTickGap={30}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                    formatter={(value) => [`${value}ms`, 'Duration']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="duration" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMetrics;
