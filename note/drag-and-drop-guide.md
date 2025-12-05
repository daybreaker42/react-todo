# How to Add Drag-and-Drop to Reorder Todos

This guide explains how to add drag-and-drop functionality to your React To-do application to reorder tasks. We will use the popular library `react-beautiful-dnd`.

This will allow you to:
1.  Reorder tasks within the "ongoing" list.
2.  Reorder tasks within the "finished" list.
3.  Move tasks between the "ongoing" and "finished" lists by dragging them.

---

### Step 1: Installation

First, you need to install `react-beautiful-dnd` and its TypeScript type definitions.

Open your terminal and run the following commands:

```bash
npm install react-beautiful-dnd
npm install @types/react-beautiful-dnd --save-dev
```

---

### Step 2: Implementing Drag and Drop in `App.tsx`

You will need to modify `src/App.tsx` to integrate the drag-and-drop components. Here are the key components from the library we'll use:

-   `<DragDropContext />`: Wraps the part of your app where you want to enable drag and drop. It provides the `onDragEnd` callback.
-   `<Droppable />`: Defines an area where items can be dropped. We'll have one for the ongoing tasks and one for the finished tasks.
-   `<Draggable />`: Makes an individual item (like your `TaskC` component) draggable.

#### 2.1. The `onDragEnd` Handler

This function is the core of the logic. It's called every time a user finishes dragging an item. You need to add this function inside your `App` component. It will handle the logic for reordering the `taskList`.

```typescript
// Add this import at the top of src/App.tsx
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';

// Add this function inside the App component
const onDragEnd = (result: DropResult) => {
  const { source, destination } = result;

  // Exit if the item was dropped outside a valid droppable area
  if (!destination) {
    return;
  }

  // Exit if the item was dropped in the same place
  if (destination.droppableId === source.droppableId && destination.index === source.index) {
    return;
  }

  const ongoingTasks = taskList.filter(task => !task.finished);
  const finishedTasks = taskList.filter(task => task.finished);

  let newTaskList: Task[] = [];

  // Case 1: Reordering within the same list
  if (source.droppableId === destination.droppableId) {
    if (source.droppableId === 'ongoing-content') {
      const [movedItem] = ongoingTasks.splice(source.index, 1);
      ongoingTasks.splice(destination.index, 0, movedItem);
      newTaskList = [...ongoingTasks, ...finishedTasks];
    } else {
      const [movedItem] = finishedTasks.splice(source.index, 1);
      finishedTasks.splice(destination.index, 0, movedItem);
      newTaskList = [...ongoingTasks, ...finishedTasks];
    }
  }
  // Case 2: Moving between lists
  else {
    let movedItem;
    // Move from ongoing to finished
    if (source.droppableId === 'ongoing-content') {
      movedItem = ongoingTasks.splice(source.index, 1)[0];
      movedItem.finished = true; // Update status
      finishedTasks.splice(destination.index, 0, movedItem);
    }
    // Move from finished to ongoing
    else {
      movedItem = finishedTasks.splice(source.index, 1)[0];
      movedItem.finished = false; // Update status
      ongoingTasks.splice(destination.index, 0, movedItem);
    }
    newTaskList = [...ongoingTasks, ...finishedTasks];
  }

  setTaskList(newTaskList);
};
```

#### 2.2. Updating the JSX

Next, you need to wrap your lists with the components from `react-beautiful-dnd`.

1.  **Separate task lists**: Before the `return` statement, create two separate arrays for ongoing and finished tasks. This makes rendering and reordering easier.
2.  **Wrap with `<DragDropContext>`**: Wrap your main container with it and pass the `onDragEnd` function.
3.  **Wrap `<ul>` with `<Droppable>`**: Each list (`ongoing-content` and `finished-content`) becomes a droppable area.
4.  **Wrap `<li>` with `<Draggable>`**: Each task item becomes draggable.

Here is how the JSX in your `App.tsx` should be structured:

```tsx
// In App.tsx

// ... other functions

// Add the onDragEnd function here...

// Before the return statement, create these lists
const ongoingTasks = taskList.filter(task => !task.finished);
const finishedTasks = taskList.filter(task => task.finished);

return (
  <DragDropContext onDragEnd={onDragEnd}>
    <dialog /* ... */ >
      {/* ... modal content ... */}
    </dialog>
    <div className="container mx-auto max-w-3xl p-2">
      {/* ... title and add task input ... */}

      {/* Ongoing Tasks List */}
      <div className='flex justify-between items-center mt-4'>
        <h2>할 일 목록</h2>
        <button onClick={clearTask} className='delete'>전체 삭제</button>
      </div>
      <Droppable droppableId="ongoing-content">
        {(provided) => (
          <ul id="ongoing-content" {...provided.droppableProps} ref={provided.innerRef} className='mt-2 px-4'>
            {ongoingTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`border-b-1 last:border-none border-gray-300 p-2 flex justify-between items-center`}
                  >
                    <TaskC index={index} task={task} toggleFinished={toggleFinished} editTask={editTask} removeTask={removeTask} />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      {/* Finished Tasks List */}
      <div className='flex justify-between items-center mt-4'>
        <h2>완료된 할 일 목록</h2>
      </div>
      <Droppable droppableId="finished-content">
        {(provided) => (
          <ul id="finished-content" {...provided.droppableProps} ref={provided.innerRef} className='mt-2 p-4'>
            {finishedTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`border-b-1 last:border-none border-gray-300 p-2 flex justify-between items-center finished`}
                  >
                    <TaskC index={index} task={task} toggleFinished={toggleFinished} editTask={editTask} removeTask={removeTask} />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  </DragDropContext>
);
```

---

### Potential Issues: React.StrictMode

`react-beautiful-dnd` has a known issue with `React.StrictMode`, which is enabled by default in new Vite/Create-React-App projects. It can cause the app to crash.

If you encounter errors, the recommended solution is to switch to a more modern drag-and-drop library like `@dnd-kit/core`, which is fully compatible with React 18+.

---

That's it! After making these changes, you should be able to drag and drop your tasks to reorder them.
