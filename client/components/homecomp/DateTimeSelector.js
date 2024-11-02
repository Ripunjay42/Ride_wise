export const DateTimeSelector = ({ 
    selectedDate, 
    selectedTime, 
    onDateChange, 
    onTimeChange 
  }) => (
    <div className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Select Date</label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
          <input
            type="date"
            className="w-full border-none focus:outline-none"
            value={selectedDate}
            onChange={onDateChange}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Select Time</label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <i className="fas fa-clock mr-2 text-orange-500"></i>
          <input
            type="time"
            className="w-full border-none focus:outline-none"
            value={selectedTime}
            onChange={onTimeChange}
          />
        </div>
      </div>
    </div>
  );
  
 