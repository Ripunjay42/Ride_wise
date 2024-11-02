export const TripDetails = ({ distance, duration }) => (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        <div className="flex items-center">
          <i className="fas fa-route mr-2 text-blue-500 text-xl"></i>
          <span className="font-extrabold text-2xl">Distance:</span>
          <span className="ml-2 font-extrabold text-2xl">{distance} km</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-clock mr-2 text-blue-500 text-xl"></i>
          <span className="font-extrabold text-2xl">Duration:</span>
          <span className="ml-2 font-extrabold text-2xl">{duration} mins</span>
        </div>
      </div>
    </div>
  );