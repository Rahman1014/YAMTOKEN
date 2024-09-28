import React from "react";
import { ThemeProvider } from "@mui/material";
import "./App.css";
import "./assets/css/globals.css";
import theme from "./theme";
import AppRouter from "./routes/Router";

function App() {

  return (
    <ThemeProvider theme={theme}>
        <div className="App">
          <AppRouter />
        </div>
    </ThemeProvider>
  );
}

export default App;