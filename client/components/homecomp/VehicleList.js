export const VehicleList = ({ vehicles, selectedVehicle, onVehicleSelect }) => (
    <div className="mt-4 space-y-4">
      <h3 className="font-bold text-lg">Available Vehicles:</h3>
      <div className="grid gap-4">
        {vehicles.map((vehicle, index) => (
          <div 
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedVehicle === vehicle.name 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onVehicleSelect(vehicle.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id={`vehicle-${index}`}
                  name="vehicle"
                  value={vehicle.name}
                  checked={selectedVehicle === vehicle.name}
                  onChange={(e) => onVehicleSelect(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label 
                  htmlFor={`vehicle-${index}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <i className="fas fa-car text-gray-600"></i>
                  <div className="flex flex-col">
                    <span className="font-medium">{vehicle.name}</span>
                    <span className="text-sm text-gray-500">{vehicle.type}</span>
                  </div>
                </label>
              </div>
              <span className="font-semibold text-lg">{vehicle.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );