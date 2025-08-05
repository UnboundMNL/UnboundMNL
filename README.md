# Unbound MNL Website

![UNBOUNDMNL Landing Page](/docs/landing.png)

This repository contains the full codebase of the Unbound MNL Website, a platform designed to manage and support the Kaban savings program. This project was developed for the CSSWENG course during Term 3 of the 2024–2025 academic year, with the goal of improving the program's usability, efficiency, and overall functionality.

## About The Project

The Unbound MNL platform is a comprehensive web application built to facilitate the management of the Kaban savings program. It provides a centralized system for tracking members, savings, and organizational structures such as clusters, projects, and self-help groups (SHGs). The system is designed with a role-based access control system, catering to the different needs and responsibilities of Administrators, Social and Economic Development Officers (SEDOs), and Treasurers.

## Key Features

*   **Role-Based Access Control**: Different user roles (Admin, SEDO, Treasurer) with specific permissions and views.
*   **Organizational Hierarchy Management**: Functionality to create, read, update, and delete Clusters, Sub-Projects, and Self-Help Groups (SHGs).
*   **Member Management**: Tracking of member information, including personal details and their affiliation to specific groups.
*   **Savings Tracking**: System for recording and monitoring member savings within the Kaban program.
*   **User Profile Management**: Users can view and edit their profile information, including profile pictures.
*   **Dashboard**: A central hub for users to get an overview of the program's statistics.
*   **Mass User Registration**: Feature to bulk-register users into the system.
*   **Search and Filtering**: Robust search functionality across different modules.
*   **Dynamic UI**: A responsive and interactive user interface with features like a collapsible sidebar and dynamic content loading.

## System Architecture

The application is built upon a classic **Model-View-Controller (MVC)** architectural pattern. This separation of concerns enhances maintainability and scalability. The user's browser interacts with the application via HTTP requests, which are managed by Express.js routes. These routes delegate the handling of each request to the appropriate controller function. Static assets like CSS, client-side JavaScript, and images are served from the `/public` directory.

![System Architecture Diagram](/docs/system_architecture_diagram.png)

## Entity-Relationship Diagram

The database schema is designed to represent the hierarchical structure of the Unbound organization and the relationships between its entities. The core entities include `User`, `Cluster`, `Project`, `Group`, `Member`, and `Saving`. A detailed **Entity-Relationship Diagram (ERD)** illustrating the database collections, their fields, and the relationships between them is shown below.

![Entity-Relationship Diagram](/docs/entity_relationship_diagram.png)

## Tech Stack
This project is built on the Node.js runtime environment and utilizes the Express.js framework. The front end is rendered using EJS templating, and the application is connected to a MongoDB database.

### **Frontend**
*   HTML/CSS
*   EJS (Embedded JavaScript templates)
*   JavaScript

### **Backend**
*   Node.js
*   Express.js
*   MongoDB
*   Mongoose

### **Dependencies**
*   `express-session` & `connect-mongo`: For session management.
*   `mongoose`: As an Object Data Modeler (ODM) for MongoDB.
*   `multer`: For handling file uploads (e.g., mass register, account photo, member photo)