// ChefRich Recipe Application
class ChefRichApp {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.loadRecipes();
    }

    async loadRecipes() {
        try {
            // Load recipes from recipes.json file
            const response = await fetch('/ChefRich-website/recipes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.recipes = data.recipes;
            this.filteredRecipes = [...this.recipes];
            
            // Initialize the app after recipes are loaded
            this.init();
        } catch (error) {
            console.error('Error loading recipes:', error);
            document.getElementById('recipeGrid').innerHTML = 
                '<div class="error">Unable to load recipes. Please check your connection and try refreshing the page.</div>';
        }
    }

    init() {
        this.setupEventListeners();
        this.displayRecipes(this.recipes);
        this.updateFilters();
    }

    setupEventListeners() {
        // Filter event listeners
        const healthFilter = document.getElementById('healthFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        
        if (healthFilter) {
            healthFilter.addEventListener('change', () => this.filterRecipes());
        }
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', () => this.filterRecipes());
        }

        // Modal event listeners
        const modal = document.getElementById('recipeModal');
        const closeBtn = document.querySelector('.close');

        if (closeBtn) {
            closeBtn.onclick = () => this.closeModal();
        }
        
        window.onclick = (event) => {
            if (event.target === modal) {
                this.closeModal();
            }
        };

        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    updateFilters() {
        const healthConditions = [...new Set(this.recipes.map(recipe => recipe.healthCondition))];
        const difficulties = [...new Set(this.recipes.map(recipe => recipe.difficulty))];

        // Update health filter options
        const healthFilter = document.getElementById('healthFilter');
        if (healthFilter) {
            // Clear existing options except "All"
            const allOption = healthFilter.querySelector('option[value="all"]');
            healthFilter.innerHTML = '';
            if (allOption) {
                healthFilter.appendChild(allOption);
            } else {
                const newAllOption = document.createElement('option');
                newAllOption.value = 'all';
                newAllOption.textContent = 'All Health Conditions';
                healthFilter.appendChild(newAllOption);
            }

            // Add new health condition options
            healthConditions.forEach(condition => {
                const option = document.createElement('option');
                option.value = condition;
                option.textContent = condition;
                healthFilter.appendChild(option);
            });
        }

        // Update difficulty filter if it exists
        const difficultyFilter = document.getElementById('difficultyFilter');
        if (difficultyFilter) {
            const allDifficultyOption = difficultyFilter.querySelector('option[value="all"]');
            if (!allDifficultyOption) {
                difficulties.forEach(difficulty => {
                    if (!Array.from(difficultyFilter.options).some(option => option.value === difficulty)) {
                        const option = document.createElement('option');
                        option.value = difficulty;
                        option.textContent = difficulty;
                        difficultyFilter.appendChild(option);
                    }
                });
            }
        }
    }

    filterRecipes() {
        const healthFilter = document.getElementById('healthFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        
        const selectedHealth = healthFilter ? healthFilter.value : 'all';
        const selectedDifficulty = difficultyFilter ? difficultyFilter.value : 'all';

        this.filteredRecipes = this.recipes.filter(recipe => {
            const healthMatch = selectedHealth === 'all' || recipe.healthCondition === selectedHealth;
            const difficultyMatch = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
            return healthMatch && difficultyMatch;
        });

        this.displayRecipes(this.filteredRecipes);
    }

    displayRecipes(recipesToShow) {
        const grid = document.getElementById('recipeGrid');
        
        if (!grid) {
            console.error('Recipe grid element not found');
            return;
        }
        
        if (recipesToShow.length === 0) {
            grid.innerHTML = '<div class="loading">No recipes found matching your criteria.</div>';
            return;
        }

        grid.innerHTML = recipesToShow.map(recipe => this.createRecipeCard(recipe)).join('');

        // Add click event listeners to recipe cards
        recipesToShow.forEach(recipe => {
            const card = document.getElementById(`recipe-${recipe.id}`);
            if (card) {
                card.addEventListener('click', () => this.openModal(recipe));
            }
        });
    }

    createRecipeCard(recipe) {
        return `
            <div id="recipe-${recipe.id}" class="recipe-card ${recipe.featured ? 'featured' : ''}" data-health="${recipe.healthCondition}">
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" loading="lazy">
                <div class="recipe-content">
                    <div class="health-condition">${recipe.healthCondition}</div>
                    <h2 class="recipe-title">${recipe.name}</h2>
                    <p class="recipe-description">${recipe.description}</p>
                    
                    <div class="recipe-meta">
                        <span>🍽️ Serves: ${recipe.servings}</span>
                        <span>⏱️ Prep: ${recipe.prepTime}</span>
                        ${recipe.cookTime ? `<span>🔥 Cook: ${recipe.cookTime}</span>` : ''}
                        <span>📊 ${recipe.difficulty}</span>
                    </div>

                    <div class="tags">
                        ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>

                    <div class="calories">${recipe.calories} calories per serving</div>
                    
                    <button class="view-recipe-btn">View Full Recipe</button>
                </div>
            </div>
        `;
    }

    openModal(recipe) {
        const modal = document.getElementById('recipeModal');
        
        if (!modal) return;

        // Populate modal with recipe data
        const modalImage = document.getElementById('modalRecipeImage');
        const modalHealthCondition = document.getElementById('modalHealthCondition');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');

        if (modalImage) {
            modalImage.src = recipe.image;
            modalImage.alt = recipe.name;
        }
        if (modalHealthCondition) modalHealthCondition.textContent = recipe.healthCondition;
        if (modalTitle) modalTitle.textContent = recipe.name;
        if (modalDescription) modalDescription.textContent = recipe.description;

        // Nutrition information
        if (recipe.nutrition) {
            const caloriesEl = document.getElementById('modalCalories');
            const proteinEl = document.getElementById('modalProtein');
            const carbsEl = document.getElementById('modalCarbs');
            const fatEl = document.getElementById('modalFat');
            const fiberEl = document.getElementById('modalFiber');

            if (caloriesEl) caloriesEl.textContent = recipe.calories;
            if (proteinEl) proteinEl.textContent = recipe.nutrition.protein || '0g';
            if (carbsEl) carbsEl.textContent = recipe.nutrition.carbs || '0g';
            if (fatEl) fatEl.textContent = recipe.nutrition.fat || '0g';
            if (fiberEl) fiberEl.textContent = recipe.nutrition.fiber || '0g';
        }

        // Ingredients
        const ingredientsList = document.getElementById('modalIngredients');
        if (ingredientsList && recipe.ingredients) {
            ingredientsList.innerHTML = recipe.ingredients.map(ingredient => 
                `<li>${ingredient}</li>`
            ).join('');
        }

        // Instructions
        const instructionsList = document.getElementById('modalInstructions');
        if (instructionsList && recipe.instructions) {
            instructionsList.innerHTML = recipe.instructions.map(instruction => 
                `<li>${instruction}</li>`
            ).join('');
        }

        // Chef Tips
        const chefTipsList = document.getElementById('modalChefTips');
        if (chefTipsList && recipe.chefTips) {
            chefTipsList.innerHTML = recipe.chefTips.map(tip => 
                `<li>${tip}</li>`
            ).join('');
        }

        // Health Benefits
        const healthBenefitsList = document.getElementById('modalHealthBenefits');
        if (healthBenefitsList && recipe.healthBenefits) {
            healthBenefitsList.innerHTML = recipe.healthBenefits.map(benefit => 
                `<li>${benefit}</li>`
            ).join('');
        }

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        const modal = document.getElementById('recipeModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChefRichApp();
});

