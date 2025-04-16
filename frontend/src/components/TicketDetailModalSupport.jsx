import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const TicketDetailModalSupport = ({ isOpen, onClose, ticket }) => {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [ticketStatus, setTicketStatus] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("");
  const [StatusTime, setStatusTime] = useState(
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  );

  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  const userId = localStorage.getItem('user_id');


  useEffect(() => {
    if (!isOpen || !ticket?.ticket_number) return;

    const fetchTicketDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token is missing.");

        const response = await fetch(
          `http://localhost:5000/api/ticketDetail/ticketNumber?ticketNumber=${ticket.ticket_number}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: Unable to fetch ticket details`
          );
        }

        const data = await response.json();
        setTicketDetails(data);
        
        if (data?.priority) {
            setPriority(data.current_priority);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [isOpen, ticket]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (ticketDetails?.ticket_number && token) {
      fetch(
        `http://localhost:5000/api/transaction/ticketTransaction?ticket_number=${ticketDetails.ticket_number}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setTransactions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching transaction history:", error);
          setLoading(false);
        });
    }
  }, [ticketDetails]);

  const handleSaveAssignment = async () => {
    console.log("Saving with ticket Status:", ticketStatus, "Note:", note);

    if (!ticketStatus || !note) {
      alert("Please fill in all required fields before saving.");
      return;
    }

    const requestBody = {
      ticket_number: ticketDetails.ticket_number,
      external_user_id: ticketDetails.user_id,
      assigned_by: 7,
      assigned_to: Number(userId),
      ticket_status: ticketStatus,
      comment: note,
      priority: priority,
      Action_date: StatusTime,
    };
    
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing.");

      const response = await fetch(
        "http://localhost:5000/api/transaction/addTransaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Unable to save assignment`);
      }

      const responseData = await response.json();
      console.log("Assignment saved successfully:", responseData);
      alert("Ticket assignment saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert(`Failed to save assignment: ${error.message}`);
    }
  };

  const handleDateChange = (newValue) => {
    if (newValue) {
        setStatusTime(dayjs(newValue).format("YYYY-MM-DD HH:mm:ss"));
    } else {
      setStatusTime(null);
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-6xl rounded-xl shadow-lg overflow-hidden bg-gray-800 text-white flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-indigo-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Support Team – Ticket Overview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-gray-700 flex">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === "details"
                ? "bg-gray-900 text-indigo-400 border-b-2 border-indigo-400"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === "history"
                ? "bg-gray-900 text-indigo-400 border-b-2 border-indigo-400"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            History
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow" style={{ maxHeight: "calc(110vh - 10rem)" }}>
          {activeTab === "details" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-6 w-6 mr-2 text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V1a7.921 7.921 0 00-8 8 7.921 7.921 0 008 8v-3a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  <p className="text-gray-400">Loading ticket details...</p>
                </div>
              ) : error ? (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              ) : ticketDetails ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Card: User Information */}
                  <div className="bg-gray-900 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">
                      👤 Client Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Client Name:</p>
                        <p className="font-medium">{ticketDetails.user_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email:</p>
                        <p className="font-medium text-blue-300 hover:underline">
                          {ticketDetails.user_email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone:</p>
                        <p className="font-medium">
                          {ticketDetails.user_work_phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Address:</p>
                        <p className="font-medium">
                          {ticketDetails.addr_line1}, {ticketDetails.addr_line2}
                          ,
                          <br />
                          {ticketDetails.city}, {ticketDetails.state} -{" "}
                          {ticketDetails.postal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Card: Ticket Information */}
                  <div className="bg-gray-900 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">
                      📄 Ticket Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Ticket Number:</p>
                        <p className="font-medium text-indigo-300">
                          {ticketDetails.ticket_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Subject:</p>
                        <p className="font-medium">{ticketDetails.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Description:</p>
                        <p className="font-medium">
                          {ticketDetails.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-400">Status:</p>
                          <p
                            className={`font-medium ${
                              ticketDetails.status === "Open"
                                ? "text-green-400"
                                : ticketDetails.status === "Pending"
                                ? "text-yellow-400"
                                : ticketDetails.status === "Closed"
                                ? "text-red-400"
                                : "text-gray-300"
                            }`}
                          >
                            {ticketDetails.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Priority:</p>
                          <p
                            className={`font-medium ${
                              ticketDetails.priority === "High"
                                ? "text-red-500"
                                : ticketDetails.priority === "Medium"
                                ? "text-orange-400"
                                : ticketDetails.priority === "Low"
                                ? "text-blue-400"
                                : "text-gray-300"
                            }`}
                          >
                            {ticketDetails.priority}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Created At:</p>
                        <p className="font-medium">
                          {new Date(
                            ticketDetails.ticket_created_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Assignment, Priority, and Note Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  🛠️ Support Ticket Actions
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center ">
                    {/* Ticket Status */}
                    <div className="flex-1 flex items-center">
                      <label
                        htmlFor="ticketStatus"
                        className="block text-sm font-medium text-gray-400 w-1/3 text-right pr-2"
                      >
                        🗂️ Ticket Status
                      </label>
                      <select
                        id="ticketStatus"
                        className="mt-1 block w-[65%] rounded-md border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 pl-2"
                        value={ticketStatus}
                        onChange={(e) => setTicketStatus(e.target.value)}
                      >
                        <option value=""></option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* Due Date */}
                    <div className="flex-1 flex items-center">
                      <label
                        htmlFor="priorityBottom"
                        className="block text-sm font-medium text-gray-400  w-[65%] text-right pr-2"
                      >
                        {ticketStatus === "In Progress"
                          ? "Estimated Time of Completion:"
                          : ticketStatus === "Resolved"
                          ? "Resolved DateTime:"
                          : ticketStatus === "Closed"
                          ? "Closed DateTime:"
                          : ticketStatus === "On Hold"
                          ? "On Hold DateTime:"
                          : "DateTime:"}
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          value={
                            StatusTime ? dayjs(StatusTime, "YYYY-MM-DD HH:mm:ss") : null
                          }
                          onChange={handleDateChange}
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              fullWidth: true,
                              size: "small", // makes the input shorter
                              sx: {
                                backgroundColor: "#1f2937",
                                borderRadius: 1,
                                height: "36px", // reduced height for input
                                input: {
                                  color: "white",
                                  height: "36px", // ensures the input height is reduced
                                  padding: "6px 10px", // adjusted padding
                                },
                                label: { color: "gray" },
                                svg: { color: "#9CA3AF" },
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>

                  {/* Description/Note */}
                  <div>
                    <label
                      htmlFor="noteBottom"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="noteBottom"
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-2"
                      rows={4}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveAssignment}
                    className="w-[100px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "history" && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                📜 History
              </h3>

              {loading ? (
                <p className="text-gray-400">Loading transaction history...</p>
              ) : transactions.length > 0 ? (
                <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-700">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="bg-gray-800 text-gray-400 uppercase">
                      <tr>
                        <th className="px-4 py-1">ID</th>
                        <th className="px-4 py-1">Assigned By</th>
                        <th className="px-4 py-1">Assigned To</th>
                        <th className="px-4 py-1">Status</th>
                        <th className="px-4 py-1">Priority</th>
                        <th className="px-4 py-2">Comment</th>
                        <th className="px-4 py-2">Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((txn, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-700 hover:bg-gray-800 transition"
                        >
                          <td className="px-4 py-1">{txn.TransactionId}</td>
                          <td className="px-4 py-1">{txn.assigned_by_name}</td>
                          <td className="px-4 py-1">{txn.assigned_to}</td>
                          <td className="px-4 py-1 text-indigo-400">
                            {txn.ticket_status}
                          </td>
                          <td
                            className={`px-4 py-1 font-bold ${
                              txn.priority === "High"
                                ? "text-red-500"
                                : "text-green-400"
                            }`}
                          >
                            {txn.priority}
                          </td>
                          <td className="px-4 py-2">{txn.comment}</td>
                          <td className="px-4 py-2">
                            {txn.createdAt
                              ? new Date(txn.createdAt).toLocaleString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">
                  No transaction history available.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TicketDetailModalSupport;
