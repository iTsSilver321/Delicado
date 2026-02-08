-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  price integer not null, -- stored in cents
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders Table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_email text,
  status text check (status in ('pending', 'paid', 'shipped', 'cancelled')) default 'pending',
  total integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items Table (relates products to orders with customizations)
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity integer default 1,
  customization_details jsonb, -- stores { text: "Name", font: "Serif", color: "Red" }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Data
insert into products (slug, name, description, price, image_url) values
(
  'bedding',
  'Luxury Satin Pillowcase',
  'Experience the ultimate in comfort and style with our premium satin embroidery collection. Gentle on hair and skin.',
  4500,
  'https://images.unsplash.com/photo-1576426863848-c2185fc6e941?q=80&w=2940&auto=format&fit=crop'
),
(
  'clothing',
  'Premium Cotton Robe',
  'Wrap yourself in luxury with our personalized cotton robes. Perfect for lounging or post-bath comfort.',
  8500,
  'https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2000&auto=format&fit=crop'
),
(
  'tableware',
  'Personalized Table Runner',
  'Elevate your dining experience with a custom embroidered table runner. A timeless addition to any home.',
  6000,
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2000&auto=format&fit=crop'
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Policies
-- Everyone can read products
create policy "Products are viewable by everyone" on products for select using (true);

-- Anyone can insert orders (for now, usually authenticated users only)
create policy "Anyone can create orders" on orders for insert with check (true);
create policy "Anyone can create order items" on order_items for insert with check (true);
