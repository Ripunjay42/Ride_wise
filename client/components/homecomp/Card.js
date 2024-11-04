export const Card = ({ children }) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6">
    {children}
  </div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-2xl font-semibold leading-none tracking-tight">
    {children}
  </h3>
);

export const CardContent = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

export const Button = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} h-10 px-4 py-2`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);