import "./App.css";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <>
      <div>
        <SignIn />
        <SignUp />
        <Main />
        <NotFound />
      </div>
    </>
  );
}

export default App;
