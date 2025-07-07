class ChefRichApp {
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
            this.showError('Failed to load recipes.');
        }
    }

    async loadRecipes() {
        try {
            const response = await fetch('../../recipes.json');
            if (!response.ok) {
                throw new Error('Failed to load recipes');
            }
            const data = await response.json();
            this.recipes = data.recipes || data;
            this.filteredRecipes = [...this.recipes];
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    displayRecipes() {
        const container = document.body;
        
        if (this.filteredRecipes.length === 0) {
            container.innerHTML = '<div>No recipes found.</div>';
            return;
        }

        const recipesHtml = this.filteredRecipes.map(recipe => {
            return `
                <div style="border: 1px solid #ddd; margin: 20px; padding: 20px; border-radius: 8px; max-width: 800px;">
                    <h2>${recipe.title_with_emoji || recipe.name}</h2>
                    <p><strong>Description:</strong> ${recipe.description}</p>
                    
                    <div style="background: #f5f5f5; padding: 10px; margin: 10px 0;">
                        <strong>🍽️ Yield:</strong> ${recipe.yield_and_time?.yield || ''}<br>
                        <strong>⏱️ Prep:</strong> ${recipe.yield_and_time?.prep_time || ''} | 
                        <strong>🔥 Cook:</strong> ${recipe.yield_and_time?.cook_time || ''} | 
                        <strong>⏰ Total:</strong> ${recipe.yield_and_time?.total_time || ''}
                    </div>
                    
                    <h3>🥗 Ingredients:</h3>
                    <ul>${recipe.ingredients?.map(ing => `<li>${ing}</li>`).join('') || ''}</ul>
                    
                    <h3>👩‍🍳 Instructions:</h3>
                    <ol>${recipe.instructions?.map(inst => `<li>${inst}</li>`).join('') || ''}</ol>
                    
                    ${recipe.chefrich_notes ? `
                        <div style="background: #e8f5e8; padding: 10px; margin: 10px 0;">
                            <h3>✨ ChefRich Notes:</h3>
                            <p>${recipe.chefrich_notes}</p>
                        </div>
                    ` : ''}
                    
                    ${recipe.food_as_medicine ? `
                        <div style="background: #fff5ee; padding: 10px; margin: 10px 0;">
                            <h3>🌿 Food as Medicine:</h3>
                            <p>${recipe.food_as_medicine}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = `<div style="max-width: 900px; margin: 0 auto; padding: 20px;">${recipesHtml}</div>`;
    }

    showError(message) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Error Loading Recipes</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChefRichApp();
});
