-- ========== SEED COURSES ==========
INSERT INTO courses (slug, title, short_title, description, hero_description, icon, badge, badge_color, image_url, duration, level, mode, price, initial_fee, features, requirements, curriculum, learning_outcomes, udemy_url, udemy_title, udemy_instructor, sort_order, is_featured) VALUES

('ai-ml', 'AI & Machine Learning', 'AI & ML',
 'Master artificial intelligence and machine learning from fundamentals to deployment. Build intelligent systems using Python, TensorFlow, and industry-standard tools.',
 'Master artificial intelligence and machine learning from fundamentals to deployment. Build intelligent systems using Python, TensorFlow, and real-world datasets — all guided by expert mentors.',
 'fas fa-brain', 'Most Popular', 'primary',
 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
 '3 Months', 'Beginner to Advanced', 'Online & On-site', 8000, 2500,
 '["Python for AI & Data Science", "Deep Learning & Neural Networks", "Model Training & Deployment", "Real-world AI Projects"]'::jsonb,
 '[{"title":"Beginner Friendly","items":["No prior programming needed","Basic math knowledge helpful","We cover Python from scratch"]},{"title":"Technical Requirements","items":["Laptop/desktop (any OS)","Stable internet connection","Google Colab (free)"]}]'::jsonb,
 '[{"title":"Python & AI Foundations","lectures":["Python programming & data structures","NumPy, Pandas & data manipulation","Introduction to AI & ML concepts"]},{"title":"Data Preprocessing & EDA","lectures":["Data cleaning & transformation","Exploratory Data Analysis techniques","Feature engineering & selection"]},{"title":"Machine Learning Algorithms","lectures":["Linear & logistic regression","Decision trees, Random Forest & SVM","K-means clustering & PCA"]},{"title":"Deep Learning & Neural Networks","lectures":["Neural network architecture & math","Building models with TensorFlow/Keras","CNNs for image recognition"]},{"title":"Natural Language Processing","lectures":["Text preprocessing & tokenization","Sentiment analysis & text classification","Building chatbots & NLP pipelines"]},{"title":"Model Deployment & MLOps","lectures":["Model evaluation & hyperparameter tuning","Flask/FastAPI model deployment","Docker & cloud deployment basics"]},{"title":"Advanced AI Topics","lectures":["Generative AI & LLMs overview","Reinforcement learning basics","AI ethics & responsible AI"]},{"title":"Capstone Project & Career","lectures":["End-to-end ML project","Portfolio building & documentation","Resume prep & interview practice"]}]'::jsonb,
 '[{"title":"Build ML Models","icon":"fas fa-brain"},{"title":"Deep Learning","icon":"fas fa-network-wired"},{"title":"NLP Applications","icon":"fas fa-comments"},{"title":"Deploy AI Systems","icon":"fas fa-cloud-upload-alt"},{"title":"Data Analysis","icon":"fas fa-chart-line"},{"title":"Industry Certificate","icon":"fas fa-certificate"}]'::jsonb,
 'https://www.udemy.com/course/complete-machine-learning-nlp-bootcamp-mlops-deployment/',
 'Complete Machine Learning & NLP Bootcamp by Krish Naik', 'Krish Naik',
 1, true),

('web-dev', 'Full Stack Web Development', 'Web Development',
 'Build modern, responsive websites and web applications from front-end to back-end. Learn the MERN stack with hands-on projects and deploy real applications.',
 'Build modern, responsive websites and web applications from front-end to back-end. Learn the MERN stack with hands-on projects and deploy real applications — all guided by expert mentors.',
 'fas fa-code', 'Full Stack', 'green',
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
 '3 Months', 'Beginner to Advanced', 'Online & On-site', 6000, 1500,
 '["HTML, CSS, JavaScript & React", "Node.js, Express & MongoDB", "REST APIs & Authentication", "Deploy Real Web Applications"]'::jsonb,
 '[{"title":"Beginner Friendly","items":["No prior programming needed","Basic computer skills","We teach HTML, CSS, JS from basics"]},{"title":"Technical Requirements","items":["Laptop/desktop (any OS)","Stable internet connection","VS Code (free)","Chrome or Firefox"]}]'::jsonb,
 '[{"title":"Web Development Foundations","lectures":["Web development roadmap & career paths","Setting up code editor & tools","Basics of how the web works"]},{"title":"HTML & CSS Mastery","lectures":["HTML5 structure, semantics & forms","CSS3 styling, Flexbox & Grid layout","Tailwind CSS utility-first framework"]},{"title":"JavaScript Foundation","lectures":["Variables, functions & ES6+ syntax","DOM manipulation & event handling","Async JavaScript, Fetch API & Promises"]},{"title":"Backend with Node.js & Express","lectures":["Server setup with Node.js & Express","Mongoose, Prisma & Drizzle ORMs","RESTful API design & routing"]},{"title":"Database & Authentication","lectures":["MongoDB, PostgreSQL & NeonDB","Build your own authentication system","CRUD operations & data modeling"]},{"title":"Frontend with React","lectures":["React fundamentals & API handling","State management with Redux & Zustand","Building interactive single-page apps"]},{"title":"Full-Stack MERN Projects","lectures":["Full-stack application development","Open-source project contribution","Git, GitHub & version control"]},{"title":"Deployment & AI Integration","lectures":["Custom VPS deployment & hosting","TensorFlow.js & Langchain for AI apps","Portfolio building & freelancing tips"]}]'::jsonb,
 '[{"title":"Build Responsive Websites","icon":"fas fa-code"},{"title":"React Applications","icon":"fab fa-react"},{"title":"Back-End APIs","icon":"fas fa-server"},{"title":"Database Management","icon":"fas fa-database"},{"title":"Deploy Live Projects","icon":"fas fa-cloud-upload-alt"},{"title":"Industry Certificate","icon":"fas fa-certificate"}]'::jsonb,
 'https://www.udemy.com/course/web-dev-master/',
 'Complete Web Development Course by Hitesh Choudhary', 'Hitesh Choudhary',
 2, false),

('cybersecurity', 'Cybersecurity Fundamentals', 'Cybersecurity',
 'Learn ethical hacking, penetration testing, and network security. Protect systems and data with industry-standard cybersecurity tools and techniques.',
 'Learn ethical hacking, penetration testing, and network security from scratch. Build real-world security skills — all guided by expert mentors.',
 'fas fa-shield-alt', 'In Demand', 'accent',
 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
 '3 Months', 'Intermediate', 'Online & On-site', 6000, 1500,
 '["Network Security & Ethical Hacking", "Penetration Testing Tools", "Security Auditing & Compliance", "Incident Response & Forensics"]'::jsonb,
 '[{"title":"Requirements","items":["Basic networking knowledge helpful","Familiarity with command line","Interest in security & problem solving"]},{"title":"Technical Requirements","items":["Laptop with 8GB+ RAM","VirtualBox or VMware","Kali Linux (free)","Stable internet connection"]}]'::jsonb,
 '[{"title":"Cybersecurity Foundations","lectures":["Introduction to cybersecurity landscape","CIA triad & security principles","Networking fundamentals for security"]},{"title":"Linux & Command Line","lectures":["Linux fundamentals & Bash scripting","File system, permissions & processes","Essential command-line tools"]},{"title":"Network Security","lectures":["TCP/IP, DNS, HTTP deep dive","Firewalls, IDS & IPS","Wireless security & attacks"]},{"title":"Ethical Hacking & Recon","lectures":["Reconnaissance & information gathering","Nmap scanning & enumeration","OSINT tools & techniques"]},{"title":"Penetration Testing","lectures":["Metasploit framework mastery","Exploitation techniques","Post-exploitation & privilege escalation"]},{"title":"Web Application Security","lectures":["OWASP Top 10 vulnerabilities","SQL injection & XSS attacks","Burp Suite & web pentesting"]},{"title":"Cryptography & Defense","lectures":["Encryption algorithms & PKI","Hashing, digital signatures & SSL/TLS","Security hardening & defense strategies"]},{"title":"Capstone & Career Prep","lectures":["Full penetration testing project","Security audit report writing","Resume building & career paths"]}]'::jsonb,
 '[{"title":"Ethical Hacking","icon":"fas fa-user-secret"},{"title":"Penetration Testing","icon":"fas fa-crosshairs"},{"title":"Network Security","icon":"fas fa-network-wired"},{"title":"Web App Security","icon":"fas fa-globe"},{"title":"Security Auditing","icon":"fas fa-clipboard-check"},{"title":"Industry Certificate","icon":"fas fa-certificate"}]'::jsonb,
 'https://www.udemy.com/course/complete-ethical-hacking-bootcamp-zero-to-mastery/',
 'Complete Ethical Hacking Bootcamp by Andrei Neagoie', 'Andrei Neagoie',
 3, false),

('ui-ux', 'UI/UX Design Mastery', 'UI/UX Design',
 'Master user interface and user experience design with Figma. Create stunning, user-centered designs from wireframes to high-fidelity prototypes.',
 'Master user interface and user experience design with Figma. Create stunning, user-centered designs — all guided by expert mentors.',
 'fas fa-pen-nib', 'Creative', 'accent',
 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
 '3 Months', 'Beginner Friendly', 'Online & On-site', 6000, 1500,
 '["User Research & Wireframing", "Figma & Prototyping", "Design Systems & Components", "Portfolio-ready Case Studies"]'::jsonb,
 '[{"title":"Beginner Friendly","items":["No design experience needed","Basic computer skills","Creative mindset & curiosity"]},{"title":"Technical Requirements","items":["Laptop/desktop (any OS)","Stable internet connection","Figma (free tier)","Pen & paper for sketching"]}]'::jsonb,
 '[{"title":"Design Foundations","lectures":["Principles of visual design","Color theory & typography","Layout, hierarchy & spacing"]},{"title":"User Research & Strategy","lectures":["User personas & journey mapping","Competitive analysis","Information architecture"]},{"title":"Wireframing & Prototyping","lectures":["Low-fidelity wireframes","Figma basics & workspace setup","Interactive prototyping"]},{"title":"Figma Advanced","lectures":["Components & variants","Auto layout & constraints","Design tokens & styles"]},{"title":"Design Systems","lectures":["Building a design system","Component libraries","Documentation & handoff"]},{"title":"Mobile & Responsive Design","lectures":["Mobile-first design approach","Responsive design patterns","iOS & Android guidelines"]},{"title":"Usability & Testing","lectures":["Usability testing methods","A/B testing basics","Accessibility (WCAG) standards"]},{"title":"Portfolio & Career","lectures":["Case study creation","Portfolio website design","Interview prep & career paths"]}]'::jsonb,
 '[{"title":"Figma Mastery","icon":"fas fa-pen-nib"},{"title":"Wireframing","icon":"fas fa-object-group"},{"title":"Prototyping","icon":"fas fa-mobile-alt"},{"title":"Design Systems","icon":"fas fa-layer-group"},{"title":"User Research","icon":"fas fa-users"},{"title":"Industry Certificate","icon":"fas fa-certificate"}]'::jsonb,
 'https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/',
 'Figma UX/UI Design Course by Daniel Walter Scott', 'Daniel Walter Scott',
 4, false),

('graphic-design', 'Graphic Designing Professional', 'Graphic Designing',
 'Master professional graphic design using Adobe Photoshop, Illustrator, and InDesign. Create stunning visuals for brands, social media, and print.',
 'Master professional graphic design using Adobe creative suite. Create stunning visuals for brands — all guided by expert mentors.',
 'fas fa-palette', 'Creative', 'accent',
 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
 '3 Months', 'Beginner Friendly', 'Online & On-site', 6000, 1500,
 '["Adobe Photoshop & Illustrator", "Brand Identity & Logo Design", "Social Media & Marketing Design", "Print & Digital Media"]'::jsonb,
 '[{"title":"Beginner Friendly","items":["No design experience required","Basic computer skills","Eye for aesthetics helpful"]},{"title":"Technical Requirements","items":["Laptop/desktop (any OS)","Adobe Creative Cloud subscription","Stable internet connection","Graphics tablet (optional)"]}]'::jsonb,
 '[{"title":"Design Fundamentals","lectures":["Elements & principles of design","Color theory & color psychology","Typography fundamentals"]},{"title":"Adobe Photoshop","lectures":["Photoshop workspace & tools","Photo editing & manipulation","Compositing & effects"]},{"title":"Adobe Illustrator","lectures":["Illustrator workspace & tools","Vector graphics & pen tool mastery","Logo & icon design"]},{"title":"Brand Identity Design","lectures":["Brand strategy & positioning","Logo design process","Brand guidelines & style guides"]},{"title":"Social Media Design","lectures":["Social media graphics & templates","Instagram, Facebook & LinkedIn design","Content calendar & batch creation"]},{"title":"Print Design","lectures":["Print design fundamentals","Business cards, brochures & posters","Packaging design basics"]},{"title":"Adobe InDesign","lectures":["InDesign workspace & layout","Multi-page documents & magazines","eBooks & digital publications"]},{"title":"Portfolio & Freelancing","lectures":["Building a design portfolio","Freelancing platforms & pricing","Client communication & career paths"]}]'::jsonb,
 '[{"title":"Photoshop Mastery","icon":"fas fa-image"},{"title":"Illustrator Skills","icon":"fas fa-vector-square"},{"title":"Logo Design","icon":"fas fa-copyright"},{"title":"Brand Identity","icon":"fas fa-id-badge"},{"title":"Social Media Design","icon":"fas fa-hashtag"},{"title":"Industry Certificate","icon":"fas fa-certificate"}]'::jsonb,
 'https://www.udemy.com/course/graphic-design-masterclass-everything-you-need-to-know/',
 'Graphic Design Masterclass by Lindsay Marsh', 'Lindsay Marsh',
 5, false),

('data-science', 'Data Science & Analytics', 'Data Science',
 'Learn data analysis, visualization, and business intelligence. Master Python, SQL, Tableau, and Power BI to make data-driven decisions.',
 'Learn data science and analytics from scratch. Master Python, SQL, and visualization tools — all guided by expert mentors.',
 'fas fa-chart-bar', 'Analytics', 'green',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
 '3 Months', 'Beginner to Intermediate', 'Online & On-site', 8000, 2500,
 '["Python, Pandas & NumPy", "Data Visualization with Tableau", "Statistical Analysis & SQL", "Business Intelligence Projects"]'::jsonb,
 '[{"title":"Beginner Friendly","items":["No prior knowledge needed","Basic math/statistics helpful","We start from fundamentals"]},{"title":"Technical Requirements","items":["Laptop/desktop (any OS)","Stable internet connection","Python & Jupyter Notebook (free)","Excel (any version)"]}]'::jsonb,
 '[{"title":"Data Science Foundations","lectures":["What is data science & career paths","Statistics & probability basics","Data types & data lifecycle"]},{"title":"Python for Data Science","lectures":["Python programming fundamentals","NumPy & Pandas for data analysis","Data cleaning & preprocessing"]},{"title":"Data Visualization","lectures":["Matplotlib & Seaborn","Interactive dashboards with Plotly","Storytelling with data"]},{"title":"SQL & Databases","lectures":["SQL fundamentals & queries","Joins, subqueries & window functions","Database design & optimization"]},{"title":"Statistical Analysis","lectures":["Descriptive & inferential statistics","Hypothesis testing","Correlation & regression analysis"]},{"title":"Business Intelligence","lectures":["Tableau fundamentals","Power BI dashboards","KPIs & business metrics"]},{"title":"Machine Learning Basics","lectures":["Introduction to ML for data science","Classification & regression models","Model evaluation & selection"]},{"title":"Capstone & Career","lectures":["End-to-end data science project","Portfolio & GitHub setup","Resume building & interview prep"]}]'::jsonb,
 '[{"title":"Python & Pandas","icon":"fab fa-python"},{"title":"SQL Databases","icon":"fas fa-database"},{"title":"Data Visualization","icon":"fas fa-chart-pie"},{"title":"Tableau & Power BI","icon":"fas fa-tachometer-alt"},{"title":"Statistical Analysis","icon":"fas fa-square-root-alt"},{"title":"Industry Certificate","icon":"fas fa-certificate"}]'::jsonb,
 'https://www.udemy.com/course/complete-data-analyst-bootcamp-from-basics-to-advanced/',
 'Complete Data Analyst Bootcamp by Krish Naik', 'Krish Naik',
 6, false);

-- ========== SEED TESTIMONIALS ==========
INSERT INTO testimonials (name, role, content, rating, sort_order) VALUES
('Priya Sharma', 'Data Analyst', 'The AI & ML course at Leafclutch was exactly what I needed. The hands-on projects and mentor support helped me land my first job as a data analyst in Kathmandu.', 5, 1),
('Rajesh Adhikari', 'Web Developer', 'As someone from Butwal, having a quality tech training centre nearby was a game changer. The web development bootcamp gave me skills that are in demand everywhere.', 5, 2),
('Sarina Thapa', 'Cybersecurity Intern', 'The online internship program was flexible and professional. I could learn cybersecurity from my home in Pokhara while getting mentored by industry experts.', 5, 3);

-- ========== SEED PRICING PLANS ==========
INSERT INTO pricing_plans (title, total_fee, initial_fee, courses_included, is_featured, sort_order) VALUES
('Programming Languages', 6000, 1500, '["Python", "C/C++", "Java", "JavaScript"]'::jsonb, false, 1),
('Core Tech & Design', 6000, 1500, '["Fullstack/Frontend/Backend Dev", "Cybersecurity", "Graphic/UI-UX Design", "SEO"]'::jsonb, false, 2),
('Data & AI Programs', 8000, 2500, '["AI/ML", "Data Analyst/Science", "Agentic AI", "Generative AI"]'::jsonb, true, 3),
('DSA Program', 7000, 2000, '["DSA Theory", "350+ LeetCode Questions", "100 Days Challenge", "Interview Prep"]'::jsonb, false, 4);

-- ========== SEED BLOG POSTS ==========
INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, category, is_published, published_at) VALUES
('how-ai-is-transforming-education-in-nepal', 'How AI is Transforming Education in Nepal', 'Explore how artificial intelligence is reshaping the education landscape across Nepal.', '<p>Artificial intelligence is transforming education in Nepal...</p>', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', 'AI & ML', true, '2025-06-10'),
('top-5-web-development-frameworks-2025', 'Top 5 Web Development Frameworks to Learn in 2025', 'From React to Next.js — discover the most in-demand web frameworks for 2025.', '<p>The web development landscape continues to evolve...</p>', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop', 'Web Development', true, '2025-05-28'),
('why-cybersecurity-skills-are-essential', 'Why Cybersecurity Skills Are Essential for Every Developer', 'Learn why understanding security fundamentals is crucial for modern developers.', '<p>In today''s digital landscape, cybersecurity is no longer optional...</p>', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop', 'Cybersecurity', true, '2025-05-15'),
('complete-guide-to-ui-ux-design', 'The Complete Guide to UI/UX Design for Beginners', 'A comprehensive beginner''s guide to getting started in UI/UX design.', '<p>UI/UX design is one of the most sought-after skills...</p>', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', 'UI/UX Design', true, '2025-05-02'),
('how-to-land-first-tech-internship-nepal', 'How to Land Your First Tech Internship in Nepal', 'Practical tips and strategies for aspiring tech professionals in Nepal.', '<p>Landing your first tech internship can feel challenging...</p>', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop', 'Career', true, '2025-04-20'),
('graphic-design-trends-2025', 'Graphic Design Trends That Will Dominate 2025', 'From 3D design to AI-generated art — explore the trends shaping graphic design.', '<p>The graphic design industry is evolving rapidly...</p>', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop', 'Graphic Design', true, '2025-04-05');

-- ========== SEED SITE SETTINGS ==========
INSERT INTO site_settings (key, value) VALUES
('hero', '{"badge":"LEAFCLUTCH TECHNOLOGIES PVT. LTD.","title":"Empowering Nepal''s Future with Technology & Innovation","description":"Industry-focused training and internship programs in AI, Web Development, Cybersecurity, UI/UX, and more — designed to transform beginners into industry-ready professionals.","counters":[{"number":5,"suffix":"+","label":"Projects Delivered"},{"number":100,"suffix":"%","label":"Client Satisfaction"},{"label":"24/7","staticText":true,"sublabel":"Support Available"}]}'::jsonb),
('stats', '{"items":[{"number":6,"suffix":"+","label":"Tech Tracks Available"},{"number":3,"suffix":"","label":"Month Program Duration"},{"number":3,"suffix":"","label":"Certificates Provided"},{"label":"24/7","staticText":true,"sublabel":"Mentor Support"}]}'::jsonb),
('contact', '{"phone":"+977-9766715768","email":"info@leafclutchtech.com.np","location":"Siddharthanagar, Rupandehi, Nepal","whatsapp":"9779766715768"}'::jsonb),
('social', '{"facebook":"https://www.facebook.com/profile.php?id=61584902195796","instagram":"https://www.instagram.com/leafclutch.technologies/","linkedin":"https://www.linkedin.com/company/leafclutch-technologies/","youtube":"https://www.youtube.com/@LeafclutchTechnologies","tiktok":"https://www.tiktok.com/@leafclutchtechnologies1","discord":"https://discord.gg/4aDwcMZBPq"}'::jsonb);
