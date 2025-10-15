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
        postsPerPage: 6,
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
            related: ['minimal-design', 'open-source-journey'],
            fallbackContent: `
                <h1>Building Modern Web Applications with TypeScript</h1>
                
                <p>TypeScript has fundamentally changed how we approach web development. By adding static type checking to JavaScript, it provides developers with powerful tools for building robust, scalable applications.</p>
                
                <h2>Why TypeScript Matters</h2>
                
                <p>In today's complex web development landscape, TypeScript offers several compelling advantages:</p>
                
                <ul>
                    <li><strong>Type Safety</strong> - Catch errors at compile time rather than runtime</li>
                    <li><strong>Better Tooling</strong> - Enhanced IDE support with autocomplete and refactoring</li>
                    <li><strong>Improved Maintainability</strong> - Self-documenting code through type annotations</li>
                    <li><strong>Team Collaboration</strong> - Clearer interfaces and contracts between code modules</li>
                </ul>
                
                <h2>Modern Framework Integration</h2>
                
                <p>TypeScript seamlessly integrates with popular frameworks:</p>
                
                <h3>React with TypeScript</h3>
                <pre><code>interface UserProps {
  name: string;
  email: string;
  isActive: boolean;
}

const UserComponent: React.FC&lt;UserProps&gt; = ({ name, email, isActive }) => {
  return (
    &lt;div className={isActive ? 'user-active' : 'user-inactive'}&gt;
      &lt;h3&gt;{name}&lt;/h3&gt;
      &lt;p&gt;{email}&lt;/p&gt;
    &lt;/div&gt;
  );
};</code></pre>
                
                <h3>Vue 3 Composition API</h3>
                <pre><code>import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  setup() {
    const count = ref&lt;number&gt;(0)
    const doubleCount = computed(() => count.value * 2)
    
    const increment = (): void => {
      count.value++
    }
    
    return {
      count,
      doubleCount,
      increment
    }
  }
})</code></pre>
                
                <h2>Best Practices</h2>
                
                <p>When building applications with TypeScript, consider these best practices:</p>
                
                <ol>
                    <li><strong>Start Strict</strong> - Enable strict mode from the beginning</li>
                    <li><strong>Define Interfaces</strong> - Create clear contracts for your data structures</li>
                    <li><strong>Use Generics</strong> - Make your code reusable and type-safe</li>
                    <li><strong>Leverage Union Types</strong> - Handle multiple possible types elegantly</li>
                </ol>
                
                <h2>Advanced TypeScript Features</h2>
                
                <p>Modern TypeScript includes powerful features for complex applications:</p>
                
                <ul>
                    <li>Template Literal Types</li>
                    <li>Conditional Types</li>
                    <li>Mapped Types</li>
                    <li>Utility Types (Pick, Omit, Partial, etc.)</li>
                </ul>
                
                <p>TypeScript continues to evolve, making it an excellent choice for modern web development. Its combination of developer experience improvements and runtime safety makes it indispensable for large-scale applications.</p>
            `
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
            related: ['typescript-modern-web'],
            fallbackContent: `
                <h1>The Art of Minimal Design</h1>
                
                <p>In a world increasingly cluttered with digital noise, minimal design stands as a beacon of clarity and purpose. More than just an aesthetic choice, minimalism is a philosophy that prioritizes function, reduces cognitive load, and creates meaningful user experiences.</p>
                
                <h2>Understanding Minimal Design</h2>
                
                <p>Minimal design isn't about having less—it's about having just enough. It's the careful curation of elements to support the primary goal while eliminating everything that doesn't serve that purpose.</p>
                
                <h3>The Core Principles</h3>
                
                <p><strong>1. Purpose-Driven Design</strong><br>
                Every element should have a clear reason for existing. If you can't articulate why something is there, it probably shouldn't be.</p>
                
                <p><strong>2. Hierarchy Through Whitespace</strong><br>
                Space isn't empty—it's an active design element that creates relationships, guides attention, and provides breathing room for content.</p>
                
                <p><strong>3. Typography as Design</strong><br>
                When visual elements are stripped away, typography becomes the primary tool for creating hierarchy, personality, and visual interest.</p>
                
                <h2>The Psychology of Minimalism</h2>
                
                <p>Minimal design works because it aligns with how our brains process information:</p>
                
                <ul>
                    <li><strong>Reduced Cognitive Load</strong> - Fewer elements mean less mental processing required</li>
                    <li><strong>Improved Focus</strong> - Clear hierarchy directs attention to what matters most</li>
                    <li><strong>Enhanced Usability</strong> - Simplified interfaces are easier to navigate and understand</li>
                    <li><strong>Emotional Clarity</strong> - Clean designs often feel more trustworthy and professional</li>
                </ul>
                
                <h2>Implementing Minimal Design</h2>
                
                <p>Creating effective minimal design requires careful consideration of several factors:</p>
                
                <h3>Color Palette</h3>
                <p>Limit your color palette to 2-3 primary colors. Use color purposefully—for emphasis, hierarchy, or brand recognition, not decoration.</p>
                
                <h3>Typography</h3>
                <p>Choose 1-2 fonts maximum. Let typography do the heavy lifting through:</p>
                <ul>
                    <li>Font weight variations (light, regular, bold)</li>
                    <li>Size hierarchy (h1, h2, body text)</li>
                    <li>Spacing and line height</li>
                </ul>
                
                <p>Minimal design is not about restriction—it's about intention. Every choice should serve the user's needs and the project's goals.</p>
            `
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
            related: ['typescript-modern-web'],
            fallbackContent: `
                <h1>My Journey into Open Source</h1>
                
                <p>My journey into open source began with curiosity and a lot of nervousness. Like many developers, I was intimidated by the idea of contributing to projects used by thousands of people. Today, I want to share what I've learned and hopefully inspire others to take that first step.</p>
                
                <h2>The First Contribution</h2>
                
                <p>My first contribution wasn't code—it was fixing a typo in documentation. It might seem trivial, but it taught me the entire workflow:</p>
                
                <ul>
                    <li>Forking a repository</li>
                    <li>Creating a feature branch</li>
                    <li>Making changes and committing</li>
                    <li>Creating a pull request</li>
                    <li>Responding to feedback</li>
                </ul>
                
                <p>That small documentation fix gave me the confidence to tackle bigger challenges.</p>
                
                <h2>Finding the Right Projects</h2>
                
                <p>Not all open source projects are beginner-friendly. Here's what to look for:</p>
                
                <h3>Good Documentation</h3>
                <p>Projects with clear README files, contributing guidelines, and code of conduct are more likely to welcome new contributors.</p>
                
                <h3>Active Community</h3>
                <p>Look for projects with recent activity, responsive maintainers, and helpful community members in discussions.</p>
                
                <h3>Beginner-Friendly Labels</h3>
                <p>Issues labeled with "good first issue," "beginner," or "help wanted" are perfect starting points.</p>
                
                <h2>Types of Contributions</h2>
                
                <p>Open source contributions aren't just about code:</p>
                
                <ul>
                    <li><strong>Documentation</strong> - Improving README files, adding examples, fixing typos</li>
                    <li><strong>Bug Reports</strong> - Providing detailed, reproducible bug reports</li>
                    <li><strong>Feature Requests</strong> - Suggesting improvements with clear use cases</li>
                    <li><strong>Code Reviews</strong> - Reviewing other contributors' pull requests</li>
                    <li><strong>Community Support</strong> - Helping others in discussions and forums</li>
                    <li><strong>Testing</strong> - Testing new features and providing feedback</li>
                </ul>
                
                <h2>Building Relationships</h2>
                
                <p>The most valuable aspect of open source isn't the code—it's the people. I've built lasting professional relationships and learned from incredible developers worldwide.</p>
                
                <h3>Tips for Community Engagement</h3>
                
                <ol>
                    <li><strong>Be Respectful</strong> - Remember there are humans behind every username</li>
                    <li><strong>Ask Questions</strong> - Don't be afraid to ask for clarification</li>
                    <li><strong>Share Knowledge</strong> - Help others when you can</li>
                    <li><strong>Be Patient</strong> - Maintainers are often volunteers with limited time</li>
                </ol>
                
                <h2>Learning from Code Reviews</h2>
                
                <p>Code reviews in open source projects are educational goldmines. I've learned more from thoughtful code reviews than from many tutorials:</p>
                
                <ul>
                    <li>Best practices and coding standards</li>
                    <li>Performance optimization techniques</li>
                    <li>Security considerations</li>
                    <li>Alternative approaches to solving problems</li>
                </ul>
                
                <h2>From Contributor to Maintainer</h2>
                
                <p>After consistent contributions, I was invited to become a maintainer on several projects. This taught me:</p>
                
                <ul>
                    <li><strong>Responsibility</strong> - Maintaining quality while being welcoming to new contributors</li>
                    <li><strong>Communication</strong> - Providing clear, constructive feedback</li>
                    <li><strong>Project Vision</strong> - Balancing feature requests with project goals</li>
                    <li><strong>Community Building</strong> - Creating an inclusive environment for all contributors</li>
                </ul>
                
                <h2>Impact Beyond Code</h2>
                
                <p>Open source contributions have profoundly impacted my career:</p>
                
                <ul>
                    <li>Improved my coding skills through exposure to high-quality codebases</li>
                    <li>Built a portfolio visible to potential employers</li>
                    <li>Developed communication and collaboration skills</li>
                    <li>Created a global network of developer friends and mentors</li>
                    <li>Gained confidence in my abilities</li>
                </ul>
                
                <h2>Getting Started Today</h2>
                
                <p>If you're interested in contributing to open source, here's how to start:</p>
                
                <ol>
                    <li>Find a project you use and appreciate</li>
                    <li>Read the contributing guidelines</li>
                    <li>Start small—fix documentation or report bugs</li>
                    <li>Engage with the community respectfully</li>
                    <li>Be persistent but patient</li>
                </ol>
                
                <p>Remember, every expert was once a beginner. The open source community is generally welcoming to newcomers who show genuine interest in learning and contributing.</p>
                
                <p>Your first contribution might feel small, but it's the beginning of a journey that can transform your career and introduce you to an amazing global community of developers.</p>
            `
        },
        {
            id: 'web-performance-optimization',
            title: 'Web Performance Optimization: Beyond the Basics',
            description: 'Deep dive into advanced web performance optimization techniques, from critical rendering path optimization to service worker strategies.',
            date: 'September 15, 2024',
            dateISO: '2024-09-15',
            tags: ['Performance', 'Web Development', 'Optimization', 'Core Web Vitals'],
            category: 'Development',
            contentPath: 'web-performance-optimization.md',
            author: 'Personal Portfolio',
            authorProfile: 'https://github.com/yourprofile',
            readTime: '12 min read',
            featured: false,
            repoUrl: 'https://github.com/yourrepo/web-performance-demos',
            demoUrl: 'https://performance-demo.yoursite.dev',
            image: 'https://dummyimage.com/600x400/ff6b35/ffffff&text=Web+Performance',
            license: 'MIT',
            contributors: ['John Doe'],
            status: 'published',
            features: [
                'Critical rendering path optimization',
                'Service worker implementation', 
                'Core Web Vitals improvement',
                'Advanced caching strategies'
            ],
            related: ['typescript-modern-web'],
            fallbackContent: `
                <h1>Web Performance Optimization: Beyond the Basics</h1>
                
                <p>Web performance optimization is crucial for creating excellent user experiences. In this comprehensive guide, we'll explore advanced techniques that go beyond basic optimizations.</p>
                
                <h2>Understanding Core Web Vitals</h2>
                
                <p>Core Web Vitals are a set of specific factors that Google considers important in a webpage's overall user experience. These metrics include:</p>
                
                <ul>
                    <li><strong>Largest Contentful Paint (LCP)</strong> - Measures loading performance</li>
                    <li><strong>First Input Delay (FID)</strong> - Measures interactivity</li>
                    <li><strong>Cumulative Layout Shift (CLS)</strong> - Measures visual stability</li>
                </ul>
                
                <h2>Critical Rendering Path Optimization</h2>
                
                <p>The critical rendering path is the sequence of steps the browser goes through to convert HTML, CSS, and JavaScript into pixels on the screen.</p>
                
                <h3>Key Strategies:</h3>
                
                <ol>
                    <li><strong>Minimize Critical Resources</strong> - Reduce the number of critical resources by inlining critical CSS and deferring non-critical JavaScript.</li>
                    <li><strong>Optimize Resource Loading</strong> - Use preload hints for critical resources and prefetch for future navigation resources.</li>
                    <li><strong>Reduce Render-Blocking</strong> - Eliminate render-blocking resources or make them asynchronous.</li>
                </ol>
                
                <h2>Service Worker Implementation</h2>
                
                <p>Service workers provide powerful caching strategies that can dramatically improve performance for returning users.</p>
                
                <pre><code>// Example service worker caching strategy
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});</code></pre>
                
                <h2>Advanced Caching Strategies</h2>
                
                <p>Implementing effective caching strategies can significantly reduce load times and improve user experience:</p>
                
                <ul>
                    <li><strong>Cache-First Strategy</strong> - Serve from cache first, network as fallback</li>
                    <li><strong>Network-First Strategy</strong> - Try network first, cache as fallback</li>
                    <li><strong>Stale-While-Revalidate</strong> - Serve from cache while updating in background</li>
                </ul>
                
                <p>By implementing these advanced optimization techniques, you can achieve significant improvements in your web application's performance metrics and provide a better user experience.</p>
            `
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