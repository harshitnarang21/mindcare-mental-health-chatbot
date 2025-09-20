import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthProvider';

interface Post { id: string; content: string; author: string | null; created_at: string }

export default function Community() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, content, author, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) setError(error.message);
      setPosts(data || []);
      setLoading(false);
    })();
  }, []);

  async function publish() {
    if (!text.trim() || !user) return;
    const name = profile?.full_name || 'Anonymous';
    const { data, error } = await supabase
      .from('posts')
      .insert({ content: text.trim(), author: name })
      .select()
      .single();
    if (error) { setError(error.message); return; }
    setPosts((p) => [data as Post, ...p]);
    setText('');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground">Peer space for students. Posts are public to your campus. Avoid sharing identifying details.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Share a thought</CardTitle>
          <CardDescription>Anonymous by default unless you enable profiles later.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder="What’s on your mind?" />
          <div className="flex justify-end">
            <Button onClick={publish}>Post</Button>
          </div>
          {error && (
            <p className="text-sm text-amber-600">{error}. If this mentions missing table, run the SQL in Supabase: CREATE TABLE posts ( id uuid primary key default gen_random_uuid(), content text not null, author text, created_at timestamp with time zone default now()); Enable RLS and policy for anon insert/select.</p>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet. Be the first to share something supportive.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
                <div className="mt-1 whitespace-pre-wrap text-base">{p.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
