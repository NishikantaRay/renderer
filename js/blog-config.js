/**
 * Blog Configuration
 * Centralized configuration for all blog posts and settings
 */

const BLOG_CONFIG = {
    // Blog metadata
    title: "Personal Blog",
    description: "Thoughts on web development, technology, design, and everything in between.",
    
    // Pagination settings
    pagination: {
        postsPerPage: 1,
        enabled: true
    },
    
    // Blog posts configuration
    posts: [
        {
            id: 'typescript-modern-web',
            title: 'Building Modern Web Applications with TypeScript',
            description: 'TypeScript has revolutionized the way we build web applications. Learn about best practices, implementation strategies, and why TypeScript has become essential for modern development.',
            date: 'October 12, 2024',
            dateISO: '2024-10-12',
            tags: ['TypeScript', 'Web Development', 'JavaScript'],
            category: 'Development',
            contentPath: 'typescript-modern-web.md',
            author: 'Personal Portfolio',
            authorProfile: 'https://github.com/yourprofile',
            readTime: '8 min read',
            featured: true,
            repoUrl: 'https://github.com/yourrepo/typescript-modern-web',
            demoUrl: 'https://demo.example.com/typescript-modern-web',
            image: 'https://dummyimage.com/600x400/0066cc/ffffff&text=TypeScript+Web',
            license: 'MIT',
            contributors: ['Alice', 'Bob'],
            status: 'published',
            features: [
                'Type safety for large codebases',
                'Seamless integration with modern frameworks',
                'Improved developer productivity',
                'Better tooling and editor support'
            ],
            related: ['minimal-design', 'open-source-journey']
        },
        {
            id: 'minimal-design',
            title: 'The Art of Minimal Design',
            description: 'Exploring the philosophy and practice of minimal design in creating beautiful, functional user experiences that prioritize clarity and purpose.',
            date: 'October 8, 2024',
            dateISO: '2024-10-08',
            tags: ['Design', 'UX/UI', 'Philosophy'],
            category: 'Design',
            contentPath: 'minimal-design.md',
            author: 'Personal Portfolio',
            authorProfile: 'https://github.com/yourprofile',
            readTime: '6 min read',
            featured: false,
            repoUrl: 'https://github.com/yourrepo/minimal-design',
            demoUrl: 'https://demo.example.com/minimal-design',
            image: 'https://dummyimage.com/600x400/222/fff&text=Minimal+Design',
            license: 'MIT',
            contributors: ['Alice'],
            status: 'published',
            features: [
                'Focus on clarity and usability',
                'Reduction of visual clutter',
                'Enhanced user engagement',
                'Timeless design principles'
            ],
            related: ['typescript-modern-web']
        },
        {
            id: 'open-source-journey',
            title: 'My Journey into Open Source',
            description: 'From my first nervous pull request to becoming a maintainer, here\'s what I\'ve learned about contributing to open source projects and building meaningful connections in the developer community.',
            date: 'September 28, 2024',
            dateISO: '2024-09-28',
            tags: ['Open Source', 'Community', 'Career'],
            category: 'Community',
            contentPath: 'open-source-journey.md',
            author: 'Personal Portfolio',
            authorProfile: 'https://github.com/yourprofile',
            readTime: '10 min read',
            featured: false,
            repoUrl: 'https://github.com/yourrepo/open-source-journey',
            demoUrl: 'https://demo.example.com/open-source-journey',
            image: 'https://dummyimage.com/600x400/333/fff&text=Open+Source+Journey',
            license: 'MIT',
            contributors: ['Bob'],
            status: 'published',
            features: [
                'How to start contributing',
                'Building a network in OSS',
                'Learning from code reviews',
                'Growing as a maintainer'
            ],
            related: ['typescript-modern-web']
        }
    ],

    // Navigation between posts
    getPostNavigation(currentPostId) {
        const posts = this.posts;
        const currentIndex = posts.findIndex(post => post.id === currentPostId);
        
        if (currentIndex === -1) return { prev: null, next: null };

        const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

        return { prev, next };
    },

    // Get post by ID
    getPostById(id) {
        return this.posts.find(post => post.id === id);
    },

    // Get all posts sorted by date (newest first)
    getAllPosts() {
        return [...this.posts].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
    },

    // Get featured posts
    getFeaturedPosts() {
        return this.posts.filter(post => post.featured);
    },

    // Get posts by tag
    getPostsByTag(tag) {
        return this.posts.filter(post => 
            post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
        );
    },

    // Get all unique tags
    getAllTags() {
        const allTags = this.posts.flatMap(post => post.tags);
        return [...new Set(allTags)].sort();
    },

    // Pagination methods
    getPaginatedPosts(page = 1) {
        if (!this.pagination.enabled) {
            return {
                posts: this.getAllPosts(),
                totalPages: 1,
                currentPage: 1,
                hasNext: false,
                hasPrev: false
            };
        }

        const allPosts = this.getAllPosts();
        const { postsPerPage } = this.pagination;
        const totalPosts = allPosts.length;
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        const currentPage = Math.max(1, Math.min(page, totalPages));
        
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const posts = allPosts.slice(startIndex, endIndex);
        
        return {
            posts,
            totalPages,
            currentPage,
            totalPosts,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
            nextPage: currentPage < totalPages ? currentPage + 1 : null,
            prevPage: currentPage > 1 ? currentPage - 1 : null
        };
    },

    getPostsPerPage() {
        return this.pagination.postsPerPage;
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BLOG_CONFIG;
} else {
    window.BLOG_CONFIG = BLOG_CONFIG;
}