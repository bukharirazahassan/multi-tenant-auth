import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { format } from 'date-fns'; // Import date-fns

export default function SupportTicketList() {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchTickets = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/support-tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);

          // Format the created_at date
          const formattedTickets = data.map(ticket => ({
            ...ticket,
            created_at: ticket.created_at ? format(new Date(ticket.created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A' // Format date or show N/A
          }));

          setTickets(Array.isArray(formattedTickets) ? formattedTickets : []);
        } else {
          console.error("Failed to fetch tickets");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [token]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "ticket_number", headerName: "Ticket Number", flex: 1 },
    { field: "subject", headerName: "Subject", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
    { field: "created_at", headerName: "Created At", flex: 1 },
    {
        field: "resolution",
        headerName: "Resolution",
        flex: 1,
        renderCell: (params) => (
          <a
            href={`/resolution/${params.row.id}`} // Dynamic link based on ticket ID
            className="text-blue-600 underline hover:text-blue-800"
          >
            View Resolution
          </a>
        ),
      },
  ];

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-100px)] w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Support Tickets</h2>
      <div className="flex-grow bg-white/50 backdrop-blur-md rounded-md shadow-md">
        <DataGrid
          rows={tickets || []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          className="h-full w-full"
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#3ab7bf",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-root": {
              fontFamily: "Inter, sans-serif",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "14px",
              color: "#374151",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#3ab7bf",
            },
          }}
        />
      </div>
    </div>
  );
}