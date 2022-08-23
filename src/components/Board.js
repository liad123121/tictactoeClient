import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

import "./Board.css";
import Row from "./Row";
import Piece from "./Piece";

const socket = io.connect("http://localhost:4000");

const Board = ({ room, setRoom, error }) => {
  const [matrix, setMatrix] = useState(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
  );
  const [turn, setTurn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPiece, setPiece] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`http://localhost:4000/api/pieces/${room}`);
      const copy = Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => null)
      );
      res.data.forEach((piece) => {
        const [row, col] = piece.pos;
        copy[row][col] = <Piece type={piece.type} />;
      });
      setMatrix(copy);
    };

    if (!isPlaying) {
      error(false);
      socket.emit("join_room", room);

      socket.on("tooManyPeople", (data) => {
        setRoom(null);
        error("Too many people are inside!");
      });

      socket.on("Piece", (data) => {
        setPiece(data);
      });

      fetch();
      setIsPlaying(true);
    }

    socket.on("matrix", async (data) => {
      data.type === "X" ? setTurn(false) : setTurn(true);
      const [row, col] = data.pos;

      setMatrix((prev) => {
        const copy = [...prev];
        copy[row][col] = <Piece type={data.type} />;

        return copy;
      });
    });

    socket.on("result", (data) => {
      alert(
        data.status === "win"
          ? `It's a win for ${turn ? "X" : "O"}`
          : "It's a draw!"
      );

      setTurn(true);

      setMatrix(
        Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
      );
    });
  }, [socket]);

  const handleOnClick = async (e) => {
    const [row, col] = e.target.id.split(",");

    try {
      const res = await axios.post("http://localhost:4000/api/check", {
        type: turn ? "X" : "O",
        pos: [row, col],
        room: 0,
      });

      if (res.data.status) {
        socket.emit("end", { room, status: res.data.status });
        alert(
          res.data.status === "win"
            ? `It's a win for ${turn ? "X" : "O"}`
            : "It's a draw!"
        );

        await axios.delete(`http://localhost:4000/api/delete/${room}`);

        setMatrix(
          Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
        );

        setTurn(true);

        return;
      }

      const copy = [...matrix];
      copy[row][col] = <Piece type={turn ? "X" : "O"} />;
      setMatrix(copy);

      socket.emit("send", {
        room,
        type: turn ? "X" : "O",
        pos: [row, col],
      });

      setTurn(!turn);
    } catch (error) {
      console.log(error);
    }
  };

  const whichTurn = turn ? "X" : "O";

  return (
    <form className="board">
      <Row
        handleOnClick={whichTurn === isPiece && handleOnClick}
        matrix={[["0,0"], ["0,1"], ["0,2"]]}
        pieces={matrix[0]}
      />
      <Row
        handleOnClick={whichTurn === isPiece && handleOnClick}
        matrix={[["1,0"], ["1,1"], ["1,2"]]}
        pieces={matrix[1]}
      />
      <Row
        handleOnClick={whichTurn === isPiece && handleOnClick}
        matrix={[["2,0"], ["2,1"], ["2,2"]]}
        pieces={matrix[2]}
      />
      <h1>{`You are ${isPiece} and it's ${turn ? "X" : "O"} turn!`}</h1>
    </form>
  );
};

export default Board;
