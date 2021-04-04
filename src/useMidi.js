import { useState, useEffect, useRef } from "react";
import WebMidi from "webmidi";

function useMidi(logMessage) {
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
        logMessage(
          "WebMidi could not be enabled. Make sure your browser supports it."
        );
      } else {
        if (!WebMidi.inputs.length) {
          logMessage(
            "Couldn't find any connected MIDI controllers. Connect one and refresh the page to proceed."
          );
          return;
        }

        const input = WebMidi.inputs[0];

        logMessage(`Connected to ${input.manufacturer}`);
        logMessage(`Play a key or chord to have it highlighted in the staves above.`);

        input.addListener("noteon", "all", onNotePressed);
      }
    });
  };

  useEffect(() => {
    enableWebMidi();
  }, []);

  return notes;
}

export default useMidi;
