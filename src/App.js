import { useState } from "react";
import Vex from "vexflow";
import useMidi from "./useMidi";
import Staff from "./Staff";

const VF = Vex.Flow;
const keySignatures = Object.keys(VF.keySignature.keySpecs);

function App() {
  const [key, setKey] = useState("");
  const notes = useMidi(logMessage);
  const [messages, setMessages] = useState([]);

  function logMessage(message) {
    setMessages((currentMessages) => [...currentMessages, message]);
  }

  return (
    <div className="container">
      <select value={key} onChange={(e) => setKey(e.target.value)}>
        <option value="">Select a key signature</option>
        {keySignatures.map((keySignature) => (
          <option key={keySignature} value={keySignature}>
            {keySignature}
          </option>
        ))}
      </select>
      <Staff chosenKey={key} notes={notes} logMessage={logMessage} />
      <div className="messages">
        {messages.map((message, i) => (
          <div className="message" key={i}>
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
