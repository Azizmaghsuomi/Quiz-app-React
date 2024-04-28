import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextBtn from "./NextBtn";
import Progres from "./Progres";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SEC_PER_QUESTION = 30;

const initialState = {
  questions: [],

  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  secendRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataResived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFiled":
      return {
        ...state,
        status: "Error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secendRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "finish":
      return { ...state, status: "finished" };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    // return { ...state, points: 0, index: 0, answer: null, status: "ready" };
    case "tick":
      return {
        ...state,
        secendRemaining: state.secendRemaining - 1,
        status: state.secendRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknwon");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, secendRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numquestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataResived", payload: data }))
      .catch((err) => dispatch({ type: "dataFiled" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen numquestions={numquestions} dispatch={dispatch} />
        )}
        {status === "Error" && <Error />}
        {status === "active" && (
          <>
            <Progres
              index={index}
              numQuestions={numquestions}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
              points={points}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secendRemaining={secendRemaining} />
              <NextBtn
                dispatch={dispatch}
                answer={answer}
                numQuestions={numquestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
