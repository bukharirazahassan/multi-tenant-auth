import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardContent from "../components/DashboardContent";
import UserList from "../components/UserList";
import SupportTicketList from "../components/SupportTicketList";

import {
  Users,
  LifeBuoy,
  FileText,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { FileSearch, Clock } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      setError("Unauthorized. Redirecting...");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Unauthorized access");
        }

        const data = await response.json();
        setUser({ ...data.user, role });
      } catch (err) {
        setError(err.message || "Failed to load data. Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const tabClass = (tab) =>
    `text-lg font-medium py-3 border-b border-gray-300 transition-colors cursor-pointer flex items-center px-3 rounded-md ${
      activeTab === tab
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "hover:bg-blue-100 hover:text-blue-700"
    }`;

  if (error) {
    return (
      <div className="text-red-500 text-center mt-5 font-serif">{error}</div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-50 border-r-2 border-gray-300 p-4 h-screen space-y-4 shadow-lg">
        <div
          className={tabClass("dashboard")}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard size={20} className="mr-2" />
          Dashboard
        </div>

        {user?.role !== "user" && (
          <div
            className={tabClass("users")}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} className="mr-2" />
            Users
          </div>
        )}

        <div
          className={tabClass("tickets")}
          onClick={() => setActiveTab("tickets")}
        >
          <LifeBuoy size={20} className="mr-4" />
          Support Tickets
        </div>

        {/* Reports menu item */}
        <div
          className={tabClass("reports")}
          onClick={() => setIsReportsOpen((prev) => !prev)}
        >
          <FileText size={20} className="mr-2" />
          Reports
        </div>

        {/* Sub-report menu items */}
        {isReportsOpen && (
          <div className="ml-8 space-y-1">
            <div
              className={`${tabClass(
                "report1"
              )} flex items-center text-sm py-2 px-3 rounded-md`}
              onClick={() => setActiveTab("report1")}
            >
              <FileSearch size={16} className="mr-2" />
              Ticket Details
            </div>
            <div
              className={`${tabClass(
                "report2"
              )} flex items-center text-sm py-2 px-3 rounded-md`}
              onClick={() => setActiveTab("report2")}
            >
              <Clock size={16} className="mr-2" />
              Timeline Report
            </div>
          </div>
        )}

        <div
          className="mt-10 text-lg font-medium py-3 border-t border-gray-300 cursor-pointer flex items-center px-3 text-red-600 hover:bg-red-100 rounded-md"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/financial.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-white opacity-40"></div>

        <div className="relative z-10">
          <div className="bg-gray-800 text-white flex items-center justify-between p-4 shadow-md h-20">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold font-serif mr-4">
                Welcome, {user?.fullName}
              </h1>
              {user && (
                <span className="font-serif">Tenant ID: {user.tenantId}</span>
              )}
            </div>
            <img src="/logo.jpeg" alt="Logo" className="h-10" />
          </div>

          {activeTab === "dashboard" && <DashboardContent user={user} />}
          {activeTab === "users" && <UserList />}
          {activeTab === "tickets" && <SupportTicketList />}
          {activeTab === "report1" && <SupportTicketList />}
          {activeTab === "report2" && (
            <div className="p-4">Report 2 Content</div>
          )}
        </div>
      </div>
    </div>
  );
}
