import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MenuItem, Select } from "@mui/material";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token"); // Get token
  const role = localStorage.getItem("role"); // Get role from localStorage

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  // ✅ Function to handle role change
  const handleRoleChange = async (id, newRole) => {
    if (role !== "admin" && role !== "superadmin") {
      console.error("Unauthorized: Only admins and superadmins can update roles");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // ✅ Get role options based on the current user role
  const getRoleOptions = () => {
    if (role === "superadmin") {
      return ["admin", "staff", "support", "user"];
    } else if (role === "admin") {
      return ["staff", "support", "user"];
    }
    return [];
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "fullName", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "tenant_id", headerName: "Tenant Id", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) =>
        role === "superadmin" || role === "admin" ? (
          <Select
            value={params.value || ""}
            onChange={(e) => handleRoleChange(params.row.id, e.target.value)}
            size="small"
            fullWidth
            displayEmpty
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              "& .MuiSelect-select": {
                padding: "10px",
              },
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
              "&:focus": {
                backgroundColor: "#f1f3f5",
              },
            }}
          >
            {getRoleOptions().map((roleOption) => (
              <MenuItem
                key={roleOption}
                value={roleOption} // ✅ Fix: Use correct value
                sx={{
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "10px",
                  borderRadius: "4px",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                    fontWeight: "600",
                  },
                  "&:active": {
                    backgroundColor: "#bbdefb",
                  },
                }}
              >
                {roleOption}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <span>{params.value}</span>
        ),
    },
  ];

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-100px)] w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User List</h2>
      <div className="flex-grow bg-white/50 backdrop-blur-md rounded-md shadow-md">
        <DataGrid
          rows={users}
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
