CREATE TABLE Passenger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(255) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Driver (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(255) NOT NULL,
  licenseNumber VARCHAR(255) UNIQUE NOT NULL,
  vehicleNumber VARCHAR(255) UNIQUE NOT NULL,
  vehicleType VARCHAR(255) NOT NULL,
  isAvailable BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'inactive',
  licenseValidity DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);