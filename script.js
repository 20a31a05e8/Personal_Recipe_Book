document.addEventListener('DOMContentLoaded', function () {
    const recipeList = document.getElementById('recipe-list');
    const categorySelect = document.getElementById('category-select');
    const addRecipeButton = document.getElementById('add-recipe');
    const recipeModal = document.getElementById('recipe-modal');
    const closeButton = document.querySelector('.close');
    const saveRecipeButton = document.getElementById('save-recipe');
    const deleteRecipeButton = document.getElementById('delete-recipe');
    const recipeNameInput = document.getElementById('recipe-name');
    const recipeIngredientsInput = document.getElementById('recipe-ingredients');
    const recipeCategorySelect = document.getElementById('recipe-category');
    const searchInput = document.getElementById('search');

    // Sample data for demonstration
    let myRecipes = [
        { name: 'Pancakes', ingredients: 'Flour, eggs, milk', category: 'Breakfast' },
        { name: 'Spaghetti Carbonara', ingredients: 'Pasta, eggs, bacon, cheese', category: 'Dinner' },
        { name: 'Chocolate Chip Cookies', ingredients: 'Flour, sugar, chocolate chips', category: 'Dessert' },
        { name: 'Greek Salad', ingredients: 'Cucumber, tomato, feta cheese', category: 'Lunch' },
    ];

    // Show the recipe modal
    addRecipeButton.addEventListener('click', function () {
        clearRecipeModal();
        recipeModal.style.display = 'block';
    });

    // Close the recipe modal
    closeButton.addEventListener('click', function () {
        clearRecipeModal();
        recipeModal.style.display = 'none';
    });

    // Save a new recipe or update an existing one
    saveRecipeButton.addEventListener('click', function () {
        const recipeName = recipeNameInput.value;
        const recipeIngredients = recipeIngredientsInput.value;
        const recipeCategory = recipeCategorySelect.value;

        if (recipeName && recipeIngredients && recipeCategory) {
            const recipe = { name: recipeName, ingredients: recipeIngredients, category: recipeCategory };
            if (selectedRecipeIndex === -1) {
                myRecipes.push(recipe);
            } else {
                myRecipes[selectedRecipeIndex] = recipe;
            }
            clearRecipeModal();
            updateRecipeList();
            recipeModal.style.display = 'none';
        } else {
            alert('Please enter a name, ingredients, and category for the recipe.');
        }
    });

    // Delete a recipe
    deleteRecipeButton.addEventListener('click', function () {
        if (selectedRecipeIndex !== -1) {
            myRecipes.splice(selectedRecipeIndex, 1);
            clearRecipeModal();
            updateRecipeList();
            recipeModal.style.display = 'none';
        }
    });

    // Clear the recipe modal inputs and buttons
    function clearRecipeModal() {
        recipeNameInput.value = '';
        recipeIngredientsInput.value = '';
        recipeCategorySelect.value = 'Breakfast';
        deleteRecipeButton.style.display = 'none';
    }

    // Edit a recipe
    let selectedRecipeIndex = -1;
    function editRecipe(index) {
        selectedRecipeIndex = index;
        const selectedRecipe = myRecipes[index];
        recipeNameInput.value = selectedRecipe.name;
        recipeIngredientsInput.value = selectedRecipe.ingredients;
        recipeCategorySelect.value = selectedRecipe.category;
        deleteRecipeButton.style.display = 'block';
    }

    // Add a new recipe to the list
    function addRecipeToList(recipe, index) {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe';
        recipeItem.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>Ingredients: ${recipe.ingredients}</p>
            <p>Category: ${recipe.category}</p>
            <button class="edit" data-index="${index}">Edit</button>
            <button class="delete" data-index="${index}">Delete</button>
        `;
        recipeList.appendChild(recipeItem);

        // Handle edit button click
        const editButton = recipeItem.querySelector('.edit');
        editButton.addEventListener('click', function () {
            editRecipe(index);
            recipeModal.style.display = 'block';
        });

        // Handle delete button click
        const deleteButton = recipeItem.querySelector('.delete');
        deleteButton.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this recipe?')) {
                myRecipes.splice(index, 1);
                updateRecipeList();
            }
        });
    }

    // Function to update the recipe list
    function updateRecipeList(recipes) {
        recipeList.innerHTML = '';
        const filteredRecipes = recipes || myRecipes;
        filteredRecipes.forEach((recipe, index) => {
            addRecipeToList(recipe, index);
        });
    }

    // Event listener for category select
    categorySelect.addEventListener('change', function () {
        const selectedCategory = categorySelect.value;
        const filteredRecipes = selectedCategory === 'All' ? myRecipes : myRecipes.filter(recipe => recipe.category === selectedCategory);
        updateRecipeList(filteredRecipes);
    });

    // Event listener for search input
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredRecipes = myRecipes.filter(recipe => recipe.name.toLowerCase().includes(searchTerm));
        updateRecipeList(filteredRecipes);
    });

    // Initial display of recipes
    updateRecipeList();
});