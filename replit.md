# Naya Sawera Foundation - NGO Website

## Overview

This is a Flask-based web application for the Naya Sawera Foundation, an NGO focused on education, healthcare, and sustainable development initiatives. The application provides a comprehensive platform for managing events, donations, volunteering, gallery content, product sales, incident reporting, and community engagement through a multilingual interface.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python) with Gunicorn for production deployment
- **Data Storage**: JSON file-based storage system with PostgreSQL support configured but not yet implemented
- **Session Management**: Flask sessions with secure secret key configuration
- **AI Integration**: OpenAI GPT-4o integration for intelligent chatbot functionality

### Frontend Architecture
- **Styling**: Tailwind CSS for responsive design with custom CSS overrides
- **Icons**: Font Awesome for consistent iconography
- **JavaScript**: Vanilla JavaScript for interactivity, including chatbot and form handling
- **Templates**: Jinja2 templating with base template inheritance

### Multilingual Support
- English and Hindi language support with JSON-based translation system
- Language-aware routing with URL parameters
- Dynamic content switching without page reload

## Key Components

### Core Modules
1. **app.py**: Flask application initialization and configuration
2. **routes.py**: URL routing and view logic for all pages
3. **utils.py**: Data management utilities for JSON file operations
4. **chatbot.py**: AI-powered chatbot with OpenAI integration and FAQ fallback
5. **main.py**: Application entry point

### Data Management
- **JSON-based Storage**: All data stored in `/data/` directory as JSON files
- **Dynamic Schema Creation**: Automatic creation of default data structures when files don't exist
- **Data Files**:
  - `content.json`: Site content and configuration
  - `events.json`: Events, donations, and volunteer data
  - `gallery.json`: Media gallery items
  - `products.json`: Product catalog and orders
  - `reports.json`: Incident reports
  - `newsletter.json`: Newsletter subscribers
  - `translations.json`: Multilingual content

### User Interface Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Modal dialogs, form validation, progress bars
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Real-time Features**: Live chatbot, dynamic content updates

## Data Flow

### User Interactions
1. **Donations**: Users donate to events → Data stored in events.json → Progress bars updated
2. **Volunteering**: Users register for events → Volunteer data stored with events
3. **Product Orders**: Users place orders → Order data stored in products.json
4. **Incident Reports**: Users submit reports → Data stored in reports.json
5. **Newsletter**: Users subscribe → Email stored in newsletter.json
6. **Chatbot**: Users chat → OpenAI API called → Responses displayed

### Admin Functions
- Content management through admin dashboard
- Event creation and management
- Report review and handling
- Gallery content management

### Data Persistence
- JSON files serve as primary data store
- Automatic backup and validation
- Schema migration support for data structure changes

## External Dependencies

### Required Services
- **OpenAI API**: For intelligent chatbot responses (GPT-4o model)
- **Email Service**: For newsletter and notification functionality (to be implemented)

### Python Packages
- **Flask**: Web framework and core functionality
- **Flask-SQLAlchemy**: Database ORM (prepared for PostgreSQL migration)
- **Gunicorn**: WSGI HTTP Server for production
- **OpenAI**: AI chatbot integration
- **Psycopg2**: PostgreSQL adapter (for future database migration)
- **Werkzeug**: WSGI utilities and security
- **Email-validator**: Email validation functionality

### Frontend Assets
- **Tailwind CSS**: Styling framework (CDN)
- **Font Awesome**: Icon library (CDN)

## Deployment Strategy

### Production Configuration
- **Server**: Gunicorn WSGI server with auto-scaling deployment
- **Platform**: Replit deployment with PostgreSQL and OpenSSL support
- **Environment**: Nix-based environment with Python 3.11
- **Process Management**: Gunicorn with port reuse and reload capabilities

### Environment Variables
- `OPENAI_API_KEY`: Required for chatbot functionality
- `SESSION_SECRET`: Flask session security (defaults to hardcoded key)

### Scaling Considerations
- JSON file storage suitable for small to medium scale
- PostgreSQL migration path available for larger deployments
- Stateless design enables horizontal scaling

## Changelog

- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.