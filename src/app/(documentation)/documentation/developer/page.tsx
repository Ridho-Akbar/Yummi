import Link from "next/link";
import { ArrowLeft, AlertCircle, Lock, Database } from "lucide-react";
import { CollapsibleCode } from "../_components/CollapsibleCode";

export const metadata = {
  title: "Developer Documentation — Yumm!",
  description:
    "Panduan setup, query SQL penting, dan konfigurasi untuk developer Yumm!.",
};

const ENV_VARIABLES = `NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
IP_HASH_SALT=string-acak-panjang
NEXT_PUBLIC_SITE_URL=https://yummi.vercel.app
TELEGRAM_BOT_TOKEN=7234567890:AAH...
TELEGRAM_CHAT_ID=123456789`;

const SETUP_SQL = `-- ============================================
-- YUMM! SETUP SQL
-- Jalankan semua blok ini di Supabase SQL Editor
-- pada project yang baru. Urutan penting, jangan diubah.
-- ============================================

-- 1. TABEL DASAR
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  image_url text,
  is_available boolean default true,
  ready_stock integer default 0 check (ready_stock >= 0),
  daily_capacity integer not null default 0 check (daily_capacity >= 0),
  min_order_qty integer not null default 1 check (min_order_qty >= 1),
  created_at timestamptz default now()
);

create table public.schedule (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  is_available boolean default true,
  note text
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text,
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  order_date date not null,
  items jsonb not null,
  total numeric not null check (total >= 0),
  status text default 'pending' check (status in ('pending', 'confirmed', 'done', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'dp', 'paid')),
  amount_paid numeric not null default 0 check (amount_paid >= 0),
  note text,
  is_anonymous boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table public.order_rate_limit (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  created_at timestamptz default now()
);

create table public.password_attempts (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  success boolean not null default false,
  created_at timestamptz default now()
);

create table public.order_status_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  from_status text not null,
  to_status text not null,
  changed_by uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

create table public.order_payment_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  from_status text,
  to_status text not null,
  from_amount numeric,
  to_amount numeric not null,
  changed_by uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

create table public.role_change_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  changed_by uuid references auth.users on delete set null,
  old_role text not null,
  new_role text not null,
  created_at timestamptz default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('new_order', 'admin_promoted', 'admin_demoted', 'system')),
  title text not null,
  body text,
  link_url text,
  is_read boolean not null default false,
  created_at timestamptz default now()
);

create table public.capacity_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products on delete cascade,
  order_date date not null,
  notified_at timestamptz default now(),
  unique (product_id, order_date)
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table public.homepage_pins (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('latest', 'terlaris', 'best_seller')),
  product_id uuid not null references public.products on delete cascade,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  unique (category, product_id)
);

create table public.settings_audit_logs (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  changed_by uuid references auth.users on delete set null,
  action text not null,
  created_at timestamptz default now()
);

-- 2. INDEX
create index orders_order_date_idx on public.orders (order_date);
create index orders_status_idx on public.orders (status);
create index orders_created_at_idx on public.orders (created_at desc);
create index orders_deleted_at_idx on public.orders (deleted_at) where deleted_at is null;
create index orders_payment_status_idx on public.orders (payment_status) where deleted_at is null;
create index order_rate_limit_ip_hash_idx on public.order_rate_limit (ip_hash, created_at desc);
create index password_attempts_ip_hash_idx on public.password_attempts (ip_hash, created_at desc);
create index order_status_logs_order_id_idx on public.order_status_logs (order_id, created_at desc);
create index order_payment_logs_order_id_idx on public.order_payment_logs (order_id, created_at desc);
create index role_change_logs_created_at_idx on public.role_change_logs (created_at desc);
create index role_change_logs_user_id_idx on public.role_change_logs (user_id);
create index notifications_unread_idx on public.notifications (created_at desc) where is_read = false;
create index notifications_created_at_idx on public.notifications (created_at desc);
create index capacity_alerts_product_date_idx on public.capacity_alerts (product_id, order_date);
create index faqs_sort_order_idx on public.faqs (sort_order, created_at);
create index social_links_sort_order_idx on public.social_links (sort_order, created_at);
create index homepage_pins_category_idx on public.homepage_pins (category, sort_order);
create index settings_audit_logs_created_at_idx on public.settings_audit_logs (created_at desc);
create index settings_audit_logs_key_idx on public.settings_audit_logs (key, created_at desc);`;

const TRIGGER_HELPER_SQL = `-- 3. TRIGGER DAN HELPER

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;

create function public.is_superadmin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin'
  );
$$;

create or replace function public.generate_order_code()
returns trigger
language plpgsql
as $$
declare
  v_prefix text;
  v_counter int;
begin
  v_prefix := 'YUM-' || to_char(coalesce(new.created_at, now()), 'YYYYMM') || '-';

  perform pg_advisory_xact_lock(hashtext(v_prefix));

  select coalesce(max(
    case
      when substring(order_code from length(v_prefix) + 1) ~ '^\\d+$'
      then substring(order_code from length(v_prefix) + 1)::int
      else 0
    end
  ), 0) + 1
  into v_counter
  from public.orders
  where order_code like v_prefix || '%';

  new.order_code := v_prefix || lpad(v_counter::text, 4, '0');
  return new;
end;
$$;

create trigger generate_order_code_trigger
before insert on public.orders
for each row
when (new.order_code is null)
execute function public.generate_order_code();

alter table public.orders alter column order_code set not null;
create unique index if not exists orders_order_code_idx on public.orders (order_code);`;

const RLS_SQL = `-- 4. RLS POLICIES

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.schedule enable row level security;
alter table public.orders enable row level security;
alter table public.order_rate_limit enable row level security;
alter table public.password_attempts enable row level security;
alter table public.order_status_logs enable row level security;
alter table public.order_payment_logs enable row level security;
alter table public.role_change_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.capacity_alerts enable row level security;
alter table public.site_settings enable row level security;
alter table public.faqs enable row level security;
alter table public.social_links enable row level security;
alter table public.homepage_pins enable row level security;
alter table public.settings_audit_logs enable row level security;

-- Profiles
create policy "Users view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admin view all profiles" on public.profiles
  for select using (public.is_admin());

-- Products
create policy "Public view available products" on public.products
  for select using (is_available = true);
create policy "Admin full access products" on public.products
  for all using (public.is_admin());

-- Schedule
create policy "Public view schedule" on public.schedule
  for select using (true);
create policy "Admin full access schedule" on public.schedule
  for all using (public.is_admin());

-- Orders
create policy "Anyone create order" on public.orders
  for insert with check (true);
create policy "Users view own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Admin full access orders" on public.orders
  for all using (public.is_admin());

-- Logs
create policy "Admin view all order logs" on public.order_status_logs
  for select using (public.is_admin());
create policy "Admin view all payment logs" on public.order_payment_logs
  for select using (public.is_admin());
create policy "Admin view all role logs" on public.role_change_logs
  for select using (public.is_admin());
create policy "Admin view all capacity alerts" on public.capacity_alerts
  for all using (public.is_admin());

-- Notifications
create policy "Admin view all notifications" on public.notifications
  for select using (public.is_admin());
create policy "Admin insert notifications" on public.notifications
  for insert with check (public.is_admin());
create policy "Admin update notifications" on public.notifications
  for update using (public.is_admin());
create policy "Admin delete notifications" on public.notifications
  for delete using (public.is_admin());

-- Site Settings
create policy "Public read site settings" on public.site_settings
  for select using (true);
create policy "Admin write site settings" on public.site_settings
  for all using (public.is_admin());

-- FAQs
create policy "Public read active faqs" on public.faqs
  for select using (is_active = true);
create policy "Admin full access faqs" on public.faqs
  for all using (public.is_admin());

-- Social Links
create policy "Public read active social links" on public.social_links
  for select using (is_active = true);
create policy "Admin full access social links" on public.social_links
  for all using (public.is_admin());

-- Homepage Pins
create policy "Admin full access homepage pins" on public.homepage_pins
  for all using (public.is_admin());

-- Settings Audit Logs
create policy "Admin view settings audit logs" on public.settings_audit_logs
  for select using (public.is_admin());
create policy "Admin insert settings audit logs" on public.settings_audit_logs
  for insert with check (public.is_admin());`;

const SEED_DATA_SQL = `-- 5. DATA AWAL (SITE SETTINGS)

insert into public.site_settings (key, value) values
  ('store_info', '{
    "name": "Yumm!",
    "tagline": "Pre-order makanan viral",
    "address": "",
    "phone": "",
    "email": "",
    "hours": ""
  }'::jsonb),
  ('hero', '{
    "tagline": "Pesan makanan viral buat acara spesialmu",
    "subtitle": "Dibuat segar untuk setiap acara. Pre-order online, konfirmasi cepat lewat WhatsApp."
  }'::jsonb),
  ('why_choose', '[
    {"title": "Cepat", "desc": "Pesananmu dikonfirmasi dalam hitungan jam."},
    {"title": "Amanah", "desc": "Setiap pesanan dibuat sesuai permintaan."},
    {"title": "Disiplin", "desc": "Tepat waktu, tepat jumlah, tepat tanggal."}
  ]'::jsonb),
  ('how_to_order', '[
    {"title": "Pilih Produk", "desc": "Tentukan makanan dan jumlah yang kamu mau."},
    {"title": "Isi Data", "desc": "Lengkapi nama, nomor WhatsApp, dan alamat."},
    {"title": "Pilih Tanggal", "desc": "Tentukan tanggal acara. Admin akan konfirmasi."}
  ]'::jsonb),
  ('whatsapp', '{"url": "", "floatingEnabled": false}'::jsonb),
  ('footer', '{"tagline": "", "copyright": ""}'::jsonb),
  ('homepage_config', '{"latestCount": 2, "terlarisCount": 2, "bestSellerCount": 2}'::jsonb),
  ('order_access', '{"passwordHash": "", "updatedAt": null, "updatedBy": null}'::jsonb)
on conflict (key) do nothing;`;

const SET_SUPERADMIN_SQL = `-- Set superadmin pertama
-- WAJIB dijalankan setelah user login minimal sekali lewat Google,
-- supaya baris di tabel profiles sudah terbentuk.

update public.profiles
set role = 'superadmin'
where id = (
  select id from auth.users
  where email = 'GANTI-DENGAN-EMAIL-ANDA@gmail.com'
);

-- Verifikasi
select u.email, p.role
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'superadmin';`;

const RECOVERY_SQL = `-- Recovery: kalau superadmin terkunci atau semua superadmin hilang.
-- Jalankan ini di SQL Editor, hanya bisa dilakukan oleh
-- yang punya akses ke dashboard Supabase.

-- 1. Cek siapa saja yang saat ini superadmin
select u.email, p.display_name, p.role, p.created_at
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'superadmin';

-- 2. Kalau semua superadmin hilang, promote satu user
--    ke superadmin lewat emailnya.
update public.profiles
set role = 'superadmin'
where id = (
  select id from auth.users
  where email = 'email-yang-mau-dipromote@gmail.com'
);

-- 3. Kalau akun tertentu terkunci, reset role-nya ke user
update public.profiles
set role = 'user'
where id = (
  select id from auth.users
  where email = 'email-yang-mau-direset@gmail.com'
);

-- 4. Kalau butuh tambah kolom di tabel:
--    contoh: menambah min_order_qty di products
alter table public.products
  add column if not exists min_order_qty integer not null default 1
  check (min_order_qty >= 1);`;

const STORAGE_SQL = `-- Storage sudah disetup di migrasi awal dengan bucket
-- bernama "product-images". Policy sudah otomatis berlaku.
--
-- Untuk menaikkan limit ukuran file (default gratis Supabase: 50 MB per file),
-- buka Supabase Dashboard -> Storage -> Settings.
-- Perubahan limit hanya bisa lewat dashboard, bukan SQL.
--
-- Untuk mengecek penggunaan storage:
select
  bucket_id,
  count(*) as file_count,
  pg_size_pretty(sum((metadata->>'size')::bigint)) as total_size
from storage.objects
where bucket_id = 'product-images'
group by bucket_id;`;

const ESSENTIAL_QUERIES_SQL = `-- Query-query penting untuk operasional lanjutan.

-- 1. Lihat semua admin dan superadmin
select u.email, p.display_name, p.role
from public.profiles p
join auth.users u on u.id = p.id
where p.role in ('admin', 'superadmin')
order by p.role, p.created_at;

-- 2. Cek pesanan yang belum lunas dan sudah lewat
select order_code, customer_name, customer_phone, order_date, total, payment_status, amount_paid
from public.orders
where payment_status != 'paid'
  and status in ('confirmed', 'done')
  and order_date < current_date
  and deleted_at is null
order by order_date;

-- 3. Riwayat perubahan role 30 hari terakhir
select
  l.created_at,
  u.email as target_user,
  l.old_role,
  l.new_role,
  cu.email as changed_by
from public.role_change_logs l
left join auth.users u on u.id = l.user_id
left join auth.users cu on cu.id = l.changed_by
where l.created_at >= now() - interval '30 days'
order by l.created_at desc;

-- 4. Riwayat perubahan pengaturan (dari audit log)
select
  l.created_at,
  l.key,
  l.action,
  u.email as changed_by
from public.settings_audit_logs l
left join auth.users u on u.id = l.changed_by
order by l.created_at desc
limit 50;

-- 5. Restore pesanan yang salah dihapus
update public.orders
set deleted_at = null
where order_code = 'YUM-202610-0042';

-- 6. Cek penggunaan rate limit password
select
  count(*) filter (where success = false) as failed,
  count(*) filter (where success = true) as succeeded,
  count(distinct ip_hash) as unique_ips
from public.password_attempts
where created_at >= now() - interval '15 minutes';

-- 7. Bersihkan data lama secara manual
delete from public.password_attempts where created_at < now() - interval '24 hours';
delete from public.order_rate_limit where created_at < now() - interval '24 hours';
delete from public.notifications where is_read = true and created_at < now() - interval '30 days';`;

const PGCRON_SQL = `-- Setup pg_cron untuk membersihkan tabel secara otomatis.
-- Jalankan di SQL Editor.

-- 1. Aktifkan ekstensi pg_cron
-- Buka Supabase Dashboard -> Database -> Extensions,
-- cari "pg_cron" dan aktifkan.

-- 2. Jadwalkan cleanup rate limit dan notifikasi lama
select cron.schedule(
  'cleanup-password-attempts',
  '0 3 * * *',
  $$delete from public.password_attempts where created_at < now() - interval '24 hours'$$
);

select cron.schedule(
  'cleanup-order-rate-limit',
  '5 3 * * *',
  $$delete from public.order_rate_limit where created_at < now() - interval '24 hours'$$
);

select cron.schedule(
  'cleanup-old-notifications',
  '10 3 * * *',
  $$delete from public.notifications where is_read = true and created_at < now() - interval '30 days'$$
);

-- 3. Cek job yang terjadwal
select jobname, schedule, command
from cron.job
order by jobname;`;

export default function DeveloperDocumentationPage() {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-yumm-pink"
          >
            Yumm!
          </Link>
          <Link
            href="/documentation/features"
            className="inline-flex items-center gap-1.5 rounded-yumm px-4 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Fitur
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-yumm-pink">
            Untuk Developer
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Panduan Setup dan Query Penting
          </h1>
          <p className="mt-4 text-base text-ink-muted">
            Halaman ini berisi semua langkah untuk setup Yumm! dari nol,
            query SQL penting untuk operasional lanjutan, dan cara-cara
            recovery kalau ada masalah. Klik setiap judul untuk membuka
            detail.
          </p>
        </div>

        <div className="mb-8 rounded-yumm-lg border border-yumm-lemon/40 bg-yumm-lemon/10 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-yumm-coral"
            />
            <div className="text-sm text-ink">
              <p className="font-semibold">Baca dulu sebelum mulai.</p>
              <p className="mt-1 text-ink-muted">
                Setup butuh akses ke Supabase SQL Editor dan sedikit
                pemahaman database. Kalau kamu bukan developer, minta
                bantuan developer untuk setup awal. Setelah setup selesai,
                operasional harian sepenuhnya bisa dilakukan lewat dashboard
                admin.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <CollapsibleCode
            title="1. Environment Variables"
            description="Semua variabel yang dibutuhkan untuk menjalankan aplikasi."
            code={ENV_VARIABLES}
            language="bash"
          />

          <CollapsibleCode
            title="2. Setup Database — Tabel dan Index"
            description="Buat semua tabel dan index. Jalankan sekali di awal setup."
            code={SETUP_SQL}
            language="sql"
          />

          <CollapsibleCode
            title="3. Setup Database — Trigger dan Helper Function"
            description="Fungsi Postgres yang dipakai untuk generate kode pesanan dan cek role."
            code={TRIGGER_HELPER_SQL}
            language="sql"
          />

          <CollapsibleCode
            title="4. Setup Database — RLS Policies"
            description="Keamanan baris data. Wajib dijalankan agar data tidak bisa diakses sembarangan."
            code={RLS_SQL}
            language="sql"
          />

          <CollapsibleCode
            title="5. Setup Database — Data Awal"
            description="Pengaturan default untuk halaman depan."
            code={SEED_DATA_SQL}
            language="sql"
          />

          <CollapsibleCode
            title="6. Set Superadmin Pertama"
            description="Hanya bisa dilakukan lewat SQL. Jalankan setelah login Google pertama kali."
            code={SET_SUPERADMIN_SQL}
            language="sql"
          />

          <CollapsibleCode
            title="7. Recovery dan Pemulihan"
            description="Kalau superadmin hilang, salah hapus, atau perlu ubah skema."
            code={RECOVERY_SQL}
            language="sql"
          />

          <CollapsibleCode
            title="8. Query Penting untuk Operasional"
            description="Query yang mungkin dibutuhkan untuk audit, laporan, atau cleanup manual."
            code={ESSENTIAL_QUERIES_SQL}
            language="sql"
          />

          <CollapsibleCode
            title="9. Cara Menambah Ukuran Storage Gambar"
            description="Menambah limit upload dan cek penggunaan storage."
            code={STORAGE_SQL}
            language="sql"
          />

          <CollapsibleCode
            title="10. Setup pg_cron untuk Cleanup Otomatis"
            description="Bersihkan rate limit dan notifikasi lama secara otomatis."
            code={PGCRON_SQL}
            language="sql"
          />
        </div>

        <div className="mt-12 rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yumm-lilac/15 text-yumm-lilac">
              <Lock size={18} strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink">
                Catatan Keamanan
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                <li className="flex gap-2">
                  <span className="text-yumm-pink">•</span>
                  <span>
                    <code className="rounded bg-surface-muted px-1">
                      SUPABASE_SERVICE_ROLE_KEY
                    </code>{" "}
                    bypass RLS. Jangan pernah commit ke Git atau ekspos ke
                    client.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yumm-pink">•</span>
                  <span>
                    Rotasi service role key segera setelah serah terima ke
                    pembeli, dan setiap 6 bulan sekali sebagai praktik
                    keamanan.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yumm-pink">•</span>
                  <span>
                    Autentikasi dua faktor (2FA) belum diimplementasi.
                    Untuk penggunaan enterprise, pertimbangkan menambahkan
                    TOTP untuk akun superadmin.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yumm-pink">•</span>
                  <span>
                    Backup otomatis hanya mengandalkan Supabase. Untuk
                    keamanan tambahan, lakukan ekspor manual ke CSV setiap
                    bulan.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yumm-pink">•</span>
                  <span>
                    CSP header aktif. Kalau menambahkan domain eksternal
                    (analytics, gambar dari CDN baru), update{" "}
                    <code className="rounded bg-surface-muted px-1">
                      next.config.ts
                    </code>{" "}
                    di bagian{" "}
                    <code className="rounded bg-surface-muted px-1">
                      connect-src
                    </code>
                    .
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-yumm-lg border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yumm-mint/30 text-emerald-700">
              <Database size={18} strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink">
                Perlu Bantuan?
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                Untuk pertanyaan teknis, pemulihan data, atau perubahan
                skema database, hubungi developer yang mengerjakan project
                ini. Kontak bisa ditemukan di dokumen serah terima.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/documentation/features"
            className="inline-flex items-center gap-2 rounded-full border-2 border-yumm-pink/30 bg-white px-6 py-3 font-display text-sm font-semibold text-yumm-pink transition-all hover:-translate-y-0.5 hover:border-yumm-pink hover:bg-yumm-pink hover:text-white"
          >
            Lihat Fitur Yumm!
          </Link>
        </div>
      </main>

      <footer className="border-t border-neutral-100 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-yumm-pink"
          >
            Yumm!
          </Link>
          <p className="mt-2 text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} Yumm! All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}