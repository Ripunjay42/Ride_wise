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


CREATE TABLE Schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driverId UUID NOT NULL,
    pickupLocation TEXT NOT NULL,
    dropoffLocation TEXT NOT NULL,
    timeFrom TIME NOT NULL,
    timeTo TIME NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driverId) REFERENCES Drivers(id) ON DELETE CASCADE
);


CREATE TABLE PNR (
    PNRid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passengerId UUID NOT NULL,
    driverId UUID NOT NULL,
    locationFrom TEXT NOT NULL,
    locationTo TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    distance DECIMAL(5, 2) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'complete', 'cancelled')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (passengerId) REFERENCES Passenger(id) ON DELETE CASCADE,
    FOREIGN KEY (driverId) REFERENCES Driver(id) ON DELETE SET NULL
);


CREATE TABLE Admin (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
