import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set ELECTRON environment variable
process.env.ELECTRON = "true";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, "../public/favicon.ico"),
  });

  mainWindow.loadURL("http://localhost:3000");

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {app.quit();}
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {createWindow();}
});

import("../index.js")
  .then(() => {
    console.log("🚀 Express server running inside Electron");
  })
  .catch((err) => {
    console.error("❌ Failed to start Express server:", err);
  });
