// ChefRich Recipe Display Application - New ChatGPT Template Format
class ChefRichApp {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.currentFilters = {
            search: '',
            tags: []
        };
        this.init();
    }

    async init() {
        try {
            await this.loadRecipes();
            this.setupEventListeners();
            this.displayRecipes();
        } catch (error) {
            console.error('Error initializing ChefRich app:', error);
            this.showError('Failed to load recipes. Please try again later.');
        }
    }

    async loadRecipes() {
        try {
            Copyconst response = await fetch('../../recipes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.recipes = data.recipes || data;
            this.filteredRecipes = [...this.recipes];
            console.log(`Loaded ${this.recipes.length} recipes`);
        } catch (error) {
            console.error('Error loading recipes:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('recipe-search') || 
                           document.querySelector('.search-input') ||
                           document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredRecipes = this.recipes.filter(recipe => {
            // Search filter
            const searchMatch = !this.currentFilters.search || 
                recipe.title_with_emoji.toLowerCase().includes(this.currentFilters.search) ||
                recipe.description.toLowerCase().includes(this.currentFilters.search) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(this.currentFilters.search));

            return searchMatch;
        });

        this.displayRecipes();
    }

    displayRecipes() {
        const container = document.getElementById('recipes-container') || 
                         document.querySelector('.recipes-grid') ||
                         document.querySelector('.recipe-container') ||
                         document.querySelector('.recipes') ||
                         document.querySelector('#recipe-list');
        
        if (!container) {
            console.error('Recipe container not found');
            return;
        }

        if (this.filteredRecipes.length === 0) {
            container.innerHTML = '<div class="no-results">No recipes found matching your criteria.</div>';
            return;
        }

        container.innerHTML = this.filteredRecipes.map(recipe => this.createRecipeCard(recipe)).join('');
        
        // Add click event listeners to recipe cards
        this.setupRecipeCardListeners();
    }

    createRecipeCard(recipe) {
        const tagsHtml = recipe.tags.map(tag => 
            `<span class="recipe-tag">#${tag}</span>`
        ).join('');

        const yieldTimeHtml = this.formatYieldAndTime(recipe.yield_and_time);

        return `
            <div class="recipe-card" data-recipe-id="${recipe.id || recipe.title_with_emoji}">
                <div class="recipe-card-header">
                    <h3 class="recipe-title">${recipe.title_with_emoji}</h3>
                    <div class="recipe-tags">${tagsHtml}</div>
                </div>
                
                <div class="recipe-description">
                    <p>${recipe.description}</p>
                </div>

                <div class="recipe-yield-time">
                    ${yieldTimeHtml}
                </div>

                <div class="recipe-preview">
                    <div class="ingredients-preview">
                        <h4>Key Ingredients:</h4>
                        <p>${recipe.ingredients.slice(0, 3).join(', ')}${recipe.ingredients.length > 3 ? '...' : ''}</p>
                    </div>
                </div>

                <button class="view-recipe-btn" onclick="chefRichApp.showRecipeModal('${recipe.id || recipe.title_with_emoji}')">
                    View Full Recipe
                </button>
            </div>
        `;
    }

    formatYieldAndTime(yieldTime) {
        if (!yieldTime) return '';
        
        let html = '<div class="yield-time-info">';
        
        if (yieldTime.yield) {
            html += `<span class="yield-info">🍽️ ${yieldTime.yield}</span>`;
        }
        
        if (yieldTime.prep_time) {
            html += `<span class="time-info">⏱️ Prep: ${yieldTime.prep_time}</span>`;
        }
        
        if (yieldTime.cook_time && yieldTime.cook_time !== "0 minutes") {
            html += `<span class="time-info">🔥 Cook: ${yieldTime.cook_time}</span>`;
        }
        
        if (yieldTime.total_time) {
            html += `<span class="time-info total-time">⏰ Total: ${yieldTime.total_time}</span>`;
        }
        
        html += '</div>';
        return html;
    }

    setupRecipeCardListeners() {
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('view-recipe-btn')) {
                    const recipeId = card.dataset.recipeId;
                    this.showRecipeModal(recipeId);
                }
            });
        });
    }

    showRecipeModal(recipeId) {
        const recipe = this.recipes.find(r => (r.id || r.title_with_emoji) === recipeId);
        if (!recipe) {
            console.error('Recipe not found:', recipeId);
            return;
        }

        const modalHtml = this.createRecipeModal(recipe);
        
        // Remove existing modal
        const existingModal = document.getElementById('recipe-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = document.getElementById('recipe-modal');
        modal.style.display = 'flex';
        
        // Setup modal close listeners
        this.setupModalListeners();
    }

    createRecipeModal(recipe) {
        const ingredientsHtml = recipe.ingredients.map(ingredient => 
            `<li class="ingredient-item">${ingredient}</li>`
        ).join('');

        const instructionsHtml = recipe.instructions.map((instruction, index) => 
            `<li class="instruction-step">
                <span class="step-number">${index + 1}</span>
                <span class="step-text">${instruction}</span>
            </li>`
        ).join('');

        const yieldTimeHtml = this.formatYieldAndTime(recipe.yield_and_time);

        return `
            <div id="recipe-modal" class="recipe-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">${recipe.title_with_emoji}</h2>
                        <button class="modal-close" onclick="chefRichApp.closeModal()">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="recipe-tags">
                            ${recipe.tags.map(tag => `<span class="recipe-tag">#${tag}</span>`).join('')}
                        </div>

                        <div class="recipe-description">
                            <p><strong>Description:</strong> ${recipe.description}</p>
                        </div>

                        <div class="recipe-yield-time-full">
                            ${yieldTimeHtml}
                        </div>

                        <div class="recipe-sections">
                            <div class="ingredients-section">
                                <h3>🥗 Ingredients</h3>
                                <ul class="ingredients-list">${ingredientsHtml}</ul>
                            </div>

                            <div class="instructions-section">
                                <h3>👩‍🍳 Instructions</h3>
                                <ol class="instructions-list">${instructionsHtml}</ol>
                            </div>

                            ${recipe.chefrich_notes ? `
                                <div class="chefrich-notes-section">
                                    <h3>✨ ChefRich Notes</h3>
                                    <div class="chefrich-notes">${recipe.chefrich_notes}</div>
                                </div>
                            ` : ''}

                            ${recipe.suggested_pairings ? `
                                <div class="pairings-section">
                                    <h3>🍽️ Suggested Pairings</h3>
                                    <div class="suggested-pairings">${Array.isArray(recipe.suggested_pairings) ? recipe.suggested_pairings.join(', ') : recipe.suggested_pairings}</div>
                                </div>
                            ` : ''}

                            ${recipe.nutritional_highlights ? `
                                <div class="nutrition-section">
                                    <h3>💚 Nutritional Highlights</h3>
                                    <div class="nutritional-highlights">${recipe.nutritional_highlights}</div>
                                </div>
                            ` : ''}

                            ${recipe.food_as_medicine ? `
                                <div class="medicine-section">
                                    <h3>🌿 Food as Medicine</h3>
                                    <div class="food-as-medicine">${recipe.food_as_medicine}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupModalListeners() {
        const modal = document.getElementById('recipe-modal');
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('recipe-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    }

    showError(message) {
        const container = document.getElementById('recipes-container') || 
                         document.querySelector('.recipes-grid') ||
                         document.querySelector('.recipe-container');
        
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-btn">Try Again</button>
                </div>
            `;
        }
    }
}

// Initialize the app when DOM is loaded
let chefRichApp;

document.addEventListener('DOMContentLoaded', () => {
    chefRichApp = new ChefRichApp();
});

// Also try to initialize if document is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chefRichApp = new ChefRichApp();
    });
} else {
    chefRichApp = new ChefRichApp();
}
