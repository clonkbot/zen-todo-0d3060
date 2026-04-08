import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Breathe deeply', completed: false, createdAt: Date.now() },
    { id: '2', text: 'Find stillness', completed: false, createdAt: Date.now() - 1000 },
  ]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos(prev => [newTodo, ...prev]);
    setInputValue('');
  }, [inputValue]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="min-h-dvh bg-[#f7f3ed] relative overflow-hidden flex flex-col">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ensō circle - zen symbol */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
        <svg width="600" height="600" viewBox="0 0 200 200" className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px]">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="450 50"
            transform="rotate(-45 100 100)"
          />
        </svg>
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full max-w-lg mx-auto px-6 md:px-8 py-12 md:py-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-[#2a2a2a] tracking-tight mb-2">
            Today
          </h1>
          <p className="text-[#8a8580] text-sm tracking-wide font-light">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.header>

        {/* Add Todo Form */}
        <motion.form
          onSubmit={addTodo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10 md:mb-14"
        >
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What needs your attention?"
              className="w-full bg-transparent border-b-2 border-[#d4cfc6] focus:border-[#3d4f7c] py-4 text-lg text-[#2a2a2a] placeholder:text-[#b8b3aa] outline-none transition-colors duration-300 font-light"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#3d4f7c] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
              aria-label="Add task"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </motion.button>
          </div>
        </motion.form>

        {/* Active Todos */}
        <div className="space-y-1 mb-10 flex-1">
          <AnimatePresence mode="popLayout">
            {activeTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: 20,
                  filter: 'blur(8px)',
                  transition: { duration: 0.4 }
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="group"
              >
                <div className="flex items-start gap-4 py-4 border-b border-[#e8e4dd]">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="mt-0.5 w-6 h-6 rounded-full border-2 border-[#c4bfb6] hover:border-[#3d4f7c] flex-shrink-0 transition-colors duration-200 flex items-center justify-center"
                    aria-label="Complete task"
                  >
                    <motion.svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className="opacity-0 group-hover:opacity-100 text-[#3d4f7c] transition-opacity"
                    >
                      <path
                        d="M2 6l3 3 5-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </button>
                  <span className="text-[#2a2a2a] text-lg font-light leading-relaxed flex-1">
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#b8b3aa] hover:text-[#8a6b5a] transition-all duration-200 p-1"
                    aria-label="Delete task"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {activeTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <p className="text-[#b8b3aa] text-lg font-light italic">
                A clear mind, a clear day
              </p>
            </motion.div>
          )}
        </div>

        {/* Completed Section */}
        {completedTodos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-auto pt-8 border-t border-[#e8e4dd]"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#a8a39a] mb-4">
              Completed
            </h2>
            <AnimatePresence>
              {completedTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-4 py-3 group"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="w-6 h-6 rounded-full bg-[#d4cfc6] flex-shrink-0 flex items-center justify-center"
                    aria-label="Uncomplete task"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" className="text-[#f7f3ed]">
                      <path
                        d="M2 6l3 3 5-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <span className="text-[#a8a39a] line-through text-lg font-light flex-1">
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#c4bfb6] hover:text-[#8a6b5a] transition-all duration-200 p-1"
                    aria-label="Delete task"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center">
        <p className="text-[#b8b3aa] text-xs tracking-wide font-light">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}

export default App;
