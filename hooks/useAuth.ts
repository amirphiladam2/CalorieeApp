import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type UseAuthReturn = {
  loading: boolean;
  session: Session | null;
  user: User | null;
};

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession ?? null);
      }
    );

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;

  return { loading, session, user };
}
