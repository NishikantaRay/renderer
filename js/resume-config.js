/**
 * Resume Configuration (JavaScript Version)
 * This is a fallback for when TOML loading is not available
 * You can use this instead of TOML if needed
 */

window.RESUME_CONFIG_JS = {
    personal: {
        name: "Nishikanta Ray",
        title: "Full Stack Developer & Software Engineer",
        phone: "+1 (555) 123-4567",
        email: "nishikantaray@email.com",
        website: "https://nishikantaray.dev",
        github: "https://github.com/NishikantaRay",
        linkedin: "https://linkedin.com/in/nishikantaray",
        location: "San Francisco, CA"
    },

    summary: {
        text: "Experienced Full Stack Developer with 5+ years of expertise in modern web technologies. Passionate about creating scalable applications and leading development teams. Proven track record of delivering high-quality software solutions that drive business growth and enhance user experiences."
    },

    experience: [
        {
            position: "Senior Full Stack Developer",
            company: "TechCorp Solutions",
            company_url: "https://techcorp.com",
            location: "San Francisco, CA",
            start_date: "Jan 2022",
            end_date: "Present",
            is_current: true,
            achievements: [
                "Led development of a microservices architecture serving 100k+ daily active users, improving system performance by 60%",
                "Architected and implemented real-time analytics dashboard using React, Node.js, and Redis, reducing data processing time by 40%",
                "Mentored 5 junior developers and established coding standards that reduced bug reports by 35%",
                "Collaborated with product managers to define technical requirements for new features, resulting in 25% faster delivery times"
            ]
        },
        {
            position: "Full Stack Developer",
            company: "StartupXYZ",
            company_url: "https://startupxyz.io",
            location: "San Francisco, CA",
            start_date: "Jun 2020",
            end_date: "Dec 2021",
            is_current: false,
            achievements: [
                "Built responsive web applications using React, TypeScript, and Node.js for 50+ enterprise clients",
                "Implemented automated testing strategies that improved code coverage from 45% to 85%",
                "Optimized database queries and API endpoints, reducing average response time by 50%",
                "Participated in agile development processes and code reviews to maintain high-quality standards"
            ]
        },
        {
            position: "Junior Web Developer",
            company: "Digital Agency Pro",
            company_url: "https://digitalagencypro.com",
            location: "San Jose, CA",
            start_date: "Sep 2019",
            end_date: "May 2020",
            is_current: false,
            achievements: [
                "Developed and maintained WordPress websites for small to medium-sized businesses",
                "Created custom PHP plugins and themes, improving site performance by 30%",
                "Collaborated with designers to implement pixel-perfect, responsive designs",
                "Provided technical support and training to clients on content management systems"
            ]
        }
    ],

    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of California, Berkeley",
            institution_url: "https://www.berkeley.edu",
            location: "Berkeley, CA",
            graduation_year: "2019",
            gpa: "3.8",
            relevant_coursework: [
                "Data Structures and Algorithms",
                "Software Engineering",
                "Database Systems",
                "Computer Networks",
                "Machine Learning"
            ],
            honors: ["Cum Laude", "Dean's List (6 semesters)"]
        },
        {
            degree: "Associate of Science in Web Development",
            institution: "City College of San Francisco",
            institution_url: "https://www.ccsf.edu",
            location: "San Francisco, CA",
            graduation_year: "2017",
            gpa: "3.9",
            relevant_coursework: [
                "Web Programming",
                "Database Design",
                "User Interface Design",
                "Mobile App Development"
            ],
            honors: ["High Honors", "President's List"]
        }
    ],

    projects: [
        {
            name: "E-Commerce Platform",
            description: "Full-stack e-commerce solution with real-time inventory management",
            technologies: ["React", "Node.js", "MongoDB", "Stripe API", "Redis"],
            start_date: "Mar 2023",
            end_date: "Aug 2023",
            github_url: "https://github.com/NishikantaRay/ecommerce-platform",
            live_url: "https://ecommerce-demo.nishikantaray.dev",
            highlights: [
                "Built scalable microservices architecture handling 10k+ concurrent users",
                "Implemented real-time inventory tracking with WebSocket connections",
                "Integrated secure payment processing with Stripe and PayPal",
                "Achieved 99.9% uptime with automated deployment and monitoring"
            ]
        },
        {
            name: "Task Management SaaS",
            description: "Collaborative project management tool with real-time updates",
            technologies: ["Vue.js", "Express.js", "PostgreSQL", "Socket.io", "Docker"],
            start_date: "Jan 2023",
            end_date: "Jun 2023",
            github_url: "https://github.com/NishikantaRay/task-management",
            live_url: "https://taskmanager-demo.com",
            highlights: [
                "Developed real-time collaboration features using WebSockets",
                "Implemented role-based access control and team management",
                "Built RESTful APIs with comprehensive testing coverage",
                "Deployed using Docker containers on AWS ECS"
            ]
        },
        {
            name: "Personal Finance Tracker",
            description: "Mobile-first web app for expense tracking and budget management",
            technologies: ["React Native", "Firebase", "Chart.js", "Plaid API"],
            start_date: "Sep 2022",
            end_date: "Dec 2022",
            github_url: "https://github.com/NishikantaRay/finance-tracker",
            live_url: "https://finance-tracker.nishikantaray.dev",
            highlights: [
                "Built cross-platform mobile app with React Native",
                "Integrated bank account connections using Plaid API",
                "Created interactive data visualizations for spending analysis",
                "Implemented secure authentication with Firebase Auth"
            ]
        }
    ],

    skills: {
        frontend: {
            category: "Frontend Development",
            technologies: [
                "React", "Vue.js", "Angular", "TypeScript", "JavaScript (ES6+)", 
                "HTML5", "CSS3", "Sass", "Tailwind CSS", "Bootstrap"
            ]
        },
        backend: {
            category: "Backend Development",
            technologies: [
                "Node.js", "Express.js", "Python", "Django", "Flask", 
                "PHP", "Laravel", "RESTful APIs", "GraphQL"
            ]
        },
        databases: {
            category: "Databases",
            technologies: [
                "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "DynamoDB"
            ]
        },
        cloud: {
            category: "Cloud & DevOps",
            technologies: [
                "AWS (EC2, S3, Lambda)", "Docker", "Kubernetes", "GitHub Actions", 
                "CI/CD", "Nginx"
            ]
        },
        tools: {
            category: "Tools & Technologies",
            technologies: [
                "Git", "VS Code", "Postman", "Figma", "Jira", "Slack", 
                "Linux", "Webpack", "Vite"
            ]
        },
        other: {
            category: "Other Skills",
            technologies: [
                "Agile/Scrum", "Test-Driven Development", "Code Review", 
                "Team Leadership", "Technical Writing"
            ]
        }
    },

    achievements: [
        {
            title: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023",
            type: "certification"
        },
        {
            title: "Google Cloud Professional Developer",
            issuer: "Google Cloud Platform",
            date: "2022",
            type: "certification"
        },
        {
            title: "Winner, Tech Innovation Hackathon",
            issuer: "Local Tech Community",
            date: "2023",
            type: "award",
            description: "Built AI-powered productivity app"
        },
        {
            title: "Open Source Contributor",
            issuer: "GitHub Community",
            date: "2021-Present",
            type: "contribution",
            description: "500+ contributions to popular React libraries"
        },
        {
            title: "Tech Meetup Speaker",
            issuer: "JavaScript & React Meetups",
            date: "2022-Present",
            type: "speaking",
            description: "Regular speaker at local JavaScript and React meetups"
        },
        {
            title: "Coding Mentor",
            issuer: "Volunteer Organization",
            date: "2021-Present",
            type: "volunteer",
            description: "Volunteer coding mentor for underrepresented groups in tech"
        }
    ],

    settings: {
        show_gpa: true,
        show_location: true,
        show_phone: false,
        date_format: "MMM YYYY",
        max_achievements_per_section: 6,
        enable_share_button: true
    }
};