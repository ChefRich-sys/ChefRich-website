/**
 * ChefRich Recipe Manager - Modern Grid-Based Recipe Display
 * Features: Search, Filter, Grid Layout, Modal Details, Pagination, Responsive Design
 */

class ChefRichRecipeManager {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.currentPage = 1;
        this.recipesPerPage = 12;
        this.searchTerm = '';
        this.activeFilters = new Set();
        this.allTags = new Set();
        this.isLoading = false;

        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            await this.loadRecipes();
            this.setupEventListeners();
            this.renderRecipes();
            this.renderFilters();
            this.showLoading(false);
        } catch (error) {
            console.error('Failed to initialize ChefRich:', error);
            this.showError('Failed to load recipes. Please try again later.');
            this.showLoading(false);
        }
    }

    async loadRecipes() {
        // Simulate API call - replace with actual endpoint
        try {
            // For demo purposes, we'll create sample data
            // In production, replace with: const response = await fetch('/api/recipes');
            await this.delay(1000); // Simulate network delay
            this.recipes = this.generateSampleRecipes();
            this.filteredRecipes = [...this.recipes];
            this.extractTags();
        } catch (error) {
            throw new Error('Failed to fetch recipes: ' + error.message);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateSampleRecipes() {
        const sampleRecipes = [];
        const categories = ['Appetizer', 'Main Course', 'Dessert', 'Breakfast', 'Snack', 'Beverage'];
        const cuisines = ['Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian', 'French', 'Thai'];
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const dietTypes = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'];

        const recipeNames = [
            'Creamy Mushroom Risotto', 'Spicy Thai Curry', 'Classic Caesar Salad', 'Chocolate Lava Cake',
            'Grilled Salmon Teriyaki', 'Homemade Pizza Margherita', 'Beef Tacos Supreme', 'Chicken Tikka Masala',
            'Fresh Caprese Salad', 'Banana Bread Deluxe', 'Seafood Paella', 'Vegetable Stir Fry',
            'BBQ Pulled Pork', 'Greek Moussaka', 'Sushi Roll Platter', 'Pasta Carbonara',
            'Moroccan Tagine', 'Fish and Chips', 'Ratatouille ProvenÃ§al', 'Tiramisu Classic',
            'Korean Bibimbap', 'Chicken Parmesan', 'Quinoa Buddha Bowl', 'Beef Wellington',
            'Pad Thai Noodles', 'Stuffed Bell Peppers', 'Clam Chowder', 'Apple Pie Traditional',
            'Lamb Curry', 'Vegetable Lasagna', 'Shrimp Scampi', 'Chocolate Chip Cookies',
            'Beef Stroganoff', 'Caprese Stuffed Chicken', 'Lemon Garlic Roasted Vegetables', 'CrÃ¨me BrÃ»lÃ©e',
            'Turkey Meatballs', 'Spinach and Feta Quiche', 'Honey Glazed Ham', 'Fruit Tart',
            'Chicken Fajitas', 'Mushroom Soup', 'Grilled Vegetable Sandwich', 'Cheesecake New York Style',
            'Pork Chops with Apple Stuffing', 'Mediterranean Wrap', 'Lobster Bisque', 'Peach Cobbler',
            'Chicken Noodle Soup', 'Eggplant Parmesan', 'Grilled Steak', 'Ice Cream Sundae'
        ];

        for (let i = 1; i <= 50; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            const dietType = Math.random() > 0.7 ? dietTypes[Math.floor(Math.random() * dietTypes.length)] : null;
            const recipeName = recipeNames[Math.floor(Math.random() * recipeNames.length)];

            const tags = [category, cuisine, difficulty];
            if (dietType) tags.push(dietType);

            sampleRecipes.push({
                id: i,
                title: `${recipeName} ${i}`,
                description: `A delicious ${cuisine.toLowerCase()} ${category.toLowerCase()} that combines authentic flavors with modern cooking techniques. Perfect for ${difficulty.toLowerCase()} skill level cooks who want to create something special.`,
                image: `https://picsum.photos/400/300?random=${i}`,
                cookTime: Math.floor(Math.random() * 90) + 15,
                prepTime: Math.floor(Math.random() * 30) + 5,
                servings: Math.floor(Math.random() * 6) + 2,
                difficulty: difficulty,
                tags: tags,
                ingredients: this.generateIngredients(),
                instructions: this.generateInstructions(),
                rating: (Math.random() * 2 + 3).toFixed(1),
                author: `Chef ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(97 + Math.floor(Math.random() * 26))}`,
                calories: Math.floor(Math.random() * 500) + 200,
                protein: Math.floor(Math.random() * 30) + 10,
                carbs: Math.floor(Math.random() * 50) + 20,
                fat: Math.floor(Math.random() * 25) + 5
            });
        }

        return sampleRecipes;
    }

    generateIngredients() {
        const ingredients = [
            '2 cups fresh vegetables, diced',
            '1 lb premium protein of choice',
            '3 cloves garlic, minced',
            '2 tbsp olive oil',
            '1 tsp sea salt',
            '1/2 tsp black pepper',
            '1 cup broth or stock',
            '2 tbsp fresh herbs, chopped',
            '1 medium onion, sliced',
            '1/4 cup white wine (optional)'
        ];

        const count = Math.floor(Math.random() * 4) + 6;
        return ingredients.slice(0, count);
    }

    generateInstructions() {
        const instructions = [
            'Prepare all ingredients by washing, chopping, and measuring as needed.',
            'Heat olive oil in a large pan or skillet over medium-high heat.',
            'Add aromatics like garlic and onion, sautÃ© until fragrant.',
            'Add main protein and cook according to recipe requirements.',
            'Season with salt, pepper, and desired spices.',
            'Add vegetables and cook until tender-crisp.',
            'Pour in liquid ingredients and bring to a simmer.',
            'Reduce heat and let flavors meld together.',
            'Taste and adjust seasoning as needed.',
            'Garnish with fresh herbs and serve immediately.'
        ];

        const count = Math.floor(Math.random() * 3) + 6;
        return instructions.slice(0, count);
    }

    extractTags() {
        this.recipes.forEach(recipe => {
            recipe.tags.forEach(tag => this.allTags.add(tag));
        });
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterRecipes();
            }, 300));
        }

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.toggleFilter(e.target.dataset.filter);
            }

            if (e.target.classList.contains('recipe-card') || e.target.closest('.recipe-card')) {
                const card = e.target.closest('.recipe-card') || e.target;
                const recipeId = parseInt(card.dataset.recipeId);
                this.showRecipeModal(recipeId);
            }

            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-btn')) {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderRecipes();
                this.scrollToTop();
            }
        });

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortRecipes(e.target.value);
            });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    toggleFilter(filter) {
        if (this.activeFilters.has(filter)) {
            this.activeFilters.delete(filter);
        } else {
            this.activeFilters.add(filter);
        }

        this.updateFilterButtons();
        this.filterRecipes();
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const filter = btn.dataset.filter;
            btn.classList.toggle('active', this.activeFilters.has(filter));
        });
    }

    clearAllFilters() {
        this.activeFilters.clear();
        this.searchTerm = '';
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) searchInput.value = '';
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'default';
        this.updateFilterButtons();
        this.filterRecipes();
    }

    sortRecipes(sortBy) {
        switch (sortBy) {
            case 'title':
                this.filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'rating':
                this.filteredRecipes.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
                break;
            case 'cookTime':
                this.filteredRecipes.sort((a, b) => a.cookTime - b.cookTime);
                break;
            case 'difficulty':
                const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                this.filteredRecipes.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
                break;
            default:
                this.filteredRecipes = [...this.recipes].filter(recipe => this.matchesFilters(recipe));
        }
        this.currentPage = 1;
        this.renderRecipes();
    }

    filterRecipes() {
        this.filteredRecipes = this.recipes.filter(recipe => this.matchesFilters(recipe));
        this.currentPage = 1;
        this.renderRecipes();
        this.updateResultsCount();
    }

    matchesFilters(recipe) {
        // Search filter
        const matchesSearch = !this.searchTerm || 
            recipe.title.toLowerCase().includes(this.searchTerm) ||
            recipe.description.toLowerCase().includes(this.searchTerm) ||
            recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(this.searchTerm)
            ) ||
            recipe.author.toLowerCase().includes(this.searchTerm);

        // Tag filters
        const matchesFilters = this.activeFilters.size === 0 || 
            [...this.activeFilters].every(filter => 
                recipe.tags.includes(filter)
            );

        return matchesSearch && matchesFilters;
    }

    renderRecipes() {
        const container = document.getElementById('recipes-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.recipesPerPage;
        const endIndex = startIndex + this.recipesPerPage;
        const recipesToShow = this.filteredRecipes.slice(startIndex, endIndex);

        if (recipesToShow.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">ðŸ”</div>
                    <h3>No recipes found</h3>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recipesToShow.map(recipe => this.createRecipeCard(recipe)).join('');
        this.renderPagination();

        // Add intersection observer for lazy loading
        this.setupLazyLoading();
    }

    createRecipeCard(recipe) {
        return `
            <article class="recipe-card" data-recipe-id="${recipe.id}">
                <div class="recipe-image">
                    <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
                    <div class="recipe-rating">
                        <span class="stars">${this.generateStars(recipe.rating)}</span>
                        <span class="rating-number">${recipe.rating}</span>
                    </div>
                    <div class="recipe-quick-info">
                        <span class="calories">${recipe.calories} cal</span>
                    </div>
                </div>
                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <p class="recipe-description">${this.truncateText(recipe.description, 100)}</p>
                    <div class="recipe-meta">
                        <span class="cook-time">
                            <i class="icon-clock">â±ï¸</i> ${recipe.cookTime} min
                        </span>
                        <span class="servings">
                            <i class="icon-users">ðŸ‘¥</i> ${recipe.servings} servings
                        </span>
                        <span class="difficulty difficulty-${recipe.difficulty.toLowerCase()}">
                            ${recipe.difficulty}
                        </span>
                    </div>
                    <div class="recipe-nutrition">
                        <span>P: ${recipe.protein}g</span>
                        <span>C: ${recipe.carbs}g</span>
                        <span>F: ${recipe.fat}g</span>
                    </div>
                    <div class="recipe-tags">
                        ${recipe.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        ${recipe.tags.length > 3 ? `<span class="tag-more">+${recipe.tags.length - 3}</span>` : ''}
                    </div>
                    <div class="recipe-author">
                        <span>By ${recipe.author}</span>
                    </div>
                </div>
            </article>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += 'â˜…';
        }
        if (hasHalfStar) {
            stars += 'â˜†';
        }

        return stars;
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    renderFilters() {
        const filterContainer = document.getElementById('filters-container');
        if (!filterContainer) return;

        const filterHTML = [...this.allTags].sort().map(tag => `
            <button class="filter-btn" data-filter="${tag}">
                ${tag}
            </button>
        `).join('');

        filterContainer.innerHTML = filterHTML;
    }

    renderPagination() {
        const paginationContainer = document.getElementById('pagination-container');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredRecipes.length / this.recipesPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage - 1}">â† Previous</button>`;
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage + 1}">Next â†’</button>`;
        }

        paginationContainer.innerHTML = paginationHTML;
    }

    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            const total = this.filteredRecipes.length;
            const showing = Math.min(this.recipesPerPage, total - (this.currentPage - 1) * this.recipesPerPage);
            const start = total > 0 ? (this.currentPage - 1) * this.recipesPerPage + 1 : 0;
            const end = (this.currentPage - 1) * this.recipesPerPage + showing;

            countElement.textContent = `Showing ${start}-${end} of ${total} recipes`;
        }
    }

    showRecipeModal(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const modal = document.getElementById('recipe-modal');
        const modalContent = document.getElementById('modal-recipe-content');

        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${recipe.title}</h2>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="recipe-image-large">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </div>
                <div class="recipe-details">
                    <div class="recipe-meta-large">
                        <div class="meta-item">
                            <strong>Prep Time:</strong> ${recipe.prepTime} minutes
                        </div>
                        <div class="meta-item">
                            <strong>Cook Time:</strong> ${recipe.cookTime} minutes
                        </div>
                        <div class="meta-item">
                            <strong>Total Time:</strong> ${recipe.prepTime + recipe.cookTime} minutes
                        </div>
                        <div class="meta-item">
                            <strong>Servings:</strong> ${recipe.servings}
                        </div>
                        <div class="meta-item">
                            <strong>Difficulty:</strong> ${recipe.difficulty}
                        </div>
                        <div class="meta-item">
                            <strong>Rating:</strong> ${this.generateStars(recipe.rating)} ${recipe.rating}
                        </div>
                        <div class="meta-item">
                            <strong>Calories:</strong> ${recipe.calories} per serving
                        </div>
                        <div class="meta-item">
                            <strong>By:</strong> ${recipe.author}
                        </div>
                    </div>
                    <div class="recipe-description-full">
                        <p>${recipe.description}</p>
                    </div>
                    <div class="recipe-nutrition-full">
                        <h3>Nutrition Information (per serving)</h3>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <span class="nutrition-label">Calories</span>
                                <span class="nutrition-value">${recipe.calories}</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Protein</span>
                                <span class="nutrition-value">${recipe.protein}g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Carbs</span>
                                <span class="nutrition-value">${recipe.carbs}g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Fat</span>
                                <span class="nutrition-value">${recipe.fat}g</span>
                            </div>
                        </div>
                    </div>
                    <div class="recipe-ingredients">
                        <h3>Ingredients</h3>
                        <ul>
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="recipe-instructions">
                        <h3>Instructions</h3>
                        <ol>
                            ${recipe.instructions.map((instruction, index) => `
                                <li>
                                    <span class="step-number">${index + 1}</span>
                                    <span class="step-text">${instruction}</span>
                                </li>
                            `).join('')}
                        </ol>
                    </div>
                    <div class="recipe-tags-modal">
                        <h3>Tags</h3>
                        <div class="tags-container">
                            ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) closeButton.focus();
    }

    closeModal() {
        const modal = document.getElementById('recipe-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showLoading(show) {
        const container = document.getElementById('recipes-container');
        if (!container) return;

        if (show) {
            container.innerHTML = '<div class="loading">Loading delicious recipes...</div>';
        }
    }

    showError(message) {
        const container = document.getElementById('recipes-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">âš ï¸</div>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-btn">Try Again</button>
                </div>
            `;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChefRichRecipeManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChefRichRecipeManager;
}
