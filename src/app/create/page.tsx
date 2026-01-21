import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { CreateMixtapeClient } from './client';

export default async function CreatePage() {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/spotify');
  }

  return <CreateMixtapeClient />;
}
