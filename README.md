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
('1', 'Greyloops', 'greyloops.com'),
('2', 'Company B', 'company-b.com'),
('3', 'Company C', 'company-c.com');
```

### Users Table

This table stores user information, linked to tenants.

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tenant_id` int DEFAULT '1',
  `role` enum('admin','user','superadmin','staff','support') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### Support Tickets Table

This table stores support tickets for users.

```sql
CREATE TABLE `support_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(20) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('Open','In Progress','Resolved','Closed','On Hold','Assigned') DEFAULT 'Open',
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ticket_date` date DEFAULT NULL,
  `work_phone` varchar(255) DEFAULT NULL,
  `current_status` enum('Open','In Progress','Resolved','Closed','On Hold','Assigned') DEFAULT 'Open',
  `current_priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_number` (`ticket_number`)
) ENGINE=InnoDB AUTO_INCREMENT=1088 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### External Users Table

This table stores external users who interact with the system.

```sql
CREATE TABLE `external_users` (
  `user_id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `work_phone` varchar(20) DEFAULT NULL,
  `addr_line1` varchar(255) DEFAULT NULL,
  `addr_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
###  Table

This table stores Ticket Transactions history.

```sql
CREATE TABLE `TicketTransactions` (
  `TransactionId` int NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(20) NOT NULL,
  `external_user_id` bigint NOT NULL,
  `assigned_by` bigint DEFAULT NULL,
  `assigned_to` bigint DEFAULT NULL,
  `Ticket_status` varchar(15) NOT NULL,
  `Comment` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `priority` varchar(10) DEFAULT NULL,
  `Action_DateTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`TransactionId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```


## Role Management

- **Superadmin**: A seed is created when starting `server.js`. It validates whether the role exists; if not, it creates the Superadmin with an ID.
- **Superadmin** has full access to update Admin, Staff, and Support roles.
- **Admin** can update only Staff and Support roles.

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



