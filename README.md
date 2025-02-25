
# Multi-Tenant Authentication System

This project implements a **multi-tenant authentication system** using MySQL and Node.js.

## Database Schema

### Tenants Table
This table stores tenant (organization) information.

```sql
CREATE TABLE `tenants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `domain` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `domain` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

#### Insert Sample Data
```sql
INSERT INTO `tenants` (`id`, `name`, `domain`) VALUES
('1', 'Company A', 'company-a.com'),
('2', 'Company B', 'company-b.com'),
('3', 'Company C', 'company-c.com');
```

### Users Table
This table stores user information, linked to tenants.

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tenant_id` int NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Setup Instructions

### Clone the Repository
```sh
git clone https://github.com/bukharirazahassan/multi-tenant-auth.git
cd multi-tenant-auth
```

### Install Dependencies
```sh
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory with the following content:
```env
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

### Run the Application
```sh
npm start
```

## Query Data

To fetch all tenants:
```sql
SELECT * FROM tenants;
```

To fetch all users:
```sql
SELECT * FROM users;
```
