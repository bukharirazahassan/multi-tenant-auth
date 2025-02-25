import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Users, Settings, LineChart, Home } from "lucide-react";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 3000 },
  { name: "May", sales: 4000 },
  { name: "Jun", sales: 1000 },
  { name: "Jul", sales: 2500 },
  { name: "Aug", sales: 4500 },
  { name: "Sep", sales: 5000 },
  { name: "Oct", sales: 2200 },
  { name: "Nov", sales: 2400 },
  { name: "Dec", sales: 4500 }
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please log in.");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          setError(data.error);
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (error) {
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-50 border-r-2 border-gray-300 p-4 h-screen space-y-4 shadow-lg">
        <div className="text-lg font-semibold py-3 border-b border-gray-300 hover:bg-blue-100 transition-transform transform hover:scale-105 cursor-pointer flex items-center">
          <Home size={20} className="mr-2 text-blue-500" />
          Dashboard
        </div>
        <div className="text-lg font-semibold py-3 border-b border-gray-300 hover:bg-blue-100 transition-transform transform hover:scale-105 cursor-pointer flex items-center">
          <Users size={20} className="mr-2 text-blue-500" />
          Users
        </div>
        <div className="text-lg font-semibold py-3 border-b border-gray-300 hover:bg-blue-100 transition-transform transform hover:scale-105 cursor-pointer flex items-center">
          <LineChart size={20} className="mr-2 text-green-500" />
          Sales
        </div>
        <div className="text-lg font-semibold py-3 border-b border-gray-300 hover:bg-blue-100 transition-transform transform hover:scale-105 cursor-pointer flex items-center">
          <Settings size={20} className="mr-2 text-purple-500" />
          Settings
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/financial.jpg')" }}></div>

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-white opacity-40"></div>

        {/* Content Inside Overlay */}
        <div className="relative z-10">
          {/* Top Frame */}
          <div className="bg-gray-800 text-white flex items-center justify-between p-4 shadow-md">
            <h1 className="text-2xl font-bold">Inventory Management System</h1>
            <img src="/logo.jpeg" alt="Logo" className="h-10" />
          </div>

          {/* Dashboard Content */}
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Welcome, {user ? user.email : "Loading..."}!</h2>
            <h2 className="text-xl font-bold">Tenant ID: {user ? user.tenantId : "Loading..."}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg">
                <CardContent className="flex items-center justify-between p-4">
                  <Users size={32} className="text-blue-500" />
                  <div>
                    <h2 className="text-xl font-bold">Users</h2>
                    <p className="text-gray-500">1,234</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg">
                <CardContent className="flex items-center justify-between p-4">
                  <LineChart size={32} className="text-green-500" />
                  <div>
                    <h2 className="text-xl font-bold">Sales</h2>
                    <p className="text-gray-500">$12,345</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white bg-opacity-10 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg">
                <CardContent className="flex items-center justify-between p-4">
                  <Settings size={32} className="text-purple-500" />
                  <Button variant="outline" disabled>Manage</Button>
                </CardContent>
              </Card>
            </div>

            {/* Sales View */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Sales Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={{ stroke: '#d3d3d3' }} />
                  <YAxis axisLine={{ stroke: '#d3d3d3' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="url(#gradient)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Gradient Definition for Bar */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#4F46E5", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#6EE7B7", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
