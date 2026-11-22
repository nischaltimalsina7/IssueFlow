# IssueFlow — Full-Stack Issue Tracking Application

IssueFlow is a full-stack issue tracking application built using React, TypeScript, and DeepSpace. It helps users create, organize, and manage software development issues through a Kanban-style dashboard.

**Live Demo:** https://issueflow.app.space

## Features

- User authentication
- Create issues with titles, descriptions, priorities, and statuses
- Three-column Kanban board: To Do, In Progress, Done
- Edit existing issues
- Delete issues
- Update issue status
- Dashboard statistics showing issue counts
- Persistent issue storage
- Role-based permissions

## Technology Stack

- **Frontend:** React, TypeScript
- **Backend and Data:** DeepSpace SDK
- **Authentication:** DeepSpace authentication
- **Database:** DeepSpace record collections
- **Deployment:** DeepSpace

## How to Run Locally

Clone the repository:

```bash
git clone https://github.com/nischaltimalsina7/IssueFlow.git
cd IssueFlow
```

Install dependencies:

```bash
npm install
```

Start the development environment:

```bash
npx deepspace dev start
```

Open the local URL displayed by the development server.

## Design Decisions

I chose a Kanban-style interface because it provides a simple way to visualize the progress of development issues.

The application focuses on essential issue management features rather than implementing a large number of unfinished integrations.

DeepSpace provides authentication, persistent data storage, and deployment capabilities, allowing the project to use a consistent platform for frontend and backend development.

## Testing

The deployed application was manually tested for:

- Website accessibility
- User sign-in
- Dashboard statistics
- Issue creation
- Issue status updates
- Issue editing
- Issue deletion
- Data persistence after refreshing

TypeScript validation was also completed using `npx tsc --noEmit`.

## Current Limitations and Future Improvements

- Add issue assignment and team management
- Add search and filtering
- Add comments and activity history
- Add automated end-to-end tests for issue workflows
- Verify authorization behavior across multiple user accounts
- Improve mobile responsiveness and accessibility

## AI Assistance

AI assistance was used during development to help with code generation, debugging, TypeScript errors, and understanding DeepSpace SDK APIs.

I reviewed and integrated the generated changes, ran the application locally, resolved development errors, and manually tested the deployed functionality.

## Author

Nischal Timalsina

Computer Science Undergraduate — SUNY Brockport

GitHub: https://github.com/nischaltimalsina7
