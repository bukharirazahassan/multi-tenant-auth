import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function ExternalUserList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token"); // Get token

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        // 1. Update API Endpoint:
        const response = await fetch("http://localhost:5000/api/fetch-external-users-Jotform", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // 1. Adapt Data Structure:
          setUsers(data); // Assuming the API returns the users array directly
        } else {
          console.error("Failed to fetch external users");
        }
      } catch (error) {
        console.error("Error fetching external users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  // 2. Adjust Columns:
  const columns = [
    { field: "user_id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "work_phone", headerName: "Work Phone", flex: 1 },
    { field: "addr_line1", headerName: "Address Line 1", flex: 1.5 },
    { field: "addr_line2", headerName: "Address Line 2", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "state", headerName: "State", flex: 1 },
    { field: "postal", headerName: "Postal Code", flex: 1 },
    { field: "created_at", headerName: "Created At", flex: 1 },
  ];

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-100px)] w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">External Users</h2>
      <div className="flex-grow bg-white/50 backdrop-blur-md rounded-md shadow-md">
        <DataGrid
          rows={users.map((user) => ({ ...user, id: user.user_id }))}
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