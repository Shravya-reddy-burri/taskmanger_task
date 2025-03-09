### Task Manager

A modern task management application built with Next.js and React.

## Features

- Create, edit, and delete tasks
- Organize tasks with categories and priorities
- Set due dates for tasks
- Filter tasks by status (To Do, In Progress, Completed)
- Responsive design for desktop and mobile
- Drag-and-drop interface for changing task status


## Tech Stack

- **Frontend**:  React 18, Tailwind CSS
- **State Management**: React Context API and useState
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns



## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn


### Installation

1. Clone the repository:


```shellscript
git clone https://github.com/yourusername/taskmanger.git
cd taskmanger
```

2. Install dependencies:


```shellscript
npm install
# or
yarn install
```


3. Run the development server:


```shellscript
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.



## Usage

### Creating a Task

1. Navigate to the tasks page
2. Click on "Add Task" button
3. Fill in the task details:

1. Title (required)
2. Description (optional)
3. Status (To Do, In Progress, Completed)
4. Priority (Low, Medium, High)
5. Due Date



4. Click "Save"


### Managing Tasks

- **Edit**: Click on the three dots menu on a task card, then select "Edit"
- **Delete**: Click on the three dots menu on a task card, then select "Delete"
- **Change Status**: Click the "Move" button to move a task to the next status


## Task Statuses

Tasks can have one of three statuses:

1. **To Do**: Tasks that have not been started yet
2. **In Progress**: Tasks that are currently being worked on
3. **Completed**: Tasks that have been finished


## Task Priorities

Tasks can have one of three priority levels:

1. **Low**: Tasks with low urgency (green)
2. **Medium**: Tasks with medium urgency (yellow)
3. **High**: Tasks with high urgency (red)


## Customization

### Styling

You can customize the application's appearance by modifying:

1. **Color Scheme**: Edit the color variables in `app/globals.css`
2. **Component Styles**: Modify the Tailwind classes in component files
3. **Theme**: Update the theme configuration in `tailwind.config.ts`


### Adding New Features

To extend the application with new features:

1. **New Task Fields**:

1. Add new properties to the `Task` interface in `lib/types.ts`
2. Update the task form in `components/task-form.tsx`
3. Update the task card in `components/task-card.tsx`



2. **Authentication**:

1. Implement NextAuth.js for user authentication
2. Create login/signup pages
3. Add user-specific task filtering


3. **Categories and Tags**:

1. Create new interfaces for categories and tags
2. Add category/tag selection to the task form
3. Update the UI to display and filter by categories/tags





## Deployment

### Building for Production

```shellscript
npm run build
# or
yarn build
```

### Running in Production

```shellscript
npm start
# or
yarn start
```

### Deploying to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

```shellscript
npx vercel
```

## Troubleshooting

### Common Issues

1. **Installation Problems**:

1. Ensure you're using Node.js 18.x or higher
2. Try clearing npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`



2. **Build Errors**:

1. Ensure all dependencies are installed: `npm install`



3. **Runtime Errors**:

1. Check the browser console for JavaScript errors
2. Verify environment variables are set correctly



## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Code Style

This project uses:

- ESLint for code linting
- Prettier for code formatting


## License

This project is licensed under the MIT License - see the LICENSE file for details.
