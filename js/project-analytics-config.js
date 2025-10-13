/**
 * Project Analytics Configuration
 * Customizable settings for project dashboard charts and metrics
 */

const PROJECT_ANALYTICS_CONFIG = {
    // Weekly Activity Chart Configuration
    weeklyActivity: {
        enabled: true,
        title: "Weekly Development Activity",
        description: "Code commits and project work over the past week",
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            commits: [12, 19, 8, 15, 22, 8, 16],
            pullRequests: [2, 4, 1, 3, 5, 1, 2],
            issues: [1, 2, 0, 1, 3, 0, 1]
        },
        colors: {
            commits: {
                light: '#0969da',
                dark: '#58a6ff'
            },
            pullRequests: {
                light: '#1a7f37',
                dark: '#3fb950'
            },
            issues: {
                light: '#cf222e',
                dark: '#f85149'
            }
        }
    },

    // Project Statistics Configuration
    projectStats: {
        enabled: true,
        title: "Project Distribution",
        description: "Breakdown of projects by category and technology",
        data: {
            categories: {
                labels: ['Web Applications', 'Mobile Apps', 'Libraries & Tools', 'Open Source'],
                values: [45, 25, 20, 10],
                colors: {
                    light: ['#0969da', '#1a7f37', '#8250df', '#bf8700'],
                    dark: ['#58a6ff', '#3fb950', '#a5a5ff', '#f2cc60']
                }
            },
            technologies: {
                labels: ['React', 'TypeScript', 'Node.js', 'Python', 'Next.js'],
                values: [35, 30, 25, 15, 20],
                colors: {
                    light: ['#61dafb', '#3178c6', '#339933', '#3776ab', '#000000'],
                    dark: ['#61dafb', '#3178c6', '#339933', '#3776ab', '#ffffff']
                }
            }
        }
    },

    // Project Timeline Configuration
    timeline: {
        enabled: true,
        title: "Recent Project Milestones",
        description: "Latest project updates and achievements",
        events: [
            {
                date: "Oct 13, 2024",
                title: "Portfolio Dashboard Launch",
                description: "Released interactive analytics dashboard with Chart.js integration",
                type: "release",
                color: "#0969da"
            },
            {
                date: "Oct 10, 2024", 
                title: "Blog System Refactor",
                description: "Migrated to dynamic single-page blog architecture",
                type: "update",
                color: "#1a7f37"
            },
            {
                date: "Oct 8, 2024",
                title: "Mobile Navigation Fix",
                description: "Improved responsive navigation across all pages",
                type: "fix",
                color: "#8250df"
            },
            {
                date: "Oct 5, 2024",
                title: "Theme System Enhancement",
                description: "Added automatic dark/light mode detection and persistence",
                type: "feature",
                color: "#bf8700"
            }
        ]
    },

    // Statistics Configuration
    stats: {
        enabled: true,
        title: "Project Metrics",
        metrics: [
            {
                id: "totalProjects",
                label: "Total Projects",
                value: 15,
                suffix: "+",
                animationDuration: 2000,
                color: "#0969da"
            },
            {
                id: "activeProjects", 
                label: "Active Projects",
                value: 5,
                suffix: "",
                animationDuration: 1500,
                color: "#1a7f37"
            },
            {
                id: "openSourceContributions",
                label: "Open Source",
                value: 8,
                suffix: "+",
                animationDuration: 2500,
                color: "#8250df"
            },
            {
                id: "technologiesUsed",
                label: "Technologies",
                value: 12,
                suffix: "+",
                animationDuration: 1800,
                color: "#bf8700"
            }
        ]
    },

    // Chart Options
    chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true
            }
        }
    },

    // Update intervals (in milliseconds)
    updateIntervals: {
        weeklyActivity: 300000, // 5 minutes
        projectStats: 600000,   // 10 minutes
        timeline: 1800000,      // 30 minutes
        stats: 60000            // 1 minute
    },

    // Animation settings
    animations: {
        enabled: true,
        duration: 800,
        easing: 'ease-in-out',
        stagger: 100 // delay between elements
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROJECT_ANALYTICS_CONFIG;
} else {
    window.PROJECT_ANALYTICS_CONFIG = PROJECT_ANALYTICS_CONFIG;
}