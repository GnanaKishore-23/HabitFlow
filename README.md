# HabitFlow — Habit Tracker Web App

A beginner-friendly prototype for the Adaptive Software Engineering (24CI3201), ALM-2 project.

## Features
- Add, edit, and delete habits
- Categorize habits and choose a preferred time of day
- Mark habits complete or incomplete for the current date
- Filter all, pending, and completed habits
- Daily completion statistics and progress bar
- Save habits in browser `localStorage`
- Responsive layout for desktop and mobile
- Basic input validation and duplicate-name prevention

## Run the project
1. Extract the ZIP folder.
2. Open `index.html` in a modern browser.
3. Add a habit and test the actions.

No package installation or server is required for this basic prototype. For a more consistent development workflow, open the folder in VS Code and use the Live Server extension.

## Data and limitations
- Data is stored only in the current browser's local storage.
- There is no user login, cloud synchronization, backend, or multi-device support.
- Clearing browser site data can remove saved habits.
- The completion model records completion by local calendar date.

## Suggested project process
Increment 1: layout and navigation.
Increment 2: habit create/edit/delete and validation.
Increment 3: completion tracking, filters, statistics, and local storage.
Increment 4: responsive styling, testing, and release.

## Manual smoke test
See `test-cases.md` for the test cases to execute and record.
