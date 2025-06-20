import { useState } from 'react'

type Todo = {
  id: number;
  text: string;
  finished: boolean;
}


function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  return (
    <>
    <div>
      <h1>todo app</h1>
      <h2>할 일 추가</h2>
      <input type="text" placeholder='추가할 일을 입력하세요'/>
      <h2>할 일 목록</h2>
      <ul id="content">
        {todoList.map((todo, index)=>{
          return <li key={todo.id} className={todo.finished ? 'finished' : ''}>{todo.text}</li>
        })}
      </ul>
    </div>
    </>
  )
}

export default App
