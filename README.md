# Plate Droplet Viewer

Plate Droplet View is an Angular app that:
- Loads a plate droplet JSON file
- Displays wells in a 48- or 96-well grid
- Highlights Low-droplet wells based on a configurable threshold

---

## How to run

Step 1) Open Bash (command-line interpreter)
Step 2) Run command: 
	- npm install
Step 3) Start Dev Server 
	- ng serve
Step 4) Open: http://localhost:4200/ to run application

---

Component / service structure
1.) file-upload – Reads the JSON file and sends parsed data upward.
2.) plate-grid – Renders the plate grid, applies low-well highlighting, and handles duplicate well indices ("-").
3.) summary – Shows total wells, low wells, and the current threshold.
4.) threshold-form – Reactive form for updating the threshold with integer-only validation. Reset returns to the config default.
5.) services – Config service provides default threshold and centralizes configuration.
6.) models – TypeScript interfaces for plate and well data.

Key design choices

* Default threshold comes from the config service (no recompilation needed).
* Threshold form is isolated for cleaner UI logic.
* Reactive forms enforce proper validation.
* Reset always restores the config default for predictable behavior.
* Duplicate well indices in the JSON are surfaced safely using "-" instead of breaking the UI.

Note: Default threshold and JSON file path are managed in the config service