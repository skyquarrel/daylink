import PlannerPage from "./components/PlannerPage";
import LoginButton from "./components/LoginButton";
import "./App.css";

function App() {
  return (
    <>
      <div className="top-bar">
        <LoginButton />
      </div>

      <PlannerPage />
    </>
  );
}

export default App;