import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyCustomWidget() {
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMeal, setNewMeal] = useState({
    title: "",
    time: "",
    targetCalories: "",
  });
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    setShowSuggestions(true);
    e.preventDefault();
    const fetchMealPlan = async () => {
          try {
            setLoading(true);
            const timeFrame = convertTimeToTimeFrame(newMeal.time);
            const response = await axios.get(
              'https://api.spoonacular.com/mealplanner/generate',
              {
                params: {
                  apiKey: process.env.REACT_APP_SPOONACULAR_API,
                  timeFrame: timeFrame,
                  targetCalories: newMeal.targetCalories,
                },
              }
            );
            setMealPlan(response.data.meals);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
    
        if (showSuggestions && newMeal.time && newMeal.targetCalories) {
          fetchMealPlan();
        }
  };

  const handleClearSuggestions = () => {
    setMealPlan([]);
    setShowSuggestions(false);
    setNewMeal({
      title: '',
      time: '',
      targetCalories: '',
    });
  };

  const handleMealSelect = async (meal) => { 
    try {
      const response = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        {
          params: {
            apiKey: process.env.REACT_APP_RECIPE_API,
            query: meal.title,
            number: 1,
          },
        }
      );
  
      const recipe = response.data.results[0];
  
      const updatedMeal = {
        ...meal,
        image: recipe.image,
        time: newMeal.time
      };
  
      const timeDiff = getTimeDiff(updatedMeal);
      
      if (timeDiff > 0) {
        setSelectedMeals((prevSelectedMeals) => [
          ...prevSelectedMeals,
          updatedMeal,
        ]);
      } else {
        alert(`Oops! It's too late to select this meal. It takes ${meal.readyInMinutes} minutes to be ready, and you don't have enough time.`);
      }
    } catch (error) {
      console.log(error);
    } 
  };
    

  const handleMealRemove = (meal) => {
    setSelectedMeals(
      selectedMeals.filter((selectedMeal) => selectedMeal !== meal)
    );
  };

  const handleAlert = (meal) => {
    alert(`It's time to start preparing or place an order for your meal! '${meal.title}' takes ${meal.readyInMinutes} minutes to be ready.`);
  };

  const convertTimeToTimeFrame = (time) => {
    const hour = parseInt(time.split(":")[0]);
    let timeFrame = "";

    if (hour >= 6 && hour < 18) {
      timeFrame = 'day';
    } else if (time === '') {
      timeFrame = '...';
    } else {
      timeFrame = 'night';
    }

    return timeFrame;
  };

  const getTimeDiff = (meal) => {
    const currentTime = new Date();
    const targetTime = new Date();
    targetTime.setHours(meal.time.split(":")[0]); // Set the specific hour
    targetTime.setMinutes(meal.time.split(":")[1]); // Set the specific minute
    targetTime.setMinutes(targetTime.getMinutes() - meal.readyInMinutes); // Subtract 40 minutes from the target time
    targetTime.setSeconds(0);
    targetTime.setMilliseconds(0);
    const timeDiff = targetTime - currentTime;

    return timeDiff;
  };

  useEffect(() => {
    selectedMeals.forEach((meal) => {
      if (meal.time) {
        const timeDiff = getTimeDiff(meal);

        if (timeDiff !== 0) {
          const timer = setTimeout(() => {
            handleAlert(meal);
          }, timeDiff);
  
          return () => {
            clearTimeout(timer);
          };
        } 
      }
    });
  });
  
  
    

  return (
    <div className="widget meal-planner-widget">
      <h2 className="widget-title">Meal Planner</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="target-calories">Target Calories:</label>
          <input
            type="number"
            id="target-calories"
            name="targetCalories"
            value={newMeal.targetCalories}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="meal-time">Meal Time:</label>
          <input
            type="time"
            id="meal-time"
            name="time"
            value={newMeal.time}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">See Suggestions for {convertTimeToTimeFrame(newMeal.time)}</button>
        <button type="clear" onClick={handleClearSuggestions}>
            Clear Suggestions
          </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='meal-container'>
          <ul className="meal-suggestions">
            <h3>Suggested Meals</h3>
            {mealPlan.map((meal) => (
              <li key={meal.id}>
                <div className="meal-details">
                  <h3>{meal.title}</h3>
                </div>
                <div className="meal-summary">
                  <p>Ready In: {meal.readyInMinutes} minutes</p>
                  <p>Servings: {meal.servings}</p>
                  <p>
                    More information at:{" "}
                    <a
                      href={meal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {meal.sourceUrl}
                    </a>
                  </p>
                </div>
                <button type="select" onClick={() => handleMealSelect(meal)}>Select</button>
              </li>
            ))}
          </ul>
          <div className="selected-meals">
            <h3>Selected Meals</h3>
            {selectedMeals.map((meal) => (
              <div key={meal.id} className="selected-meal">
                  <div className="meal-details">
                    <img src={meal.image} alt="Meal" />
                    <h3>{meal.title}</h3>
                  </div>
                <div className="meal-summary">
                  <p>Ready In: {meal.readyInMinutes} minutes</p>
                  <p>Servings: {meal.servings}</p>
                  <p>Time: {meal.time}</p>
                  <p>
                    More information at:{" "}
                    <a
                      href={meal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {meal.sourceUrl}
                    </a>
                  </p>
                </div>
                <button type="remove" onClick={() => handleMealRemove(meal)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};