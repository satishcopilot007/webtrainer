-- TrainerMentors Database Schema
-- MySQL 8.0+ Compatible
-- For Hostinger Hosting

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20),
    `role` ENUM('student', 'mentor', 'admin') DEFAULT 'student',
    `profile_image` VARCHAR(255),
    `bio` LONGTEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_email` (`email`),
    KEY `idx_role` (`role`),
    KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `course_type` ENUM('tech', 'non-tech') NOT NULL DEFAULT 'tech',
    `description` TEXT,
    `image` VARCHAR(255),
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_active` (`is_active`),
    KEY `idx_course_type` (`course_type`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- COURSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `courses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `description` LONGTEXT NOT NULL,
    `category_id` INT,
    `mentor_id` INT NOT NULL,
    `price` DECIMAL(10, 2) DEFAULT 0.00,
    `duration_weeks` INT DEFAULT 8,
    `level` VARCHAR(50) DEFAULT 'all-levels',
    `mode` VARCHAR(255) DEFAULT 'Online, Classroom, Hybrid',
    `certification` VARCHAR(500),
    `batch_options` VARCHAR(255) DEFAULT 'Weekday / Weekend / Flexible',
    `locations` TEXT,
    `max_students` INT DEFAULT 50,
    `current_students` INT DEFAULT 0,
    `thumbnail` VARCHAR(255),
    `rating` FLOAT DEFAULT 4.5,
    `total_reviews` INT DEFAULT 50,
    `is_free_tutorial` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
    FOREIGN KEY (`mentor_id`) REFERENCES `users`(`id`),
    KEY `idx_active` (`is_active`),
    KEY `idx_free_tutorial` (`is_free_tutorial`, `is_active`),
    KEY `idx_category` (`category_id`),
    KEY `idx_mentor` (`mentor_id`),
    KEY `idx_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- COURSE MODULES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `course_modules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `course_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `sequence` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    KEY `idx_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- LESSONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `lessons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `module_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` LONGTEXT,
    `content` LONGTEXT,
    `video_url` VARCHAR(255),
    `sequence` INT DEFAULT 0,
    `duration_minutes` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`module_id`) REFERENCES `course_modules`(`id`) ON DELETE CASCADE,
    KEY `idx_module` (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ENROLLMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `enrollments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `completion_date` DATE,
    `status` ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    `progress_percentage` INT DEFAULT 0,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`),
    KEY `idx_student` (`student_id`),
    KEY `idx_course` (`course_id`),
    UNIQUE KEY `uq_student_course` (`student_id`, `course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- PAYMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `payments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` ENUM('razorpay', 'paypal', 'card') DEFAULT 'razorpay',
    `transaction_id` VARCHAR(255),
    `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`),
    KEY `idx_student` (`student_id`),
    KEY `idx_status` (`status`),
    KEY `idx_transaction` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `rating` INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    `comment` LONGTEXT,
    `is_approved` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`),
    KEY `idx_course` (`course_id`),
    KEY `idx_approved` (`is_approved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TESTIMONIALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `testimonials` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `title` VARCHAR(255),
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(255),
    `is_approved` BOOLEAN DEFAULT FALSE,
    `featured` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`),
    KEY `idx_approved` (`is_approved`),
    KEY `idx_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BLOG POSTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `blog_posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `author_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `content` LONGTEXT NOT NULL,
    `thumbnail` VARCHAR(255),
    `category` VARCHAR(100),
    `views` INT DEFAULT 0,
    `is_published` BOOLEAN DEFAULT FALSE,
    `published_at` DATETIME,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`author_id`) REFERENCES `users`(`id`),
    KEY `idx_published` (`is_published`),
    KEY `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- LEADS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `leads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20),
    `course_interested` VARCHAR(255),
    `message` LONGTEXT,
    `source` VARCHAR(100),
    `status` ENUM('new', 'contacted', 'qualified', 'lost') DEFAULT 'new',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_status` (`status`),
    KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- FEEDBACK REVIEW QUEUE
-- Contains public submissions and administrator-managed feedback records.
-- =============================================
CREATE TABLE IF NOT EXISTS `admin_feedback` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30),
    `course_id` INT,
    `subject` VARCHAR(255),
    `message` TEXT NOT NULL,
    `rating` TINYINT UNSIGNED,
    `status` ENUM('new', 'reviewed', 'resolved') NOT NULL DEFAULT 'new',
    `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_admin_feedback_status` (`status`),
    KEY `idx_admin_feedback_course` (`course_id`),
    KEY `idx_admin_feedback_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ADMIN AUDIT LOG TABLE
-- Intentionally has no foreign key so historical audit records survive user changes.
-- =============================================
CREATE TABLE IF NOT EXISTS `admin_audit_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `admin_user_id` INT NOT NULL,
    `action` VARCHAR(64) NOT NULL,
    `entity_type` VARCHAR(64) NOT NULL,
    `entity_id` INT,
    `details` LONGTEXT,
    `ip_address` VARCHAR(45),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_admin_audit_admin` (`admin_user_id`),
    KEY `idx_admin_audit_entity` (`entity_type`, `entity_id`),
    KEY `idx_admin_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- PLACEMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `placements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `position` VARCHAR(255) NOT NULL,
    `salary` DECIMAL(12, 2),
    `placement_date` DATE,
    `is_verified` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`),
    KEY `idx_verified` (`is_verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create 3 main categories
INSERT INTO `categories` (id, name, slug, description, is_active) VALUES
(1, 'Corporate Courses', 'corporate', 'HR & Management, SAP, CRM & ERP, Language & Soft Skills, Project Management - Corporate training for professionals', 1),
(2, 'Technical Courses', 'technical', 'Software Development, Data Science & AI, Cloud Computing, Cyber Security, Full Stack, Big Data - Industry-leading technical training', 1),
(3, 'Non-Technical Courses', 'non-technical', 'Digital Marketing, Graphic Design, UI/UX Design, Job-Oriented Programs - Creative and marketing courses', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug);

-- Add indexes for better performance
CREATE INDEX idx_course_enrollment ON enrollments(course_id);
CREATE INDEX idx_course_payments ON payments(course_id);
CREATE INDEX idx_created_at ON courses(created_at);
CREATE INDEX idx_lesson_module ON lessons(module_id);
