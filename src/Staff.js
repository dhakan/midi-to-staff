import { useState, useEffect, useRef } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;
const keySignatures = Object.keys(VF.keySignature.keySpecs);

function Staff({ notes }) {
  const [key, setKey] = useState(keySignatures[0]);
  const elementRef = useRef(null);
  const contextRef = useRef(null);
  const trebleRef = useRef(null);
  const bassRef = useRef(null);

  const setUpStaves = () => {
    contextRef.current.clear();

    const keySignatureObj = new Vex.Flow.KeySignature(key);

    const treble = new VF.Stave(10, 40, 400);
    treble.addClef("treble").addTimeSignature("4/4");
    treble.addModifier(keySignatureObj);
    treble.setContext(contextRef.current).draw();

    const bass = new VF.Stave(10, 120, 400);
    bass.addClef("bass").addTimeSignature("4/4");
    bass.addModifier(keySignatureObj);
    bass.setContext(contextRef.current).draw();

    trebleRef.current = treble;
    bassRef.current = bass;
  };

  useEffect(() => {
    const renderer = new VF.Renderer(
      elementRef.current,
      VF.Renderer.Backends.SVG
    );
    renderer.resize(500, 500);
    contextRef.current = renderer.getContext();
  }, []);

  useEffect(() => {
    setUpStaves();
  }, [key]);

  useEffect(() => {
    if (!notes.length) {
      return;
    }

    setUpStaves();

    const keyManager = new VF.KeyManager(key);

    const alteredNotes = notes.map(({ name, octave }) => {
      const { note } = keyManager.selectNote(name.toLowerCase());
      return { name: note, octave };
    });

    const keys = alteredNotes.map(
      ({ name, octave }) => `${name.toLowerCase()}/${octave}`
    );
    const uniqueKeys = [...new Set(keys)];

    const renderedNotes = [
      new VF.StaveNote({
        clef: "treble",
        keys: uniqueKeys,
        duration: "q",
      }),
    ];

    const voices = [new VF.Voice({ num_beats: 1, beat_value: 4 })];
    voices[0].addTickables(renderedNotes);

    new VF.Formatter().joinVoices(voices).format(voices, 400);

    voices.forEach((voice) =>
      voice.draw(contextRef.current, trebleRef.current)
    );
  }, [notes]);

  return (
    <div>
      <select value={key} onChange={(e) => setKey(e.target.value)}>
        {keySignatures.map((keySignature) => (
          <option key={keySignature} value={keySignature}>
            {keySignature}
          </option>
        ))}
      </select>
      <div ref={elementRef}></div>
    </div>
  );
}

export default Staff;
