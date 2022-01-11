import "./App.css";
import { io } from "socket.io-client";
import React from "react";

function App() {
  const [ID, setID] = React.useState("");
  const [input, setInput] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [Mess, setMes] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  const socketRef = React.useRef(null);

  React.useEffect(() => {
    socketRef.current = io("http://localhost:3000/");
    socketRef.current.on("connect", () => {
      setID(socketRef.current.id);
    });
    socketRef.current.emit("set-name", "hari");
  }, []);
  React.useEffect(() => {
    socketRef.current.on("get-users", (data) => {
      setUsers([...users, data]);
    });
  }, [users]);

  React.useEffect(() => {
    socketRef.current.on("get-message", (mes) => {
      setMes([...Mess, mes]);
    });
  }, [socketRef, Mess]);

  const handleSubmit = () => {
    socketRef.current.emit("send-message", { id: ID, message: input }, room);
    setInput("");
  };

  const handleRoomSubmit = () => {
    socketRef.current.emit("join-room", room, (data) => {
      handleData(data);
    });
  };
  const handleData = (arg) => {
    alert(arg);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>username: {ID}</h1>

        {Mess.map((res, i) => (
          <div
            style={{
              transform: "all ease-in 300ms",
              textAlign: res.id === ID ? "right" : "left",
            }}
          >
            <p
              key={i}
              style={{
                background: res.id === ID ? "white" : "grey",
                color: res.id === ID ? "black" : "white",
                padding: "2px 6px",
              }}
            >
              {res?.message}
            </p>
            <span
              style={{
                fontSize: "14px",
                marginTop: "-20px",
                marginBottom: "20px",
              }}
            >
              {" "}
              {res.id === ID ? "--you" : "--friend"}
            </span>
          </div>
        ))}

        <input
          type="text"
          name="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSubmit}>submit</button>
        <input
          type="text"
          name="input"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleRoomSubmit}>submit</button>
      </header>
    </div>
  );
}

export default App;
