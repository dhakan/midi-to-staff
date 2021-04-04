import { useState, useEffect, useRef } from "react";
import WebMidi from "webmidi";

function useMidi() {
  const [notes, setNotes] = useState([]);
  const timer = useRef(null);

  const onNotePressed = (e) => {
    const { note } = e;

    if (!timer.current) {
      timer.current = setTimeout(() => {
        timer.current = null;
        setNotes([]);
      }, 300);
    }

    setNotes((currentNotes) => {
      return [note, ...currentNotes];
    });
  };

  const enableWebMidi = () => {
    WebMidi.enable(function (err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");

        const input = WebMidi.inputs[0];

        input.addListener("noteon", "all", onNotePressed);
      }
    });
  };

  useEffect(() => {
    enableWebMidi();
  });

  return notes;
}

export default useMidi;
