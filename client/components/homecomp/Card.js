export const Card = ({ children }) => (
    <div className="bg-white shadow-md rounded-lg p-6">{children}</div>
  );
  
  export const CardHeader = ({ children }) => (
    <div className="mb-4">{children}</div>
  );
  
  export const CardTitle = ({ children }) => (
    <h2 className="text-2xl font-bold mb-2 flex items-center">
      <i className="fas fa-car mr-4 text-blue-500"></i>
      {children}
    </h2>
  );
  
  export const CardContent = ({ children }) => <div>{children}</div>;