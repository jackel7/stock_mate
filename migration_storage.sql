-- Create a storage bucket for product images
-- Note: This requires the storage extension which is enabled by default in Supabase
-- If running in SQL Editor, making it public is easiest for this use case

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Set up security policies to allow public access (viewing)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- Allow authenticated users to upload images
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'product-images' );

-- Allow authenticated users to update their images
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'product-images' );

-- Allow authenticated users to delete their images
create policy "Authenticated Delete"
on storage.objects for delete
using ( bucket_id = 'product-images' );
