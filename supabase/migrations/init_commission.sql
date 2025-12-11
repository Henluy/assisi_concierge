-- Create merchants table
create table merchants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null, -- 'restaurant', 'hotel', 'experience'
  email text unique not null,
  commission_rate float default 0.10, -- 10%
  created_at timestamptz default now()
);

-- Create referrals table
create table referrals (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid references merchants(id),
  user_id text, -- Telegram User ID or Session ID
  amount float, -- Estimated interaction value or booking fee
  status text default 'pending', -- 'pending', 'paid', 'cancelled'
  created_at timestamptz default now()
);

-- Create conversations log (optional, for analytics)
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  intent text,
  message_count int default 1,
  created_at timestamptz default now()
);

-- RLS Policies (Simple for MVP)
alter table merchants enable row level security;
alter table referrals enable row level security;
alter table conversations enable row level security;

-- Public read access for demo purposes (so API can query)
create policy "Enable read access for all users" on merchants for select using (true);
create policy "Enable insert for all users" on referrals for insert with check (true);
create policy "Enable insert for all users" on conversations for insert with check (true);
