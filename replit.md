# Overview

This is a full-stack personal rental and inventory management system built with React, TypeScript, and Express.js. The application helps individuals or small businesses manage equipment rentals they make from suppliers (not rentals they provide to customers) and their own warehouse/inventory control. Key features include tracking active rentals from suppliers, managing supplier relationships, monitoring personal inventory levels, and generating reports. The system uses a PostgreSQL database with Drizzle ORM for data management and includes a modern UI built with shadcn/ui components.

# User Preferences

Preferred communication style: Simple, everyday language.
User Context: Personal/small business use - user rents equipment from suppliers rather than providing rentals to customers.
Perspective: Consumer of rental services, not provider.

# Recent Changes

## January 2025 - Backend Conversion to PHP
- **Backend Architecture**: Completely converted from Node.js/Express to PHP for HostGator compatibility
- **Database Migration**: Changed from PostgreSQL to MySQL with PHP PDO connections
- **API Structure**: Maintained same REST API endpoints for frontend compatibility
- **Dependencies Cleanup**: Removed Node.js server dependencies and files
- **Frontend Types**: Created local type definitions replacing shared schema imports
- **Development Setup**: Configured Vite to run on port 5000 with proper host configuration
- **Deploy Ready**: Complete PHP backend ready for HostGator cPanel deployment

## Previous - Context Adaptation
- **System Perspective**: Changed from rental provider to rental consumer
- **Schema Changes**: Renamed "customers" to "suppliers" throughout the system
- **Rental Model**: Updated to track equipment rented FROM suppliers
- **Interface Updates**: Modified UI labels and terminology for consumer perspective
- **Dashboard**: Changed "Revenue" to "Expenses" to reflect rental costs
- **Navigation**: Updated sidebar to reflect personal use context

# System Architecture

## Frontend Architecture
The client is built with React 18 using TypeScript and Vite as the build tool. The application uses a component-based architecture with:

- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Forms**: React Hook Form with Zod validation
- **Layout**: Main layout with sidebar navigation and header components
- **Types**: Local TypeScript definitions for all entities and forms

The frontend follows a page-based structure with dedicated pages for dashboard, rentals, inventory management, and reporting.

## Backend Architecture
The server is built with PHP using native MySQL connections and follows a REST API pattern:

- **Framework**: Native PHP with PDO for database connections
- **API Design**: RESTful endpoints organized by resource (suppliers, products, rentals, etc.)
- **Database**: MySQL with PHP models for data access
- **CORS**: Configured headers for cross-origin requests
- **Routing**: .htaccess configuration for clean URLs
- **Models**: Object-oriented PHP classes for each entity

## Database Layer
The application uses MySQL as the primary database:

- **Database**: MySQL with native PHP PDO connections
- **Schema**: SQL schema file for database setup
- **Models**: PHP classes for each entity (Supplier, Rental, Product, etc.)
- **Queries**: Prepared statements for security and performance

Key entities include users, suppliers (formerly customers), categories, products, rentals (equipment rented from suppliers), and inventory movements with proper foreign key relationships.

## Data Access Pattern
The system implements a model-based pattern:

- **Models**: PHP classes for each entity with CRUD operations
- **Database Class**: Centralized database connection management
- **Operations**: Full CRUD operations for all entities plus specialized queries for dashboard stats, low stock alerts, and overdue rentals

## Development & Build System
The project uses Vite for frontend development with PHP backend:

- **Frontend Build**: Vite for React bundling and development server
- **Backend**: Native PHP files ready for production deployment
- **Development**: Vite dev server on port 5000 with hot reload
- **Production**: Frontend builds to static files, PHP backend runs natively
- **Scripts**: npm scripts for frontend development and building

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: TypeScript-first ORM for database operations
- **connect-pg-simple**: PostgreSQL session store for Express

## Frontend Libraries
- **React**: Core UI framework with TypeScript
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation utilities

## UI Components & Styling
- **Radix UI**: Headless UI primitives for accessibility
- **shadcn/ui**: Pre-built component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

## Build Tools & Development
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server bundling for production
- **TypeScript**: Type safety across the entire application
- **PostCSS**: CSS processing with Tailwind integration

## Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling (conditional)
- **Replit dev banner**: Development environment indicators