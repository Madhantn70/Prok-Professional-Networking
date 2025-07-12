-- Add missing columns to post table
ALTER TABLE post ADD COLUMN category VARCHAR(100);
ALTER TABLE post ADD COLUMN tags VARCHAR(300); 