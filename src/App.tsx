import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo List</h1>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.addButton}>
          Add
        </button>
      </div>
      
      <div style={styles.filterContainer}>
        <button 
          onClick={() => setFilter('all')} 
          style={filter === 'all' ? {...styles.filterButton, ...styles.activeFilter} : styles.filterButton}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')} 
          style={filter === 'active' ? {...styles.filterButton, ...styles.activeFilter} : styles.filterButton}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          style={filter === 'completed' ? {...styles.filterButton, ...styles.activeFilter} : styles.filterButton}
        >
          Completed
        </button>
        <button onClick={clearCompleted} style={styles.clearButton}>
          Clear Completed
        </button>
      </div>
      
      <ul style={styles.todoList}>
        {filteredTodos.length === 0 ? (
          <li style={styles.emptyMessage}>No todos to display</li>
        ) : (
          filteredTodos.map((todo) => (
            <li key={todo.id} style={styles.todoItem}>
              <div style={styles.todoContent}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={styles.checkbox}
                />
                <span style={todo.completed ? {...styles.todoText, ...styles.completed} : styles.todoText}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={styles.deleteButton}
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
      
      <div style={styles.footer}>
        <p>{todos.filter(todo => !todo.completed).length} items left</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center' as const,
    color: '#333',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    outline: 'none',
  },
  addButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '16px',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    flexWrap: 'wrap' as const,
  },
  filterButton: {
    padding: '8px 12px',
    backgroundColor: '#f8f8f8',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '2px',
  },
  activeFilter: {
    backgroundColor: '#e6e6e6',
    fontWeight: 'bold' as const,
  },
  clearButton: {
    padding: '8px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '2px',
  },
  todoList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 8px',
    borderBottom: '1px solid #eee',
  },
  todoContent: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
  },
  checkbox: {
    marginRight: '10px',
    cursor: 'pointer',
  },
  todoText: {
    fontSize: '16px',
  },
  completed: {
    textDecoration: 'line-through',
    color: '#888',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#f44336',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    padding: '0 5px',
  },
  footer: {
    marginTop: '15px',
    color: '#666',
    fontSize: '14px',
  },
  emptyMessage: {
    textAlign: 'center' as const,
    color: '#888',
    padding: '20px 0',
  }
};

export default App;