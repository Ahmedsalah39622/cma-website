-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for FAQs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for FAQs
CREATE POLICY "Public FAQs are viewable by everyone" ON faqs
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete FAQs
CREATE POLICY "Authenticated users can manage FAQs" ON faqs
    FOR ALL USING (auth.role() = 'authenticated');


-- Create Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    excerpt text,
    color text,
    read_time text,
    content text,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Blog Posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for Blog Posts
CREATE POLICY "Public Blog Posts are viewable by everyone" ON blog_posts
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to manage Blog Posts
CREATE POLICY "Authenticated users can manage Blog Posts" ON blog_posts
    FOR ALL USING (auth.role() = 'authenticated');
