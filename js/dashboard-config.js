// Dashboard Configuration
// Customize all aspects of the main page dashboard analytics

window.DASHBOARD_CONFIG = {
    // Skills Progress Configuration
    skillsProgress: {
        enabled: true,
        skills: [
            { name: 'JavaScript', progress: 90, color: { light: '#f7df1e', dark: '#f7df1e' } },
            { name: 'Python', progress: 85, color: { light: '#3776ab', dark: '#4b8bbe' } },
            { name: 'React', progress: 88, color: { light: '#61dafb', dark: '#61dafb' } },
            { name: 'Node.js', progress: 82, color: { light: '#339933', dark: '#68cc68' } },
            { name: 'CSS/SCSS', progress: 92, color: { light: '#1572b6', dark: '#429bdb' } },
            { name: 'TypeScript', progress: 80, color: { light: '#3178c6', dark: '#4a90d9' } },
            { name: 'MongoDB', progress: 75, color: { light: '#47a248', dark: '#6bb86b' } },
            { name: 'Git', progress: 88, color: { light: '#f05032', dark: '#f47062' } }
        ],
        animationDuration: 2000,
        animationDelay: 100 // delay between each skill animation
    },

    // Technology Stack Configuration  
    techStack: {
        enabled: true,
        categories: {
            labels: ['Frontend', 'Backend', 'Database', 'Tools', 'Cloud'],
            values: [35, 25, 15, 15, 10],
            colors: {
                light: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                dark: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa']
            }
        },
        technologies: [
            { name: 'React', category: 'Frontend', level: 'Expert' },
            { name: 'Vue.js', category: 'Frontend', level: 'Advanced' },
            { name: 'Angular', category: 'Frontend', level: 'Intermediate' },
            { name: 'Node.js', category: 'Backend', level: 'Expert' },
            { name: 'Express.js', category: 'Backend', level: 'Expert' },
            { name: 'Python/Django', category: 'Backend', level: 'Advanced' },
            { name: 'MongoDB', category: 'Database', level: 'Advanced' },
            { name: 'PostgreSQL', category: 'Database', level: 'Intermediate' },
            { name: 'Docker', category: 'Tools', level: 'Advanced' },
            { name: 'AWS', category: 'Cloud', level: 'Intermediate' }
        ]
    },

    // Recent Projects Chart Configuration
    recentProjects: {
        enabled: true,
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Projects Completed',
                    data: [3, 5, 4, 6, 8, 7],
                    colors: {
                        light: '#3b82f6',
                        dark: '#60a5fa'
                    }
                },
                {
                    label: 'In Progress',
                    data: [2, 3, 2, 4, 3, 5],
                    colors: {
                        light: '#10b981',
                        dark: '#34d399'
                    }
                }
            ]
        },
        chartType: 'bar', // 'bar', 'line', or 'radar'
        showLegend: true,
        animations: true
    },

    // Performance Metrics Configuration
    performanceMetrics: {
        enabled: true,
        data: {
            labels: ['Performance', 'SEO', 'Accessibility', 'Best Practices', 'PWA'],
            scores: [95, 92, 98, 94, 85],
            colors: {
                light: ['#10b981', '#10b981', '#10b981', '#10b981', '#f59e0b'],
                dark: ['#34d399', '#34d399', '#34d399', '#34d399', '#fbbf24']
            }
        },
        chartType: 'radar', // 'radar' or 'bar'
        maxScore: 100
    },

    // Statistics Configuration
    statistics: {
        enabled: true,
        metrics: [
            {
                id: 'projectsCompleted',
                label: 'Projects Completed',
                value: 45,
                suffix: '+',
                icon: '📊',
                animationDuration: 2500,
                color: { light: '#3b82f6', dark: '#60a5fa' }
            },
            {
                id: 'clientsSatisfied', 
                label: 'Clients Satisfied',
                value: 25,
                suffix: '+',
                icon: '😊',
                animationDuration: 2200,
                color: { light: '#10b981', dark: '#34d399' }
            },
            {
                id: 'codeCommits',
                label: 'Code Commits',
                value: 1250,
                suffix: '+',
                icon: '💻',
                animationDuration: 3000,
                color: { light: '#f59e0b', dark: '#fbbf24' }
            },
            {
                id: 'yearsExperience',
                label: 'Years Experience',
                value: 5,
                suffix: '+',
                icon: '🚀',
                animationDuration: 1800,
                color: { light: '#ef4444', dark: '#f87171' }
            }
        ]
    },

    // Recent Activity Timeline Configuration
    recentActivity: {
        enabled: true,
        activities: [
            {
                date: '2025-10-12',
                title: 'Released Portfolio v2.0',
                description: 'Launched new portfolio with advanced analytics dashboard',
                type: 'release',
                icon: '🚀'
            },
            {
                date: '2025-10-10',
                title: 'Completed E-commerce Project',
                description: 'Delivered full-stack e-commerce solution with React & Node.js',
                type: 'project',
                icon: '🛒'
            },
            {
                date: '2025-10-08',
                title: 'Blog Post Published',
                description: 'Wrote about Modern JavaScript Best Practices',
                type: 'blog',
                icon: '📝'
            },
            {
                date: '2025-10-05',
                title: 'Open Source Contribution',
                description: 'Contributed to React ecosystem with custom hooks library',
                type: 'opensource',
                icon: '💡'
            },
            {
                date: '2025-10-01',
                title: 'Workshop Conducted',
                description: 'Led JavaScript workshop for 50+ developers',
                type: 'education',
                icon: '🎓'
            }
        ],
        maxItems: 5,
        showIcons: true,
        dateFormat: 'MMM DD' // 'full', 'short', 'MMM DD'
    },

    // Learning Progress Configuration
    learningProgress: {
        enabled: true,
        currentLearning: [
            {
                topic: 'Next.js 14',
                progress: 75,
                target: 'Master by Nov 2025',
                color: { light: '#000000', dark: '#ffffff' }
            },
            {
                topic: 'GraphQL',
                progress: 60,
                target: 'Intermediate level',
                color: { light: '#e10098', dark: '#f550b8' }
            },
            {
                topic: 'Rust',
                progress: 40,
                target: 'Build CLI tools',
                color: { light: '#ce422b', dark: '#f74c00' }
            },
            {
                topic: 'Kubernetes',
                progress: 30,
                target: 'Container orchestration',
                color: { light: '#326ce5', dark: '#5b9bd5' }
            }
        ],
        showTargets: true,
        animateOnScroll: true
    },

    // Code Quality Metrics Configuration
    codeQuality: {
        enabled: true,
        metrics: {
            testCoverage: {
                value: 92,
                label: 'Test Coverage',
                color: { light: '#10b981', dark: '#34d399' }
            },
            codeReview: {
                value: 98,
                label: 'Code Review Score',
                color: { light: '#3b82f6', dark: '#60a5fa' }
            },
            documentation: {
                value: 89,
                label: 'Documentation',
                color: { light: '#8b5cf6', dark: '#a78bfa' }
            },
            performance: {
                value: 95,
                label: 'Performance Score',
                color: { light: '#f59e0b', dark: '#fbbf24' }
            }
        },
        chartType: 'gauge', // 'gauge', 'bar', or 'progress'
        showLabels: true
    },

    // Animation and UI Settings
    animations: {
        enabled: true,
        duration: 1000,
        easing: 'ease-out',
        stagger: 100, // delay between elements
        chartAnimations: true,
        counterAnimations: true,
        scrollAnimations: true
    },

    // Theme Integration
    theme: {
        adaptToSystemTheme: true,
        customColors: {
            primary: { light: '#3b82f6', dark: '#60a5fa' },
            secondary: { light: '#10b981', dark: '#34d399' },
            accent: { light: '#f59e0b', dark: '#fbbf24' },
            danger: { light: '#ef4444', dark: '#f87171' },
            success: { light: '#10b981', dark: '#34d399' }
        }
    },

    // Data Refresh Settings
    dataRefresh: {
        enabled: false, // Set to true for live data
        interval: 300000, // 5 minutes in milliseconds
        endpoints: {
            github: 'https://api.github.com/users/NishikantaRay',
            // Add other API endpoints as needed
        }
    }
};