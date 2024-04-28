import { useEffect } from "react";

function Timer({ dispatch, secendRemaining }) {
  const mins = Math.floor(secendRemaining / 60);
  const secends = secendRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );

  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins} :{secends < 10 && "0"}
      {secends}
    </div>
  );
}

export default Timer;
