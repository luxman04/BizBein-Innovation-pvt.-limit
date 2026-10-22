import { redirect } from 'next/navigation';

export default function RegisterPage({ searchParams }) {
  const query = new URLSearchParams(searchParams || {});
  query.set('mode', 'register');
  redirect(`/login?${query.toString()}`);
}
