document.addEventListener("DOMContentLoaded", () => {
  let currentUser = null;

  // Handle login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const users = JSON.parse(localStorage.getItem("users")) || {};

      if (users[username] && users[username].password === password) {
        currentUser = username; // Set the logged-in user
        localStorage.setItem("currentUser", username); // Save session
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid username or password. Please try again.");
      }
    });
  }

  // Handle registration
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent page reload on form submission

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Check if required fields are empty
      if (!name || !email || !username || !password) {
        alert("Please fill in all the required fields.");
        return;
      }

      // Retrieve existing users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || {};

      // Check for duplicate username
      if (users[username]) {
        alert("Username already exists. Please choose a different username.");
        return;
      }

      // Save new user to localStorage
      users[username] = { name, email, password, workouts: [] };
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registration successful! Please log in.");
      window.location.href = "login.html"; // Redirect to login page
    });
  }

  // Handle workouts
  const workoutForm = document.getElementById("activity-form");
  if (workoutForm) {
    workoutForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const steps = document.getElementById("steps").value.trim();
      const calories = document.getElementById("calories").value.trim();
      const heartRate = document.getElementById("heartRate").value.trim();

      // Get the logged-in user
      currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        alert("No user logged in. Please log in first.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || {};
      const user = users[currentUser];

      if (!user) {
        alert("User not found. Please log in again.");
        return;
      }

      // Save workout data for the current user
      user.workouts.push({ steps, calories, heartRate });
      users[currentUser] = user;
      localStorage.setItem("users", JSON.stringify(users));

      alert("Workout data saved successfully!");
      workoutForm.reset();
    });
  }

  // Display workouts on the Workout Summary page
  const workoutSummarySection = document.getElementById("workout-summary");
  if (workoutSummarySection) {
    currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const user = users[currentUser];

    if (user && user.workouts.length > 0) {
      workoutSummarySection.innerHTML = "<h2>Your Workout Summary</h2>";
      user.workouts.forEach((workout, index) => {
        workoutSummarySection.innerHTML += `
          <div class="summary-card">
            <h3>Workout ${index + 1}</h3>
            <p>Steps: ${workout.steps}</p>
            <p>Calories Burned: ${workout.calories} kcal</p>
            <p>Heart Rate: ${workout.heartRate} bpm</p>
          </div>
        `;
      });
    } else {
      workoutSummarySection.innerHTML = "<p>No workout data available. Start tracking your workouts!</p>";
    }
  }

  // Handle Logout
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("currentUser"); // Clear session
      alert("Logged out successfully!");
      window.location.href = "login.html";
    });
  }
});
