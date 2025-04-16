import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import SettingModal from "../components/SettingModal";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Settings,
  LineChart,
  CheckCircle,
  Hourglass,
  ClipboardList,
  XCircle,
  PauseCircle,
  MailOpen,
} from "lucide-react";

export default function DashboardContent({ user }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState([]);
  const [priorityCounts, setPriorityCounts] = useState([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketOverviewTitle, setTicketOverviewTitle] =
    useState("Tickets Overview");
  const [key, setKey] = useState(0); // State for forcing re-render
  const location = useLocation(); // Get location
  const [externalUserCount, setExternalUserCount] = useState(0);
  const [ticketStatusCounts, setTicketStatusCounts] = useState({
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    on_hold: 0,
    assigned: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // or sessionStorage.getItem('token')

    axios
      .get("http://localhost:5000/api/fetch-tickets/ticket-status-counts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.statusCounts) {
          setTicketStatusCounts(res.data.statusCounts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch ticket status counts:", err);
      });

    // Fetch external user count
    axios
      .get("http://localhost:5000/api/fetch-tickets/external-users-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success && res.data.totalExternalUsers) {
          setExternalUserCount(res.data.totalExternalUsers);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch external users count:", err);
      });
  }, []);

  useEffect(() => {
    console.log("Dashboard reloading...");
    setKey((prevKey) => prevKey + 1);
  }, [location]); // Re-render on route change

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        // Fetch monthly summary first
        const summaryResponse = await axios.get(
          "http://localhost:5000/api/monthly-summary/select-option",
          { headers }
        );

        const fetchPromises = [
          axios.get("http://localhost:5000/api/role-count", { headers }),
          axios.get(
            "http://localhost:5000/api/fetch-tickets/ticket-pichart-counts",
            { headers }
          ),
          axios.get("http://localhost:5000/api/fetch-tickets/ticket-counts", {
            headers,
          }),
        ];

        // If "id" is 1, add tickets API call
        if (
          summaryResponse.data.success &&
          summaryResponse.data.data.id === 1
        ) {
          fetchPromises.push(
            axios.get("http://localhost:5000/api/tickets/line-chart-counts", {
              headers,
            })
          );
          setTicketOverviewTitle("Daily Tickets Overview");
        }
        if (
          summaryResponse.data.success &&
          summaryResponse.data.data.id === 2
        ) {
          fetchPromises.push(
            axios.get("http://localhost:5000/api/weekly-chart/weekly-summary", {
              headers,
            })
          );
          setTicketOverviewTitle("Weekly Tickets Overview");
        }
        if (
          summaryResponse.data.success &&
          summaryResponse.data.data.id === 3
        ) {
          fetchPromises.push(
            axios.get(
              "http://localhost:5000/api/monthly-chart/monthly-summary",
              { headers }
            )
          );
          setTicketOverviewTitle("Monthly Tickets Overview");
        }

        const [
          rolesResponse,
          priorityResponse,
          ticketCountResponse,
          ticketsResponse,
        ] = await Promise.all(fetchPromises);

        // Set role counts
        setRoles(
          Array.isArray(rolesResponse.data.roleCounts)
            ? rolesResponse.data.roleCounts
            : []
        );

        // Set ticket data for the chart if it was fetched
        if (
          summaryResponse.data.success &&
          summaryResponse.data.data.id === 1
        ) {
          if (ticketsResponse && ticketsResponse.data.success) {
            setTicketData(
              ticketsResponse.data.ticketCounts.map((item) => ({
                name: item.ticket_date,
                tickets: item.total_tickets,
              }))
            );
          }
        }

        if (
          summaryResponse.data.success &&
          summaryResponse.data.data.id === 2
        ) {
          if (ticketsResponse && ticketsResponse.data.success) {
            setTicketData(
              ticketsResponse.data.weeklySummary.map((item) => ({
                name: item.week_start_date,
                tickets: item.total_tickets,
              }))
            );
          }
        }

        if (
          summaryResponse.data.success &&
          summaryResponse.data.data.id === 3
        ) {
          if (ticketsResponse && ticketsResponse.data.success) {
            setTicketData(
              ticketsResponse.data.monthlySummary.map((item) => ({
                name: item.month_name,
                tickets: item.total_tickets,
              }))
            );
          }
        }

        // Set priority counts
        if (priorityResponse.data.success) {
          setPriorityCounts(
            priorityResponse.data.priorityTicketCounts.map((item) => ({
              name: item.Priority,
              value: item.ticketCount,
              color: getPriorityColor(item.Priority),
            }))
          );
        }

        // Set total ticket count
        if (ticketCountResponse.data.success) {
          setTicketCount(ticketCountResponse.data.totalTickets);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "#7C3AED";
      case "High":
        return "#DC2626";
      case "Medium":
        return "#D97706";
      case "Low":
        return "#059669";
      default:
        return "#A0AEC0";
    }
  };

  return (
    <div className="p-6 space-y-6 h-screen flex flex-col font-sans text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {[
          {
            title: "Clients",
            count: externalUserCount,
            icon: <Users size={32} className="text-blue-500" />,
          },
          {
            title: "Tickets",
            count: ticketCount,
            icon: <LineChart size={32} className="text-green-500" />,
          },
          {
            title: "Settings",
            count: "Manage",
            icon: <Settings size={32} className="text-purple-500" />,
            onClick: () => setIsModalOpen(true),
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="bg-white/10 backdrop-blur-lg border border-gray-300 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <CardContent className="flex items-center justify-between p-4">
              {/* Icon */}
              {item.icon}

              {/* Title + Count */}
              <div className="flex-1 flex flex-col items-center justify-center mx-2">
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                  {item.title}
                </h2>
                {item.title !== "Settings" && (
                  <p className="text-gray-700 text-lg font-medium text-center">
                    {item.count}
                  </p>
                )}
              </div>

              {/* Settings Button */}
              {item.title === "Settings" && (
                <Button
                  variant="outline"
                  onClick={item.onClick}
                  className="ml-2 transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg"
                >
                  {item.count}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <SettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex flex-grow space-x-6">
        <div className="w-3/4 bg-white/10 backdrop-blur-lg border border-gray-300 rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            {ticketOverviewTitle}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
              <YAxis tick={{ fill: "#555", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="tickets"
                fill="url(#gradient)"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-6 mt-6">
            {[
              {
                title: "Open Tickets",
                count: ticketStatusCounts.open,
                icon: <MailOpen size={32} className="text-green-500" />,
              },
              {
                title: "Resolved Tickets",
                count: ticketStatusCounts.resolved,
                icon: <CheckCircle size={32} className="text-green-500" />,
              },
              {
                title: "Assigned Tickets",
                count: ticketStatusCounts.assigned,
                icon: <ClipboardList size={32} className="text-yellow-500" />,
              },
              {
                title: "In Progress Tickets",
                count: ticketStatusCounts.in_progress,
                icon: <Hourglass size={32} className="text-blue-500" />,
              },
              {
                title: "Closed Tickets",
                count: ticketStatusCounts.closed,
                icon: <XCircle size={32} className="text-red-500" />,
              },
              {
                title: "On Hold Tickets",
                count: ticketStatusCounts.on_hold,
                icon: <PauseCircle size={32} className="text-gray-500" />,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/20 backdrop-blur-lg border border-gray-300 rounded-xl shadow-md hover:shadow-lg hover:scale-105"
              >
                <CardContent className="flex items-center justify-between p-4">
                  {item.icon}
                  <div className="flex flex-col items-center text-center flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-lg font-medium">
                      {item.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-1/4 bg-white/10 backdrop-blur-lg border border-gray-300 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            User Roles
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : roles.length > 0 ? (
            <ul className="space-y-4">
              {roles.map((role, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white/20 p-4 rounded-lg shadow-md hover:scale-102"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 uppercase">
                      {role.role}
                    </h3>
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    {role.role_count}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No roles available</p>
          )}

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 text-center">
            Ticket Priorities
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityCounts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {priorityCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#6366F1", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#22C55E", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
