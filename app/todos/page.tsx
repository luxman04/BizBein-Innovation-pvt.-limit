import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function TodosPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from('todos').select();

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Supabase Todos</h1>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <ul>
        {todos?.map((todo: any) => (
          <li key={todo.id}>{todo.name || todo.title || JSON.stringify(todo)}</li>
        ))}
      </ul>
      {(!todos || todos.length === 0) && !error && (
        <p style={{ color: '#666' }}>No todos found. Connected to Supabase successfully.</p>
      )}
    </div>
  );
}
