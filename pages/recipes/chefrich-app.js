// Simple ChefRich Recipe Display
class SimpleRecipeDisplay {
    constructor() {
        this.recipes = [];
        this.loadRecipes();
    }

    async loadRecipes() {
        try {
            console.log('Loading recipes...');
            const response = await fetch('../../recipes.json');
            const data = await response.json();
            this.recipes = data.recipes || [];
            console.log(`Loaded ${this.recipes.length} recipes`);
            this.displayRecipes();
            this.setupSearch();
        } catch (error) {
            console.error('Error loading recipes:', error);
            document.body.innerHTML = '<h2>Error loading recipes. Please check console.</h2>';
        }
    }

    displayRecipes(recipesToShow = this.recipes) {
        const container = document.getElementById('recipes-container') || document.body;
        
        if (recipesToShow.length === 0) {
            container.innerHTML = '<h2>No recipes found</h2>';
            return;
        }

        const recipesHTML = recipesToShow.map(recipe => `
            <div class="recipe-card" style="
                border: 2px solid #ddd; 
                margin: 15px; 
                padding: 20px; 
                border-radius: 10px; 
                max-width: 400px; 
                display: inline-block; 
                vertical-align: top;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                cursor: pointer;
                transition: transform 0.2s;
            " onclick="this.style.transform = this.style.transform ? '' : 'scale(1.02)'">
                <h3 style="color: #2c5f2d; margin-top: 0;">${recipe.title_with_emoji || recipe.name}</h3>
                
                <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px;">
                    <strong>📖 ${recipe.description}</strong>
                </div>
                
                ${recipe.yield_and_time ? `
                    <div style="background: #e8f5e8; padding: 8px; margin: 8px 0; border-radius: 5px; font-size: 14px;">
                        🍽️ ${recipe.yield_and_time.yield} | ⏱️ ${recipe.yield_and_time.prep_time} | 🔥 ${recipe.yield_and_time.cook_time}
                    </div>
                ` : ''}
                
                <div style="margin: 10px 0;">
                    <strong>🥗 Ingredients:</strong>
                    <div style="max-height: 100px; overflow-y: auto; background: #f9f9f9; padding: 8px; border-radius: 4px; font-size: 13px;">
                        ${recipe.ingredients ? recipe.ingredients.slice(0, 5).map(ing => `• ${ing}`).join('<br>') : ''}
                        ${recipe.ingredients && recipe.ingredients.length > 5 ? '<br><em>...and more</em>' : ''}
                    </div>
                </div>
                
                ${recipe.chefrich_notes ? `
                    <div style="background: #fff3cd; padding: 8px; margin: 8px 0; border-radius: 5px; font-size: 13px;">
                        <strong>✨ ChefRich Notes:</strong> ${recipe.chefrich_notes}
                    </div>
                ` : ''}
                
                <button onclick="event.stopPropagation(); this.parentElement.querySelector('.full-recipe').style.display = this.parentElement.querySelector('.full-recipe').style.display === 'block' ? 'none' : 'block';" 
                        style="background: #2c5f2d; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                    View Full Recipe
                </button>
                
                <div class="full-recipe" style="display: none; margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                    <h4>👩‍🍳 Instructions:</h4>
                    <ol style="font-size: 14px;">
                        ${recipe.instructions ? recipe.instructions.map(inst => `<li style="margin: 5px 0;">${inst}</li>`).join('') : ''}
                    </ol>
                    
                    ${recipe.food_as_medicine ? `
                        <div style="background: #d4edda; padding: 10px; margin: 10px 0; border-radius: 5px;">
                            <strong>🌿 Food as Medicine:</strong> ${recipe.food_as_medicine}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div style="text-align: center; margin: 20px;">
                <h1>🍽️ ChefRich Recipes</h1>
                <input type="text" id="search-box" placeholder="🔍 Search recipes..." 
                       style="padding: 10px; font-size: 16px; width: 300px; border: 2px solid #ddd; border-radius: 25px; margin: 10px;">
                <div style="margin: 10px; font-size: 14px; color: #666;">
                    Showing ${recipesToShow.length} of ${this.recipes.length} recipes
                </div>
            </div>
            <div style="text-align: center; max-width: 1200px; margin: 0 auto;">
                ${recipesHTML}
            </div>
        `;
    }

    setupSearch() {
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = this.recipes.filter(recipe => 
                    (recipe.title_with_emoji || recipe.name || '').toLowerCase().includes(query) ||
                    (recipe.description || '').toLowerCase().includes(query) ||
                    (recipe.ingredients || []).some(ing => ing.toLowerCase().includes(query))
                );
                this.displayRecipes(filtered);
                this.setupSearch(); // Re-setup search after re-render
            });
        }
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    new SimpleRecipeDisplay();
});

if (document.readyState !== 'loading') {
    new SimpleRecipeDisplay();
}
