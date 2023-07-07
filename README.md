# MyCustomWidget - Meal Planner Widget


## **Introduction**
The bounty required me to build a custom widget of my choice and add to the planner-app. I chose to design a meal planner widget that helps users plan their meals based on their target calorie count and meal time. This widget integrates with the Spoonacular API to generate suggested meals and allows users to select and track their chosen meals.

## **Reasons for choosing the Widget**
The meal planner widget is an ideal addition to a planner app for several reasons;

- Health-conscious planning: With the increasing focus on healthy eating and balanced diets, having a meal planner helps users make informed decisions about their daily meals and achieve their health goals.

- Time management: Planning meals in advance allows users to save time by organizing grocery shopping and meal preparation efficiently. It promotes better time management within their daily routine.

- Personalized suggestions: The widget generates personalized meal suggestions based on the user's target calorie count and meal time. This feature provides tailored recommendations and enhances the user experience.

- Tracking and organization: The widget enables users to select and track their chosen meals, creating a sense of organization and allowing for easy reference of planned meals.

## **How It Works**

The MyCustomWidget is built using React, a popular JavaScript library for building user interfaces. It utilizes state management with the useState hook to handle user inputs and track the generated meal plan.

- **State Hooks**
    - `mealPlan:` Stores an array of suggested meals retrieved from the Spoonacular API.
    - `loading:` Tracks the loading state when making API calls.
    - `newMeal:` Holds an object that represents the user's inputs for target calories, meal time, and title.
    - `selectedMeals:` Stores an array of meals selected by the user.
    - `showSuggestions:` Controls whether to show the suggested meals section.

Here's an overview of how the widget works:

- **User Input:** 
    - The component renders a form with inputs for target calories and meal time. 
    - Users can enter their desired target calorie count and meal time using the input fields, `newMeal.targetCalories` and `newMeal.time` provided in the widget.
    - The `handleInputChange` function updates the newMeal state object with the latest values as the user inputs data into the target calories and meal time fields

- **Meal Suggestion:** 
    - Upon clicking the "See Suggestions" button, the widget fetches meal suggestions from the Spoonacular API based on the user's inputs. It sends an HTTP request with the target calorie count, timeframe gotten from the inputted meal time, and API key to retrieve relevant meal suggestions.
    - The `handleFormSubmit` handles the form submission event when the user clicks the "See Suggestions" button. It sets the `showSuggestions` state to true to display the suggested meals section and triggers an asynchronous function to fetch the meal plan based on the user's inputs. 
    - The `convertTimeToTimeFrame` converts the user's inputted time to a time frame (either "day" or "night") based on the hour of the time, as this timeframe is what the spoonacular API accepts. From 6am to 6pm is day, while 6pm to 6am is night.
    - If the inputs are valid, an API call is made to retrieve the meal plan from the Spoonacular API. The response data is then stored in the `mealPlan` state, which triggers a re-render of the component.

- **Suggested Meals:** 
    - The API response is displayed in the widget, showing a list of suggested meals with details such as title, ready time, servings, and a link for more information. Users can select individual meals by clicking the "Select" button.
    - The `See Suggestions` button triggers the `handleFormSubmit` function. The suggested meals section is displayed conditionally based on the `loading` state. If the `loading` state is true, a "Loading..." message is displayed. Otherwise, the suggested meals are shown as a list, and each meal includes its title, ready-in time, servings, and a link for more information. The user can select a meal by clicking the "Select" button, which triggers the `handleMealSelect` function
    - In front of the `See Suggestions` button is a `clear suggestions` button that triggers the `handleClearSuggestions` function. This function clears the mealPlan state by setting it to an empty array, resets the showSuggestions state to false to hide the suggested meals section, and resets the newMeal state object by setting it to its initial values, effectively clearing the input fields.

- **Selected Meals:** 
    - The widget keeps track of the selected meals in a separate section. It displays the chosen meals along with their details, including an image, ready time, servings, and a link for more information. Users can remove selected meals by clicking the "Remove" button.
    - When the `select` button is clicked for a suggested meal, this triggers the `handleMealSelect` function which handles the selection of a suggested meal. It triggers an asynchronous function that makes an API call to retrieve additional details about the selected meal, such as an image. The response data is used to update the selected meal object with the image URL and the meal time from the user's inputs. If the selected meal's ready-in time allows enough time for preparation, it is added to the selectedMeals state. Otherwise, an alert is shown indicating that it's too late to select the meal.
    -  The user can remove a selected meal by clicking the "Remove" button, which triggers the `handleMealRemove` function. This function removes a selected meal from the `selectedMeals` state array based on the meal object passed as an argument.

`NOTE:` Two different api keys are used to maximize the number of calls that can be made per day, as there is a limited number of calls that can be made with each key. One key generates the meal suggestion list in the `handleFormSubmit` function, while the other is used in the `handleMealSelect` to retrieve additional details about the selected meal.

- **Meal Time Notifications:** 
    - The widget also provides meal time notifications. It sets up timers based on the selected meal's time and readyInMinutes value. When the meal time approaches, an alert is displayed to remind the user to prepare the meal or place an order.
    - A use effect is used to achieve this, this effect runs whenever `selectedMeals` changes. It iterates over the selected meals and sets up timers to trigger alerts based on the time remaining until the meal's ready-in time. There is a `getTimeDiff` function that calculates the time difference in milliseconds between the current time and the target time for a selected meal, taking into account the meal's ready-in time, and a `handleAlert` function that displays an alert to the user indicating the time remaining until the selected meal should be prepared. It takes the meal's ready-in time as an argument. If the time difference is not zero (i.e., the meal is not ready to be prepared yet), a timeout is set to display an alert at the appropriate time. The timers are cleared when the component unmounts or when selectedMeals changes.

## **How to Use the Widget**

1. Enter your desired target calorie count in the "Target Calories" input field.
2. Specify your preferred meal time using the "Meal Time" input field.
3. Click the "See Suggestions" button to generate a list of suggested meals based on your inputs.
4. Review the suggested meals, including their titles, ready-in times, and serving sizes.
5. To select a meal, click the "Select" button next to the desired meal. This will retrieve additional information about the meal, including an image and a link for more details.
6. The selected meals will be displayed separately, showcasing the meal details and providing options to remove unwanted and due selections.
7. To clear the suggested meals and reset the widget, click the "Clear Suggestions" button. This will remove all suggested meals and clear the input fields for target calories and meal time.

**`By utilizing the Meal Planner Widget, users can conveniently plan their daily meals while staying within their desired calorie range. The widget streamlines the process of finding suitable meal options and allows for easy selection and organization of meals throughout the day.`**
