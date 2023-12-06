import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

function App() {
  const initialState = {
    questions: [],
    status: "loading",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "dataReceived":
        return {
          ...state,
          questions: action.payload,
          status: "ready",
        };
      case "dataFailed":
        return {
          ...state,
          status: "error",
        };
      case "start":
        return {
          ...state,
          status: "start",
        };
      default:
        throw new Error("Action unknown");
    }
  };

  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => {
        res.json();
      })
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch((error) => {
        dispatch({ type: "dataFailed" });
      });
  }, []);
  return (
    <div className="App">
      {/* <DateCounter /> */}
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && <Question />}
        {status === "error" && <Error />}
      </Main>
    </div>
  );
}

export default App;
