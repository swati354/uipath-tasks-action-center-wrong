# UiPath Orchestrator Control Center

A comprehensive enterprise dashboard for UiPath automation management with three main components: Processes View, Assets View, and Action Center Tasks View. Built with React, TypeScript, and the UiPath SDK for seamless integration with UiPath Orchestrator.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/uipath-tasks-action-center-wrong)

## Features

### 🚀 Processes Management
- Display all published automation processes with filtering by status, folder, and name
- Start processes with a single click and monitor execution status
- Real-time process status updates with automatic polling

### 📊 Assets Management
- View all configuration assets stored in UiPath Orchestrator
- Support for different asset types (text, boolean, credential)
- Secure credential masking for sensitive data
- Organization by folder structure

### 📋 Action Center Tasks
- Dedicated workspace for managing human-in-the-loop tasks
- Filter by status (Pending, In Progress, Completed), priority levels, and due dates
- Task assignment capabilities with user management
- Complete tasks with required form data submission

### 🎨 Professional Interface
- Clean, enterprise-grade UI with neutral color scheme
- Tabbed navigation for quick switching between views
- Efficient information density with table-based layouts
- Real-time data updates without manual refreshing

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide React
- **UiPath Integration**: UiPath TypeScript SDK with OAuth authentication
- **State Management**: Zustand, React Query (TanStack Query)
- **Styling**: Tailwind CSS with custom design system
- **Date Handling**: date-fns
- **Deployment**: Cloudflare Pages

## Prerequisites

- [Bun](https://bun.sh/) runtime
- UiPath Orchestrator instance with OAuth External App configured
- Modern web browser with JavaScript enabled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uipath-orchestrator-control-center
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables by creating a `.env` file:
```env
VITE_UIPATH_BASE_URL=https://your-uipath-instance.com
VITE_UIPATH_ORG_NAME=your-organization-name
VITE_UIPATH_TENANT_NAME=your-tenant-name
VITE_UIPATH_CLIENT_ID=your-oauth-client-id
VITE_UIPATH_REDIRECT_URI=http://localhost:3000
VITE_UIPATH_SCOPE=OR.Execution OR.Assets OR.Tasks
```

## UiPath OAuth Setup

1. In UiPath Orchestrator, navigate to **Admin** > **External Applications**
2. Create a new External Application with:
   - **Application Type**: Confidential Client
   - **Grant Types**: Authorization Code
   - **Redirect URIs**: Your application URL (e.g., `http://localhost:3000`)
   - **Scopes**: `OR.Execution`, `OR.Assets`, `OR.Tasks`, `OR.Folders`
3. Copy the **Client ID** to your `.env` file as `VITE_UIPATH_CLIENT_ID`

## Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint

## Usage

### Authentication
1. Open the application in your browser
2. Click the authentication prompt to sign in with your UiPath credentials
3. Grant the requested permissions for the application

### Managing Processes
1. Navigate to the **Processes & Assets** tab
2. View all available processes with their current status
3. Use the search bar to filter processes by name
4. Click **Start Process** to execute automation workflows
5. Monitor execution status in real-time

### Viewing Assets
1. In the **Processes & Assets** tab, switch to the Assets section
2. Browse configuration assets organized by folder
3. View asset types and values (credentials are masked for security)
4. Use filters to find specific assets quickly

### Managing Tasks
1. Switch to the **Action Center Tasks** tab
2. View all pending and in-progress tasks
3. Filter tasks by status, priority, or due date
4. Assign tasks to users or take ownership
5. Complete tasks by providing required form data

## Architecture

The application follows a modern React architecture with:

- **Component-based UI**: Reusable components built with shadcn/ui
- **Custom Hooks**: React Query hooks for UiPath SDK integration
- **Type Safety**: Full TypeScript coverage with UiPath SDK types
- **State Management**: Zustand for client state, React Query for server state
- **Authentication**: OAuth 2.0 flow with UiPath Orchestrator
- **Real-time Updates**: Automatic polling for live data synchronization

## Deployment

### Cloudflare Pages

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/uipath-tasks-action-center-wrong)

1. Build the application:
```bash
bun run build
```

2. Deploy to Cloudflare Pages:
   - Connect your repository to Cloudflare Pages
   - Set build command: `bun run build`
   - Set build output directory: `dist`
   - Add environment variables in Cloudflare Pages dashboard

3. Configure environment variables in Cloudflare Pages:
   - Add all `VITE_*` variables from your `.env` file
   - Update `VITE_UIPATH_REDIRECT_URI` to your production URL

### Manual Deployment

The `dist` folder contains static files that can be deployed to any static hosting service:

```bash
bun run build
# Upload contents of 'dist' folder to your hosting provider
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_UIPATH_BASE_URL` | UiPath Orchestrator instance URL | Yes |
| `VITE_UIPATH_ORG_NAME` | Organization name | Yes |
| `VITE_UIPATH_TENANT_NAME` | Tenant name | Yes |
| `VITE_UIPATH_CLIENT_ID` | OAuth client ID from External App | Yes |
| `VITE_UIPATH_REDIRECT_URI` | OAuth redirect URI | No (defaults to origin) |
| `VITE_UIPATH_SCOPE` | OAuth scopes | No (defaults to common scopes) |

### Customization

The application uses a design system based on:
- **Primary Color**: UiPath Orange (#FA4616)
- **Secondary Color**: Dark Blue (#1A1E28)
- **Neutral Colors**: Gray scale for professional appearance

Modify `src/index.css` and `tailwind.config.js` to customize the theme.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the [UiPath SDK Documentation](https://docs.uipath.com/orchestrator/reference)
- Review UiPath Orchestrator API documentation
- Create an issue in this repository

## Acknowledgments

- Built with [UiPath TypeScript SDK](https://www.npmjs.com/package/uipath-sdk)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Cloudflare Pages](https://pages.cloudflare.com/)