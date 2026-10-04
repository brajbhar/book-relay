IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'book_relay')
BEGIN
    CREATE DATABASE book_relay;
END
GO

USE book_relay;
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'auth')
    EXEC('CREATE SCHEMA auth');
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'catalog')
    EXEC('CREATE SCHEMA catalog');
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'lending')
    EXEC('CREATE SCHEMA lending');
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'fulfillment')
    EXEC('CREATE SCHEMA fulfillment');
GO
