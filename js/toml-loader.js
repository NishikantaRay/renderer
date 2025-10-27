/**
 * Shared TOML Parser Loader Utility
 * Provides a centralized way to load and cache TOML parsers for the portfolio
 */

class TomlLoader {
    constructor() {
        this.parser = null;
        this.isLoading = false;
        this.loadPromise = null;
    }

    // Get or load the TOML parser
    async getParser() {
        // Return cached parser if available
        if (this.parser) {
            return this.parser;
        }

        // If already loading, wait for the existing promise
        if (this.isLoading && this.loadPromise) {
            return await this.loadPromise;
        }

        // Start loading process
        this.isLoading = true;
        this.loadPromise = this.loadTomlParser();
        
        try {
            this.parser = await this.loadPromise;
            return this.parser;
        } finally {
            this.isLoading = false;
            this.loadPromise = null;
        }
    }

    // Load TOML parser from various sources
    async loadTomlParser() {
        // Check if parser is already globally available
        if (window.toml && window.toml.parse) {
            // Console log removed
            return window.toml;
        }

        if (window.TOML && window.TOML.parse) {
            // Console log removed
            return window.TOML;
        }

        // Wait a bit for scripts to load if they're still loading
        // Console log removed
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check again after waiting
        if (window.toml && window.toml.parse) {
            // Console log removed
            return window.toml;
        }

        if (window.TOML && window.TOML.parse) {
            // Console log removed
            return window.TOML;
        }

        // Console log removed

        // Instead of trying CDNs (which are failing), go directly to simple parser
        // Console log removed
        return this.createSimpleTomlParser();
    }

    // Load parser from a specific CDN URL
    loadParserFromCDN(url, globalName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            
            const timeout = setTimeout(() => {
                script.remove();
                reject(new Error(`Timeout loading script from ${url}`));
            }, 5000); // Reduced timeout to 5 seconds
            
            script.onload = () => {
                clearTimeout(timeout);
                // Wait a bit for the script to initialize
                setTimeout(() => {
                    const parser = window[globalName];
                    if (parser && parser.parse) {
                        resolve(parser);
                    } else {
                        reject(new Error(`Parser not found at window.${globalName}`));
                    }
                }, 100);
            };
            
            script.onerror = () => {
                clearTimeout(timeout);
                reject(new Error(`Failed to load script from ${url}`));
            };

            document.head.appendChild(script);
        });
    }

    // Parse TOML content with error handling
    async parse(tomlContent) {
        const parser = await this.getParser();
        
        if (!parser || !parser.parse) {
            throw new Error('No TOML parser available');
        }

        try {
            // Console log removed
            const result = parser.parse(tomlContent);
            // Console log removed
            return result;
        } catch (parseError) {
            // Console error removed;
            throw new Error(`TOML parsing failed: ${parseError.message}`);
        }
    }

    // Check if a parser is available (non-async)
    isParserAvailable() {
        return this.parser !== null || 
               (window.toml && window.toml.parse) || 
               (window.TOML && window.TOML.parse);
    }

    // Reset the loader (useful for testing or force reload)
    reset() {
        this.parser = null;
        this.isLoading = false;
        this.loadPromise = null;
    }

    // Create a simple TOML parser for basic parsing when CDNs fail
    createSimpleTomlParser() {
        // Console log removed
        return {
            _isSimpleParser: true,
            parse: (tomlString) => {
                // Console log removed
                return this.parseTomlSimple(tomlString);
            }
        };
    }

    // Simple TOML parser for basic cases (handles strings, booleans, numbers, arrays, and basic tables)
    parseTomlSimple(tomlString) {
        const result = {};
        const lines = tomlString.split('\n');
        let currentSection = result;
        let currentSectionName = '';
        let currentArray = null;
        let currentArrayKey = null;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            
            // Skip empty lines and comments
            if (!line || line.startsWith('#')) continue;

            // Handle array-of-tables [[section.array]]
            if (line.startsWith('[[') && line.endsWith(']]')) {
                // Finish any pending array
                if (currentArray !== null) {
                    currentSection[currentArrayKey] = currentArray;
                    currentArray = null;
                    currentArrayKey = null;
                }
                
                const arrayTableName = line.slice(2, -2); // Remove [[ and ]]
                const parts = arrayTableName.split('.');
                
                // Navigate to the correct section and create array if needed
                let section = result;
                for (let j = 0; j < parts.length - 1; j++) {
                    section[parts[j]] = section[parts[j]] || {};
                    section = section[parts[j]];
                }
                
                const arrayKey = parts[parts.length - 1];
                if (!section[arrayKey]) {
                    section[arrayKey] = [];
                }
                
                // Add new object to the array
                const newItem = {};
                section[arrayKey].push(newItem);
                currentSection = newItem;
                continue;
            }

            // Handle regular sections [section]
            if (line.startsWith('[') && line.endsWith(']') && !line.startsWith('[[')) {
                // Finish any pending array
                if (currentArray !== null) {
                    currentSection[currentArrayKey] = currentArray;
                    currentArray = null;
                    currentArrayKey = null;
                }
                
                currentSectionName = line.slice(1, -1);
                
                // Handle nested sections like [hero.actions]
                if (currentSectionName.includes('.')) {
                    const parts = currentSectionName.split('.');
                    let section = result;
                    for (let j = 0; j < parts.length; j++) {
                        if (j === parts.length - 1) {
                            section[parts[j]] = section[parts[j]] || {};
                            currentSection = section[parts[j]];
                        } else {
                            section[parts[j]] = section[parts[j]] || {};
                            section = section[parts[j]];
                        }
                    }
                } else {
                    currentSection = result[currentSectionName] = {};
                }
                continue;
            }

            // Handle multi-line arrays
            if (currentArray !== null) {
                // Check if this line ends the array
                if (line.endsWith(']')) {
                    line = line.slice(0, -1).trim();
                    if (line && line !== ',') {
                        currentArray.push(this.parseTomlValue(line.replace(/,$/, '')));
                    }
                    currentSection[currentArrayKey] = currentArray;
                    currentArray = null;
                    currentArrayKey = null;
                    continue;
                } else {
                    // Add item to current array
                    const cleanLine = line.replace(/,$/, '').trim();
                    if (cleanLine) {
                        currentArray.push(this.parseTomlValue(cleanLine));
                    }
                    continue;
                }
            }

            // Handle key-value pairs
            const eqIndex = line.indexOf('=');
            if (eqIndex === -1) continue;

            const key = line.slice(0, eqIndex).trim();
            let value = line.slice(eqIndex + 1).trim();

            // Check if this starts a multi-line array
            if (value === '[' || (value.startsWith('[') && !value.endsWith(']'))) {
                currentArrayKey = key;
                currentArray = [];
                
                // If the array starts with content on the same line
                if (value.length > 1) {
                    const firstItem = value.slice(1).trim();
                    if (firstItem && firstItem !== ',') {
                        currentArray.push(this.parseTomlValue(firstItem.replace(/,$/, '')));
                    }
                }
                continue;
            }

            // Parse single-line values
            currentSection[key] = this.parseTomlValue(value);
        }

        // Finish any pending array
        if (currentArray !== null) {
            currentSection[currentArrayKey] = currentArray;
        }

        return result;
    }

    // Parse individual TOML values
    parseTomlValue(value) {
        value = value.trim();

        // Remove inline comments (but not if # is inside quotes)
        let commentIndex = -1;
        let inQuotes = false;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === '"' && (i === 0 || value[i-1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (value[i] === '#' && !inQuotes) {
                commentIndex = i;
                break;
            }
        }
        
        if (commentIndex !== -1) {
            value = value.slice(0, commentIndex).trim();
        }

        // Handle arrays
        if (value.startsWith('[') && value.endsWith(']')) {
            const arrayContent = value.slice(1, -1).trim();
            if (!arrayContent) return [];
            
            const items = [];
            let current = '';
            let inQuotes = false;
            let depth = 0;

            for (let i = 0; i < arrayContent.length; i++) {
                const char = arrayContent[i];
                
                if (char === '"' && (i === 0 || arrayContent[i-1] !== '\\')) {
                    inQuotes = !inQuotes;
                    current += char;
                } else if (char === '[' && !inQuotes) {
                    depth++;
                    current += char;
                } else if (char === ']' && !inQuotes) {
                    depth--;
                    current += char;
                } else if (char === ',' && !inQuotes && depth === 0) {
                    items.push(this.parseTomlValue(current.trim()));
                    current = '';
                } else {
                    current += char;
                }
            }
            
            if (current.trim()) {
                items.push(this.parseTomlValue(current.trim()));
            }
            
            return items;
        }

        // Handle strings
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
            return value.slice(1, -1);
        }

        // Handle booleans
        if (value === 'true') return true;
        if (value === 'false') return false;

        // Handle numbers
        if (/^-?\d+$/.test(value)) return parseInt(value, 10);
        if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);

        // Return as string if nothing else matches
        return value;
    }
}

// Create global instance
window.tomlLoader = new TomlLoader();

// Helper function for backward compatibility
window.loadTomlParser = () => window.tomlLoader.getParser();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TomlLoader;
}