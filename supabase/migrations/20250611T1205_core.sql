create table clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text
);

create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  points integer default 0
);

create type appointment_status as enum ('scheduled','completed','cancelled','no_show');

create table appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  clinic_id uuid references clinics,
  service_id uuid references services,
  scheduled_at timestamptz,
  status appointment_status default 'scheduled',
  created_at timestamptz default now()
);

create table loyalty_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  appointment_id uuid references appointments,
  points integer not null,
  created_at timestamptz default now()
);

alter table appointments enable row level security;
create policy "User appointments"
  on appointments for all
  using (auth.uid() = user_id);

alter table loyalty_points enable row level security;
create policy "User points"
  on loyalty_points for all
  using (auth.uid() = user_id);

create or replace function handle_points()
returns trigger as $$
begin
  if new.status = 'completed' then
    insert into loyalty_points(user_id, appointment_id, points)
    select new.user_id, new.id, s.points from services s where s.id = new.service_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_appointment_points
after update of status on appointments
for each row execute procedure handle_points();
