//SupportTicketList.jsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns"; // Import date-fns
import { CircularProgress } from "@mui/material"; // Material-UI Loader
import TicketDetailModal from "./TicketDetailModal"; // Import Modal
import TicketDetailModalSupport from "./TicketDetailModalSupport";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import SearchCriteriaPanel from "./SearchCriteriaPanel";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import dayjs from "dayjs";

export default function SupportTicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id"); // ✅ Get user_id from localStorage
  const fetchedRef = useRef(false);

  const isAdminOrSuperAdmin = role === "superadmin" || role === "admin";
  const isSupport = role === "support";

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [filters, setFilters] = useState({
    ticketId: "",
    status: "",
    priority: "",
    dateFrom: dayjs(),
    dateTo: dayjs(), 
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
  
      if (filters.ticketId) query.append("ticketId", filters.ticketId);
      if (filters.status) query.append("status", filters.status);
      if (filters.priority) query.append("priority", filters.priority);
      if (filters.dateFrom) {
        const formattedDateFrom = filters.dateFrom.format("YYYY-MM-DD HH:mm");
        query.append("dateFrom", formattedDateFrom);
      }
  
      if (filters.dateTo) {
        const formattedDateTo = filters.dateTo.format("YYYY-MM-DD HH:mm");
        query.append("dateTo", formattedDateTo);
      }
  
      let response; // ✅ Use `let` instead of `const`
  
      if (isAdminOrSuperAdmin) {
        response = await fetch(
          `http://localhost:5000/api/support-tickets/search?${query.toString()}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (isSupport) {
        response = await fetch(
          `http://localhost:5000/api/support-tickets/assignedTickets/search?${query.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              user_id: userId,
            },
          }
        );
      }
  
      if (response.ok) {
        const data = await response.json();
        const formattedTickets = data.map((ticket) => ({
          ...ticket,
          created_at: ticket.created_at
            ? format(new Date(ticket.created_at), "yyyy-MM-dd HH:mm:ss")
            : "N/A",
        }));
        setTickets(Array.isArray(formattedTickets) ? formattedTickets : []);
      } else {
        console.error("Search failed");
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
      setIsSearchOpen(false);
    }
  };

  // ✅ Memoized fetchTickets function
  const fetchTickets = useCallback(async () => {
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/support-tickets",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("All Tickets API Response:", data);

        // Format the created_at date
        const formattedTickets = data.map((ticket) => ({
          ...ticket,
          created_at: ticket.created_at
            ? format(new Date(ticket.created_at), "yyyy-MM-dd HH:mm:ss")
            : "N/A",
        }));

        setTickets(Array.isArray(formattedTickets) ? formattedTickets : []);
      } else {
        console.error("Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Memoized fetchAssignedTickets function
  const fetchAssignedTickets = useCallback(async () => {
    if (!token || !userId) {
      console.error("Missing token or user_id");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/support-tickets/assignedTickets",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            user_id: userId, // ✅ Pass user_id in headers
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Assigned Tickets API Response:", data);

        // Format the created_at date
        const formattedTickets = data.map((ticket) => ({
          ...ticket,
          created_at: ticket.created_at
            ? format(new Date(ticket.created_at), "yyyy-MM-dd HH:mm:ss")
            : "N/A",
        }));

        setTickets(Array.isArray(formattedTickets) ? formattedTickets : []);
      } else {
        console.error("Failed to fetch assigned tickets");
      }
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  // ✅ Updated useEffect with correct dependencies
  useEffect(() => {
    if (!isAdminOrSuperAdmin && !isSupport) {
      setLoading(false);
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (isAdminOrSuperAdmin) {
      fetchTickets();
    } else if (isSupport) {
      fetchAssignedTickets();
    }
  }, [isAdminOrSuperAdmin, isSupport, fetchTickets, fetchAssignedTickets]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "ticket_number", headerName: "Ticket Number", flex: 1 },
    { field: "subject", headerName: "Subject", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "current_status", headerName: "Status", flex: 0.5 },
    { field: "current_priority", headerName: "Priority", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 1 },
    {
      field: "detail",
      headerName: "Action",
      flex: 1,
      align: "center", // Center cell content
      headerAlign: "center", // Center header text
      renderCell: (params) => (
        <span
          onClick={() => setSelectedTicket(params.row)}
          className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
        >
          <VisibilityIcon className="mr-1" />
        </span>
      ),
    },
  ];



  return (
    <div className="p-6 flex flex-col w-full h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isAdminOrSuperAdmin ? "Support Tickets" : "Assigned Tickets"}
        </h2>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => setIsSearchOpen(true)}
          sx={{
            backgroundColor: "#3ab7bf",
            "&:hover": { backgroundColor: "#329fa5" },
            fontWeight: "bold",
            fontSize: "14px",
            textTransform: "none",
            borderRadius: "8px",
            minWidth: "120px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Search
        </Button>
      </div>
      <div
        className="bg-white/50 backdrop-blur-md rounded-md shadow-md flex-grow flex items-center justify-center"
        style={{
          height: "calc(100vh - 150px)",
          minHeight: "400px",
          maxHeight: "80vh",
        }}
      >
        {loading ? (
          <CircularProgress size={50} color="primary" />
        ) : (
          <DataGrid
            rows={tickets || []}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 15, 25, 50, 100]}
            autoPageSize={false}
            className="h-full w-full"
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#3ab7bf",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-root": { fontFamily: "Inter, sans-serif" },
              "& .MuiDataGrid-cell": { fontSize: "14px", color: "#374151" },
              "& .MuiDataGrid-columnHeader": { backgroundColor: "#3ab7bf" },
            }}
          />
        )}
      </div>

      {/* Modal */}
      {selectedTicket &&
        (isAdminOrSuperAdmin ? (
          <TicketDetailModal
            isOpen={true}
            onClose={() => setSelectedTicket(null)}
            ticket={selectedTicket}
          />
        ) : isSupport ? (
          <TicketDetailModalSupport
            isOpen={true}
            onClose={() => setSelectedTicket(null)}
            ticket={selectedTicket}
          />
        ) : null)}

      <SearchCriteriaPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />
    </div>
  );
}
