# Pomodoro Timer

#### Video Demo:  https://youtu.be/TNdYssDazl8

#### Description:
# Customizable Pomodoro Timer Application 🍅

This project delivers a robust, web-based Pomodoro Timer application. It is designed as a focused productivity tool built upon the principles of the **Pomodoro Technique**, which uses timed intervals to alternate between dedicated work sessions (Focus Time) and short, restorative breaks (Break Time). A key differentiator of this implementation is its emphasis on **user customization**, allowing individuals to define the duration of their Focus sessions, regular breaks, and an extended "Big Break" interval, making the tool adaptable to various workflows and concentration levels.

The application utilizes a lightweight **Flask** backend for routing and initial data handling, coupled with dynamic client-side logic managed by **JavaScript**, ensuring a smooth and responsive user experience within an aesthetically engaging interface.

---

## Project Overview and Core Functionality

The primary objective of this application is to serve as an intelligent time-management companion. Upon navigating to the root URL, users are presented with a simple form where they input their preferred session lengths, specified in minutes, for:
1.  **Focus Time:** The duration of a work session.
2.  **Break Time:** The duration of a short rest following a Focus Time.
3.  **Big Interval (Big Break):** The duration of an extended rest period.

Once these times are submitted, the timer begins its operation, automatically cycling through the Focus and Break sessions. The application strictly enforces the Pomodoro pattern by implementing the user-defined **Big Break Interval after every four consecutive Focus sessions**. This ensures the user receives adequate mental recovery time, a crucial element for maintaining productivity over long periods.

The front-end is crafted for clarity and ease of use, featuring a prominently displayed countdown and intuitive **Start/Pause** and **Reset** controls. Visual feedback is immediate, with button styles changing based on the timer's state. A dynamic, animated background adds an element of visual appeal without being overly distracting. Crucially, audio alerts and system notifications (via `alert()` dialogs) are used to signal the end of a session and the transition into the next phase (Focus, Break, or Big Break), allowing users to work without constantly monitoring the clock.

---

## Technical Architecture and File Structure

The project employs a clean separation of concerns across its files, adhering to standard web application best practices.

### 1. `app.py` (Flask Backend)

This Python file is the **application entry point** using the Flask micro-framework. It manages the server-side logic and routing.

* **Routing:** The main route (`@app.route("/", methods=["GET", "POST"])`) handles the application's entire navigation flow.
    * **GET Request:** Renders `home.html`, presenting the initial configuration form to the user.
    * **POST Request:** Processes the time settings submitted from the form.
* **Input Handling and Validation:** It retrieves the submitted `minutes`, `interval`, and `bigInter` values from the request form. **Robust server-side validation** is then performed to ensure all inputs:
    1.  Exist and are provided.
    2.  Are valid integers (`.isdigit()`).
    3.  Are within a logical range (currently $0 < \text{time} < 60$ minutes).
* **Data Passage:** Upon successful validation, the validated time values are passed as variables to the `index.html` template. If validation fails (e.g., non-numeric input), the user is directed back to `home.html`.

### 2. `static/Timer.js` (Client-Side Logic)

The heart of the application's dynamic functionality lies within this **JavaScript class**, which encapsulates all the timer's behavior.

* **`Timer` Class:** The core component that manages the timer's lifecycle and UI interaction.
    * **Constructor:** Initialized with a root DOM element, it injects the necessary timer HTML and binds various DOM elements (`minutes`, `seconds`, `control`, `reset`) to internal properties. It also retrieves the user-defined times from the DOM's `data-` attributes and initializes the state variables (`remainingSeconds`, `sessionCount`, `isBreak`, etc.).
    * **`start()` and `stop()`:** Control the countdown mechanism using `setInterval()`. The `start()` function is where the core countdown loop and decision logic resides.
    * **Pomodoro State Machine:** Inside `start()`, when `remainingSeconds` reaches zero, the function implements the state machine logic: it increments the `sessionCount` and checks the session type (`isBreak` or `isBigBreak`) and the session count modulus ($\text{sessionCount} \pmod{4}$). This logic correctly determines whether to transition to a Focus session, a regular Break, or a Big Break.
    * **Interface Updates:** The `updateInterfaceTimer()` ensures the displayed minutes and seconds are correctly formatted, and `updateInterfaceControls()` toggles the control button's icon and styling (Play/Pause).
    * **Transition Handlers:** Methods like `startFocus()`, `startBreak()`, and `startBigBreak()` are responsible for resetting the timer duration, playing the sound notification, alerting the user to the session change, and restarting the countdown.

### 3. `static/style.css` (Styling)

This CSS file provides the visual design for the entire application, focusing on aesthetics and user-centered presentation.

* **Centering:** The `.centralize` class uses **Flexbox** for vertical and horizontal centering, ensuring a professional and focused layout across various screen sizes.
* **Animated Background:** The `body` element features a sophisticated, slow-moving **animated gradient** (`@keyframes gradient`). This design choice provides a modern, ambient feel to the application, distinguishing it from static productivity tools.
* **Typography and Controls:** Specific styles are applied to the timer numbers (`.timer__part`) to make them large and highly legible. Custom styles for buttons (`.timer__btn`) clearly denote their function and state using distinct colors (green for start, red for stop).

### 4. HTML Templates (Jinja2)

The templating engine is used to structure the HTML and inject dynamic content.

* **`layout.html`:** The base template, responsible for including essential resources like **Bootstrap CSS**, custom `style.css`, and the **Material Icons** font for the control button symbols. All other templates inherit this structure.
* **`home.html`:** The template for the initial form. It is a simple page that accepts the three time inputs and submits them via a **POST** request.
* **`index.html`:** The main timer view. This template is crucial as it leverages Flask's templating capabilities to embed the user-defined time variables (passed from `app.py`) directly into the main timer `div` as **data attributes** (`data-minutes`, `data-interval`, etc.). It also links to `Timer.js`.

---

## Design Choices and Justifications

The architectural decisions made during the development of this project were guided by principles of maintainability, user experience, and robust data handling.

### 1. Separation of Configuration and Execution

A deliberate choice was made to **separate the time configuration logic** (handled by `app.py` and `home.html`) **from the runtime execution logic** (handled by `Timer.js` and `index.html`).

* **Justification:** This two-step process provides a clear point for **input validation** on the server side (`app.py`), preventing bad or malicious data from reaching the core JavaScript logic. It also ensures that the `Timer.js` class is focused purely on time management and UI manipulation, leading to cleaner, more maintainable code.

### 2. Implementation of `Timer.js` as a Class

The client-side logic was built around a dedicated **ES6 JavaScript class** rather than a collection of global functions.

* **Justification:** Using a class enforces **encapsulation** of the timer's internal state (its current time, its active interval ID, whether it's a break, the session count). This makes the Pomodoro logic significantly easier to manage, particularly the complex state machine that dictates the transitions between Focus, Break, and Big Break sessions, as all state variables are reliably scoped to the class instance.

### 3. Data Transfer Mechanism

The user-defined times are passed from the Flask backend to the JavaScript frontend via **HTML data attributes** in `index.html`.

* **Justification:** This approach is superior to embedding JavaScript variables directly into the template or passing data via a URL query string. Data attributes are the standard, non-intrusive way to store custom data privately on HTML elements, allowing the `Timer.js` constructor to easily and reliably access the initial configuration parameters using the standard `dataset` API.

### 4. User Alerting Strategy

The application uses a combination of **audio files** and browser **`alert()` dialogs** to notify the user of session transitions.

* **Justification:** While modern web notifications are an option, the `alert()` dialogs were chosen for their **guaranteed visibility and interruption**, which is essential for a productivity timer. The user *must* acknowledge the end of a session before proceeding. The accompanying sound cue provides a less intrusive, immediate auditory warning. This dual approach ensures the user is pulled out of their focused state at the correct moment, fulfilling the core purpose of the Pomodoro Technique.

### 5. AI Assistance Disclaimer

It is important to note that, as specified in the source code comments, this project leveraged assistance from **AI tools, including GitHub Copilot**. This was utilized primarily for boiler-plate code and syntax suggestions, allowing for more time to be allocated to the crucial logical implementation and robust documentation, thereby improving development efficiency without sacrificing code quality or integrity.