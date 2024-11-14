async function displayRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");
    console.log("Recipe ID from URL:", recipeId); 

    if (!recipeId) {
        console.error("No recipe ID found in URL");
        return;
    }

    const recipeDetails = await getRecipeDetails(recipeId);
    
    if (recipeDetails) {
        console.log("Recipe Details to Display:", recipeDetails);  
        
        const bigPurElement = document.getElementById("bigpur");

        if (recipeDetails.title && recipeDetails.image && recipeDetails.extendedIngredients) {
            bigPurElement.innerHTML = `
                <div>
                    <h2>${recipeDetails.title}</h2>
                    <img src="${recipeDetails.image}" alt="${recipeDetails.title}" width="100%" style="border-radius: 8px;">
                    <p><strong>Preparation Time:</strong> ${recipeDetails.readyInMinutes || 'N/A'} minutes</p>
                    <p><strong>Servings:</strong> ${recipeDetails.servings || 'N/A'}</p>
            
                    <h3>Ingredients</h3>
                    <ul>
                        ${recipeDetails.extendedIngredients ? recipeDetails.extendedIngredients.map(ingredient => `
                            <li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>
                        `).join('') : '<li>No ingredients available</li>'}
                    </ul>
            
                    <h3>Cooking Instructions</h3>
                    <ol>
                        ${recipeDetails.instructions ? recipeDetails.instructions.split('. ').map(step => `
                            <li>${step}</li>
                        `).join('') : '<li>No instructions available</li>'}
                    </ol>
            
                    <h3>Nutritional Information</h3>
                    <ul>
                        <li><strong>Calories:</strong> ${recipeDetails.nutrition ? recipeDetails.nutrition.nutrients.find(nutrient => nutrient.title === "Calories")?.amount : 'N/A'} kcal</li>
                        <li><strong>Protein:</strong> ${recipeDetails.nutrition ? recipeDetails.nutrition.nutrients.find(nutrient => nutrient.title === "Protein")?.amount : 'N/A'} g</li>
                        <li><strong>Fat:</strong> ${recipeDetails.nutrition ? recipeDetails.nutrition.nutrients.find(nutrient => nutrient.title === "Fat")?.amount : 'N/A'} g</li>
                        <li><strong>Carbohydrates:</strong> ${recipeDetails.nutrition ? recipeDetails.nutrition.nutrients.find(nutrient => nutrient.title === "Carbohydrates")?.amount : 'N/A'} g</li>
                    </ul>
            
                    <h3>User Ratings</h3>
                    <p><strong>Rating:</strong> ${recipeDetails.spoonacularScore || 'N/A'} / 100</p>
                    <p><strong>Number of Reviews:</strong> ${recipeDetails.aggregateLikes || 'N/A'}</p>
                </div>
            `;
        } else {
            bigPurElement.innerHTML = "<p>Recipe details are incomplete or unavailable.</p>";
        }
    } else {
        console.error("No recipe details found.");
    }
}
