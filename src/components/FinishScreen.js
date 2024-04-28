function FinishScreen({ points, maxPossiblePoints, dispatch }) {
  const presentage = (points / maxPossiblePoints) * 100;

  let emoji;
  if (presentage === 100) emoji = "🥇";
  if (presentage >= 80 && presentage > 100) emoji = "🥈";
  if (presentage >= 50 && presentage > 80) emoji = "🥉";
  if (presentage >= 0 && presentage > 50) emoji = "😶‍🌫️";
  if (presentage === 0) emoji = "🤦‍♂️";
  return (
    <>
      <p className="result">
        <span>{emoji}</span>You scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoints}({Math.ceil(presentage)}%)
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
