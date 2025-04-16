import React from "react";
import { X } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TextField, FormControlLabel, Checkbox, Stack, styled } from "@mui/material";

const SearchCriteriaPanel = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onSearch,
}) => {
  const handleDateTimeChange = (name, newValue) => {
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-opacity-50 backdrop-blur-md shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b bg-gray-800 bg-opacity-70 rounded-t-lg h-20">
        <h2 className="text-lg font-semibold text-white">Search Criteria</h2>
        <button onClick={onClose}>
          <X
            size={24}
            className="text-white hover:text-red-400 transition-colors"
          />
        </button>
      </div>

      <div className="p-6 space-y-6 bg-opacity-60 rounded-b-lg shadow-xl backdrop-blur-md">
        <div>
          <label className="block text-sm font-bold text-[#1e1e2f] mb-1 px-2 py-1 rounded-md bg-[rgba(58,183,191,0.2)] backdrop-blur-sm shadow-[0_2px_8px_rgba(58,183,191,0.8)]">
            Ticket ID
          </label>
          <input
            type="text"
            name="ticketId"
            value={filters.ticketId}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 transition-all"
           
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e1e2f] mb-1 px-2 py-1 rounded-md bg-[rgba(58,183,191,0.2)] backdrop-blur-sm shadow-[0_2px_8px_rgba(58,183,191,0.8)]">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value=""></option>
            <option value="open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e1e2f] mb-1 px-2 py-1 rounded-md bg-[rgba(58,183,191,0.2)] backdrop-blur-sm shadow-[0_2px_8px_rgba(58,183,191,0.8)]">
            Priority
          </label>
          <select
            name="priority"
            value={filters.priority}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value=""></option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e1e2f] mb-1 px-2 py-1 rounded-md bg-[rgba(58,183,191,0.2)] backdrop-blur-sm shadow-[0_2px_8px_rgba(58,183,191,0.8)]">
            Ticket Created At
          </label>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-4">
              <DateTimePickerWithCheckbox
                label="From"
                value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                onChange={(newValue) => handleDateTimeChange("dateFrom", newValue)}
                color="#3ab7bf" // Pass the desired color
              />

              <DateTimePickerWithCheckbox
                label="To"
                value={filters.dateTo ? dayjs(filters.dateTo) : null}
                onChange={(newValue) => handleDateTimeChange("dateTo", newValue)}
                color="#3ab7bf" // Pass the desired color
              />
            </div>
          </LocalizationProvider>
        </div>

        <button
          onClick={onSearch}
          className="bg-[#3ab7bf] text-white px-6 py-3 rounded-lg hover:bg-[#34a4a1] transition-all w-full"
        >
          Search
        </button>
      </div>
    </div>
  );
};

// Styled Checkbox Component
const CustomCheckbox = styled(Checkbox)(({ theme, color }) => ({
  color: theme.palette.grey[500],
  '&.Mui-checked': {
    color: color,
  },
}));

// Custom DateTimePicker with Checkbox Component
const DateTimePickerWithCheckbox = ({ label, onChange, value, color, ...otherProps }) => {
  const [isChecked, setIsChecked] = React.useState(!!value);
  const [selectedDateTime, setSelectedDateTime] = React.useState(value);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      setSelectedDateTime(dayjs());
      onChange(dayjs());
    } else {
      setSelectedDateTime(null);
      onChange(null);
    }
  };

  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
    onChange(newDateTime);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <FormControlLabel
        control={<CustomCheckbox checked={isChecked} onChange={handleCheckboxChange} color={color} />}
        label={label}
      />
      <DateTimePicker
        {...otherProps}
        disabled={!isChecked}
        value={selectedDateTime}
        onChange={handleDateTimeChange}
        format="YYYY-MM-DD HH:mm"
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            variant: "outlined",
            fullWidth: true,
            size: "small",
            sx: {
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d1d5db",
                },
                "&:hover fieldset": {
                  borderColor: "#60a5fa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
              "& input": { color: "#6b7280" },
            },
          },
        }}
      />
    </Stack>
  );
};

export default SearchCriteriaPanel;