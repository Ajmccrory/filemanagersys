# File Manager System

## Overview
This file manager system is an open-source case management system designed for legal professionals, investigators, and researchers. Currently in Alpha testing, this application provides a streamlined approach to managing cases, evidence, and entity relationships.

**⚠️ Alpha Stage Notice**: This software is in early development. While core features are functional, you may encounter bugs or incomplete features. Not recommended for production use yet.

## Architecture

### Frontend (Next.js)
- Modern React with TypeScript
- TanStack Query for state management
- Tailwind CSS for styling
- Dark/Light mode support
- Responsive design

### Backend (Flask)
- RESTful API architecture
- SQLAlchemy ORM
- File handling system
- Caching mechanisms
- CORS support for development

## Core Features

### 1. Case Management
- Create and manage investigation cases
- Attach supporting documents
- Track case progress
- Organize evidence

### 2. Evidence Tracking
- Document evidence details
- Link evidence to cases
- Track evidence relationships
- Maintain chain of custody

### 3. Entity Management
- Track persons of interest
- Document organizations
- Map relationships between entities
- Add facts and notes

## Known Limitations (Alpha Stage)

1. **Authentication**: Basic authentication system - needs enhancement
2. **File Storage**: Local storage only - cloud storage coming soon
3. **Performance**: Limited optimization for large datasets
4. **Mobile Support**: Basic responsive design - needs refinement
5. **API Documentation**: In development

## Roadmap

### Alpha Stage (Current)
- [x] Core CRUD operations
- [x] Basic file handling
- [x] Entity relationship mapping
- [x] Test coverage
- [ ] API documentation
- [ ] Security enhancements

### Beta Stage (Upcoming)
- [ ] Advanced authentication
- [ ] Cloud storage integration
- [ ] Bulk operations
- [ ] Advanced search
- [ ] Audit logging
- [ ] Performance optimization

### 1.0 Release
- [ ] Complete documentation
- [ ] Production deployment guide
- [ ] Migration tools
- [ ] Backup/restore functionality
- [ ] API stability

## License
MIT License - See LICENSE file for details

## Support
- GitHub Issues for bug reports
- Discussions for feature requests
- Wiki for documentation (coming soon)

## Authors
- AJ McCrory - I am making this as a project for my dad currently but it may scale and I like the code so far.

---

⚠️ **Alpha Stage Disclaimer**: This software is not production-ready. Use at your own risk. Data persistence and security features are still under development.


