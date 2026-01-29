-- Enable the storage extension if not enabled (usually enabled by default)
-- Create 'portfolio' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Create 'team' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('team', 'team', true)
ON CONFLICT (id) DO NOTHING;

-- Create 'brands' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('brands', 'brands', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow Public Read (View) for everyone
CREATE POLICY "Public Read Portfolio"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

CREATE POLICY "Public Read Team"
ON storage.objects FOR SELECT
USING ( bucket_id = 'team' );

CREATE POLICY "Public Read Brands"
ON storage.objects FOR SELECT
USING ( bucket_id = 'brands' );

-- Policy: Allow Uploads (Insert) for everyone (WARNING: For development only)
-- Ideally, you should restrict this to authenticated users.
CREATE POLICY "Public Upload Portfolio"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'portfolio' );

CREATE POLICY "Public Upload Team"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'team' );

CREATE POLICY "Public Upload Brands"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'brands' );

-- Policy: Allow Deletes
CREATE POLICY "Public Delete Portfolio"
ON storage.objects FOR DELETE
USING ( bucket_id = 'portfolio' );

CREATE POLICY "Public Delete Team"
ON storage.objects FOR DELETE
USING ( bucket_id = 'team' );

CREATE POLICY "Public Delete Brands"
ON storage.objects FOR DELETE
USING ( bucket_id = 'brands' );
