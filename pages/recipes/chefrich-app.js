Copyclass ChefRichApp {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.init();
    }

    async init() {
        try {
            await this.loadRecipes();
            this.displayRecipes();
        } catch (error) {
            console.error('Error loading recipes:', error);
            this.showError('Failed to load recipes. Please try again.');
        }
    }

    async loadRecipes() {
        try {
            const response = await fetch('../../recipes.json');
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

    displayRecipes() {
        const container = document.getElementById('recipes-container') || 
                         document.querySelector('.recipes-grid') ||
                         document.querySelector('.recipe-container') ||
                         document.body;
        
        if (!container) {
            console.error('Recipe container not found');
            return;
        }

        if (this.filteredRecipes.length === 0) {
            container.innerHTML = '<div>No recipes found.</div>';
            return;
        }

        const recipesHtml = this.filteredRecipes.map(recipe => {
            const tags = recipe.tags ? recipe.tags.map(tag => `<span class="tag">#${tag}</span>`).join('') : '';
            
            return `
                <div class="recipe-card" style="border: 1px solid #ddd; margin: 20px; padding: 20px; border-radius: 8px;">
                    <h2>${recipe.title_with_emoji || recipe.name}</h2>
                    <div class="tags" style="margin: 10px 0;">${tags}</div>
                    <p><strong>Description:</strong> ${recipe.description}</p>
                    
                    ${recipe.yield_and_time ? `
                        <div class="yield-time" style="background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px;">
                            <strong>🍽️ ${recipe.yield_and_time.yield || ''}</strong><br>
                            ⏱️ Prep: ${recipe.yield_and_time.prep_time || ''} | 
                            🔥 Cook: ${recipe.yield_and_time.cook_time || ''} | 
                            ⏰ Total: ${recipe.yield_and_time.total_time || ''}
                        </div>
                    ` : ''}
                    
                    <div class="ingredients" style="margin: 15px 0;">
                        <h3>🥗 Ingredients:</h3>
                        <ul>${recipe.ingredients ? recipe.ingredients.map(ing => `<li>${ing}</li>`).join('') : ''}</ul>
                    </div>
                    
                    <div class="instructions" style="margin: 15px 0;">
                        <h3>👩‍🍳 Instructions:</h3>
                        <ol>${recipe.instructions ? recipe.instructions.map(inst => `<li>${inst}</li>`).join('') : ''}</ol>
                    </div>
                    
                    ${recipe.chefrich_notes ? `
                        <div class="chef-notes" style="background: #e8f5e8; padding: 10px; margin: 10px 0; border-radius: 4px;">
                            <h3>✨ ChefRich Notes:</h3>
                            <p>${recipe.chefrich_notes}</p>
                        </div>
                    ` : ''}
                    
                    ${recipe.nutritional_highlights ? `
                        <div class="nutrition" style="background: #f0f8ff; padding: 10px; margin: 10px 0; border-radius: 4px;">
                            <h3>💚 Nutritional Highlights:</h3>
                            <p>${recipe.nutritional_highlights}</p>
                        </div>
                    ` : ''}
                    
                    ${recipe.food_as_medicine ? `
                        <div class="medicine" style="background: #fff5ee; padding: 10px; margin: 10px 0; border-radius: 4px;">
                            <h3>🌿 Food as Medicine:</h3>
                            <p>${recipe.food_as_medicine}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = recipesHtml;
    }

    showError(message) {
        const container = document.body;
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Oops! Something went wrong</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

// Initialize the app
let chefRichApp;

document.addEventListener('DOMContentLoaded', () => {
    chefRichApp = new ChefRichApp();
});

if (document.readyState !== 'loading') {
    chefRichApp = new ChefRichApp();
}
