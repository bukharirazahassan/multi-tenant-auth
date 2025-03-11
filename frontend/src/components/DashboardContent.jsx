import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Users, Settings, LineChart } from "lucide-react";

const salesData = [
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
  { name: "Dec", sales: 4500 },
];

const stockData = [
  { name: "AAPL", price: "$150.00", change: "+2.5%" },
  { name: "GOOGL", price: "$2800.00", change: "-1.2%" },
  { name: "TSLA", price: "$850.00", change: "+4.1%" },
  { name: "AMZN", price: "$3400.00", change: "-0.8%" },
  { name: "MSFT", price: "$299.00", change: "+1.9%" },
];

export default function DashboardContent({ user }) {
  return (
    <div className="p-6 space-y-6 h-screen flex flex-col">
     
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Users", count: "1,234", icon: <Users size={32} className="text-blue-500" /> },
          { title: "Sales", count: "$12,345", icon: <LineChart size={32} className="text-green-500" /> },
          { title: "Settings", count: "Manage", icon: <Settings size={32} className="text-purple-500" /> },
        ].map((item, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-lg border border-gray-300 rounded-xl shadow-md transition hover:shadow-lg hover:scale-105">
            <CardContent className="flex items-center justify-between p-6">
              {item.icon}
              <div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                {item.title === "Settings" ? (
                  <Button variant="outline" disabled>{item.count}</Button>
                ) : (
                  <p className="text-gray-700 text-lg">{item.count}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Overview & Stocks Frame */}
      <div className="flex flex-grow space-x-6">
        
        {/* Sales Overview (75% Width) */}
        <div className="w-3/4 bg-white/10 backdrop-blur-lg border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Sales Overview</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" axisLine={{ stroke: '#d3d3d3' }} tick={{ fill: "#555" }} />
              <YAxis axisLine={{ stroke: '#d3d3d3' }} tick={{ fill: "#555" }} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "none", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="sales" fill="url(#gradient)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stocks Frame (25% Width) */}
        <div className="w-1/4 bg-white/10 backdrop-blur-lg border border-gray-300 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Stocks</h2>
          <ul className="space-y-4">
            {stockData.map((stock, index) => (
              <li key={index} className="flex justify-between items-center bg-white/20 p-4 rounded-lg shadow-md">
                <div>
                  <h3 className="text-lg font-semibold">{stock.name}</h3>
                  <p className="text-gray-700">{stock.price}</p>
                </div>
                <p className={`text-lg font-bold ${stock.change.includes('+') ? "text-green-500" : "text-red-500"}`}>
                  {stock.change}
                </p>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Gradient Definition for Bar Chart */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#6366F1", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#22C55E", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
