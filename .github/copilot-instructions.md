# React Todo App - AI Coding Agent Instructions

## Project Overview
A React-based todo application using Vite, TypeScript, and TailwindCSS with localStorage persistence. Features inline editing, modal-based detailed editing, and task completion tracking.

## Architecture & Data Flow

### Core Data Model (`src/types/task.ts`)
- **TaskWithEssentials**: Persistent data (stored in localStorage)
- **Task**: Runtime data extending TaskWithEssentials with UI state (`isEditting`, `ref`)
- **Modal**: Modal form data structure
- Key pattern: Separate persistent vs. runtime types to avoid storing React refs in localStorage

### State Management Pattern
- All task state lives in `App.tsx` as single source of truth
- LocalStorage sync via `useEffect` on taskList changes
- Modal content managed via `modalContent` state with automatic sync to editing tasks

### Component Communication
```tsx
// Task editing flow:
editTask(id) → setModalContent → useEffect → openModal
closeModal(content) → setTaskList → localStorage sync
```

## Development Patterns

### Ref Management for Dynamic Lists
- Use `createRef<HTMLInputElement>()` in map functions (NOT `useRef`)
- Store refs in task objects for inline editing: `ref: createRef<HTMLInputElement>()`
- Example: `toggleTaskEdit` creates new refs when entering edit mode

### State Updates with Immutability
```tsx
// Standard pattern for task updates
setTaskList(prev => prev.map(task => 
  task.id === id ? { ...task, newField: value } : task
));
```

### Modal Synchronization
- Modal opens automatically when `modalContent.taskId !== -1`
- Use `useLayoutEffect` for input focus to ensure DOM is ready
- Props are read-only: use local state in Modal component and sync via `useEffect`

## File Structure
- `src/App.tsx`: Main component with all task logic
- `src/components/`: Reusable UI components (Modal, Task)
- `src/utils/storage.ts`: localStorage abstraction
- `src/css/todo.css`: TailwindCSS custom utilities and error states

## Development Commands
```bash
npm run dev          # Vite dev server with --host flag
npm run build        # TypeScript compile + Vite build
npm run lint         # ESLint check
```

## Key Conventions
- Use `@/` path alias for src imports
- SVG imports with `?react` suffix for React components
- Error states via CSS classes (`.error` border styling)
- Date inputs with `showPicker()` for better UX
- All task IDs generated with `Date.now()` for uniqueness

## Critical Implementation Details
- **useLayoutEffect** for DOM manipulations (focus, etc.)
- **createRef** in loops, not useRef (Hook rules)
- **Props synchronization** in Modal via useEffect dependency on content
- **Filtering runtime fields** when saving to localStorage (storage.ts pattern)
- **Input validation** with error class application and focus management

## Storage Layer
LocalStorage automatically filters out `isEditting` and `ref` fields when persisting. On load, these UI fields are initialized to default values (`false`, `null`).
