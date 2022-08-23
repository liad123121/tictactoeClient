import { useState } from "react";
import Board from "./components/Board";

const App = () => {
  const [room, setRoom] = useState(null);
  const [inputRoom, setInputRoom] = useState("");
  const [error, setError] = useState(false);

  return (
    <>
      {!room && (
        <div>
          <h1>Select room:</h1>
          <input
            onChange={(e) => setInputRoom(e.target.value)}
            placeholder="Enter a room name"
          ></input>
          <button onClick={() => setRoom(inputRoom)}>Submit</button>
        </div>
      )}
      {room && <Board room={room} error={setError} setRoom={setRoom} />}
      {error && <h1>{error}</h1>}
    </>
  );
};

export default App;
