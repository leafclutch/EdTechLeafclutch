export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_title: string;
          description: string;
          hero_description: string;
          icon: string;
          badge: string;
          badge_color: string;
          image_url: string;
          duration: string;
          level: string;
          mode: string;
          price: number;
          initial_fee: number;
          features: string[];
          requirements: Json;
          curriculum: Json;
          learning_outcomes: Json;
          udemy_url: string;
          udemy_title: string;
          udemy_instructor: string;
          sort_order: number;
          is_featured: boolean;
          is_published: boolean;
          price_online: number | null;
          price_onsite: number | null;
          price_hybrid: number | null;
          program_type: string | null;
          offer_label: string | null;
          offer_deadline: string | null;
          offer_discount_percent: number | null;
          offer_discount_flat: number | null;
          syllabus_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_title: string;
          description: string;
          hero_description: string;
          icon: string;
          badge: string;
          badge_color: string;
          image_url: string;
          duration: string;
          level: string;
          mode: string;
          price: number;
          initial_fee: number;
          features: string[];
          requirements: Json;
          curriculum: Json;
          learning_outcomes: Json;
          udemy_url: string;
          udemy_title: string;
          udemy_instructor: string;
          sort_order: number;
          is_featured: boolean;
          is_published: boolean;
          price_online?: number | null;
          price_onsite?: number | null;
          price_hybrid?: number | null;
          program_type?: string | null;
          offer_label?: string | null;
          offer_deadline?: string | null;
          offer_discount_percent?: number | null;
          offer_discount_flat?: number | null;
          syllabus_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          short_title?: string;
          description?: string;
          hero_description?: string;
          icon?: string;
          badge?: string;
          badge_color?: string;
          image_url?: string;
          duration?: string;
          level?: string;
          mode?: string;
          price?: number;
          initial_fee?: number;
          features?: string[];
          requirements?: Json;
          curriculum?: Json;
          learning_outcomes?: Json;
          udemy_url?: string;
          udemy_title?: string;
          udemy_instructor?: string;
          sort_order?: number;
          is_featured?: boolean;
          is_published?: boolean;
          price_online?: number | null;
          price_onsite?: number | null;
          price_hybrid?: number | null;
          program_type?: string | null;
          offer_label?: string | null;
          offer_deadline?: string | null;
          offer_discount_percent?: number | null;
          offer_discount_flat?: number | null;
          syllabus_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image: string;
          category: string;
          author: string;
          is_published: boolean;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image: string;
          category: string;
          author: string;
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          cover_image?: string;
          category?: string;
          author?: string;
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          full_name: string;
          contact_number: string;
          email: string;
          linkedin_url: string | null;
          semester: string;
          course_id: string;
          reason: string;
          message: string | null;
          status: string;
          enrollment_type: string | null;
          delivery_mode: string | null;
          github_url: string | null;
          cv_url: string | null;
          internship_role: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          contact_number: string;
          email: string;
          linkedin_url?: string | null;
          semester: string;
          course_id: string;
          reason: string;
          message?: string | null;
          status?: string;
          enrollment_type?: string | null;
          delivery_mode?: string | null;
          github_url?: string | null;
          cv_url?: string | null;
          internship_role?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          contact_number?: string;
          email?: string;
          linkedin_url?: string | null;
          semester?: string;
          course_id?: string;
          reason?: string;
          message?: string | null;
          status?: string;
          enrollment_type?: string | null;
          delivery_mode?: string | null;
          github_url?: string | null;
          cv_url?: string | null;
          internship_role?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          full_name: string;
          contact_number: string;
          email: string;
          linkedin_url: string | null;
          semester: string;
          program: string;
          reason: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          contact_number: string;
          email: string;
          linkedin_url?: string | null;
          semester: string;
          program: string;
          reason: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          contact_number?: string;
          email?: string;
          linkedin_url?: string | null;
          semester?: string;
          program?: string;
          reason?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string;
          content: string;
          rating: number;
          avatar_url: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          content: string;
          rating: number;
          avatar_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          content?: string;
          rating?: number;
          avatar_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      pricing_plans: {
        Row: {
          id: string;
          title: string;
          total_fee: number;
          initial_fee: number;
          courses_included: string[];
          is_featured: boolean;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          total_fee: number;
          initial_fee: number;
          courses_included: string[];
          is_featured?: boolean;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          total_fee?: number;
          initial_fee?: number;
          courses_included?: string[];
          is_featured?: boolean;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      paid_internships: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          duration: string;
          requirements: string[];
          stipend: string;
          mode: string;
          skills_required: string[];
          openings: number;
          is_published: boolean;
          sort_order: number;
          offer_label: string | null;
          offer_deadline: string | null;
          offer_discount_percent: number | null;
          offer_discount_flat: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          duration?: string;
          requirements?: string[];
          stipend?: string;
          mode?: string;
          skills_required?: string[];
          openings?: number;
          is_published?: boolean;
          sort_order?: number;
          offer_label?: string | null;
          offer_deadline?: string | null;
          offer_discount_percent?: number | null;
          offer_discount_flat?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          duration?: string;
          requirements?: string[];
          stipend?: string;
          mode?: string;
          skills_required?: string[];
          openings?: number;
          is_published?: boolean;
          sort_order?: number;
          offer_label?: string | null;
          offer_deadline?: string | null;
          offer_discount_percent?: number | null;
          offer_discount_flat?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Helper types
export type Program = Database["public"]["Tables"]["courses"]["Row"];
/** @deprecated Use Program instead */
export type Course = Program;
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
export type PricingPlan = Database["public"]["Tables"]["pricing_plans"]["Row"];
export type PaidInternship = Database["public"]["Tables"]["paid_internships"]["Row"];

