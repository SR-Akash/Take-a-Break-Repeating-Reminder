                                🧠 **Smart Break Timer – Chrome Extension**
📌 **Overview**
Smart Break Timer is a lightweight Chrome extension that helps you take healthy breaks while working.
It provides:

1.A customizable countdown timer ⏳
2.A progress bar that visually tracks time
3.Repeat mode for continuous cycles
4.Sound alerts 🔔 when the timer finishes
5.Persistent timer state (works even if you close the popup)

**Stay productive while avoiding burnout! 🚀**


**⚙️ Features**
✅ Set custom timer duration (in minutes)
✅ Custom popup message (e.g., "Time to stretch!")
✅ Repeat mode for Pomodoro-style cycles
✅ Progress bar that tracks remaining time
✅ Plays a sound alert when time’s up
✅ Timer continues running even if popup is closed
✅ Simple and minimal design

**📂 Project Structure**
extension/
│── icons/                 # Contains icons in 16, 32, 48, 128 px
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
│
│── popup.html             # Popup UI
│── popup.js               # Countdown + UI logic
│── background.js          # Background script for alarms/audio
│── manifest.json          # Extension config
│── README.md              # Project documentation (this file)


 <img width="312" height="469" alt="image" src="https://github.com/user-attachments/assets/b6414d33-06eb-4e19-91a1-4f35d97bedb9" />


*Popup UI: Shows timer, progress bar, and controls.
*Running Timer: Displays countdown and progress.

**📖 How It Works**

1.Open the extension from the toolbar.
2.Enter the minutes for your break/work session.
3.Optionally edit the popup message.
4.Choose whether to repeat the timer.
5.Pick a sound alert.
6.Click Start.
7.Timer runs in the background.
8.Progress bar updates continuously.
9.When finished → you’ll see “Time’s up!” + hear a sound.
10.If repeat is enabled → the timer restarts automatically.

**⚡ Installation (Developer Mode)**

1.Clone or download this repository.
2.Open Chrome → go to chrome://extensions/.
3.Enable Developer mode (top right).
4.Click Load unpacked and select the project folder.
5.The extension will appear in your toolbar.

**🛠️ Tech Stack**
-Manifest V3
-JavaScript (popup logic, background scripts)
-HTML/CSS (popup UI)
-Chrome Storage API (sync & local storage)

