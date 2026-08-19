USE hireconnect;

ALTER TABLE users
ADD COLUMN resume_file VARCHAR(500) NULL AFTER profile_image;
