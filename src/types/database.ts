// Auto-generatable from Supabase. In production, run:
//   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
// This hand-written copy mirrors supabase/schema.sql.

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string | null;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  due_time: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  reminder_at: string | null;
  recurrence: TaskRecurrence;
  order_index: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithRelations extends Task {
  category: Category | null;
  tags: Tag[];
}

export interface TaskTag {
  task_id: string;
  tag_id: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  body: string;
  pinned: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyInsight {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  summary: string;
  recommendations: string[];
  model: string;
  task_count: number;
  generated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> };
      categories: { Row: Category; Insert: Omit<Category, 'id' | 'created_at'> & { id?: string }; Update: Partial<Category> };
      tags: { Row: Tag; Insert: Omit<Tag, 'id' | 'created_at'> & { id?: string }; Update: Partial<Tag> };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'> & { id?: string };
        Update: Partial<Task>;
      };
      task_tags: { Row: TaskTag; Insert: TaskTag; Update: Partial<TaskTag> };
      push_subscriptions: {
        Row: PushSubscription;
        Insert: Omit<PushSubscription, 'id' | 'created_at'> & { id?: string };
        Update: Partial<PushSubscription>;
      };
      notes: {
        Row: Note;
        Insert: Omit<Note, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Note>;
      };
      weekly_insights: {
        Row: WeeklyInsight;
        Insert: Omit<WeeklyInsight, 'id' | 'generated_at'> & { id?: string };
        Update: Partial<WeeklyInsight>;
      };
    };
  };
}
