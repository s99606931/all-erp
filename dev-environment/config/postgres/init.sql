-- Create databases for all services
CREATE DATABASE auth_db;

CREATE DATABASE system_db;

CREATE DATABASE tenant_db;

CREATE DATABASE personnel_db;

CREATE DATABASE payroll_db;

CREATE DATABASE attendance_db;

CREATE DATABASE budget_db;

CREATE DATABASE accounting_db;

CREATE DATABASE settlement_db;

CREATE DATABASE asset_db;

CREATE DATABASE supply_db;

CREATE DATABASE general_affairs_db;

CREATE DATABASE approval_db;

CREATE DATABASE report_db;

CREATE DATABASE notification_db;

CREATE DATABASE file_db;

-- Grant privileges (optional, if using a specific user)
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE system_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE tenant_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE personnel_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE payroll_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE attendance_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE budget_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE accounting_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE settlement_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE asset_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE supply_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE general_affairs_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE approval_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE report_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE notification_db TO postgres;

GRANT ALL PRIVILEGES ON DATABASE file_db TO postgres;