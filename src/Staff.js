import { useEffect, useRef } from "react";
import Vex from "vexflow";

const VF = Vex.Flow;

function Staff({ chosenKey: key, notes, landmarkEnabled }) {
  const elementRef = useRef(null);
  const contextRef = useRef(null);
  const trebleRef = useRef(null);
  const bassRef = useRef(null);

  const setUpLandmark = () => {
    const staveNote = new VF.StaveNote({
      clef: "treble",
      keys: ["c/2", "f/2", "c/3", "f/3", "c/4", "g/4", "c/5", "g/5", "c/6"],
      duration: "w",
    });
    const backgroundColor = "rgba(0, 0, 0, 0.1)";
    staveNote.setStyle({
      fillStyle: backgroundColor,
    });

    const renderedNotes = [staveNote];

    const voices = [new VF.Voice({ num_beats: 4, beat_value: 4 })];
    voices[0].addTickables(renderedNotes);

    new VF.Formatter().joinVoices(voices).format(voices, 400);

    voices.forEach((voice) =>
      voice.draw(contextRef.current, trebleRef.current)
    );
  };

  const setUpStaves = () => {
    contextRef.current.clear();

    const treble = new VF.Stave(0, 0, 400);
    const bass = new VF.Stave(0, 60, 400);

    if (key) {
      bass.addModifier(new Vex.Flow.KeySignature(key));
      treble.addModifier(new Vex.Flow.KeySignature(key));
    }

    treble.addClef("treble");
    bass.addClef("bass");

    treble.setContext(contextRef.current).draw();
    bass.setContext(contextRef.current).draw();

    trebleRef.current = treble;
    bassRef.current = bass;

    if (landmarkEnabled) {
      setUpLandmark();
    }
  };

  useEffect(() => {
    const renderer = new VF.Renderer(
      elementRef.current,
      VF.Renderer.Backends.SVG
    );
    renderer.resize(500, 400);
    contextRef.current = renderer.getContext();
    contextRef.current.scale(2, 2);
  }, []);

  useEffect(() => {
    setUpStaves();
  }, [key, landmarkEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!notes.length) {
      return;
    }

    setUpStaves();

    let alteredNotes = notes;

    if (key) {
      const keyManager = new VF.KeyManager(key);

      alteredNotes = notes.map(({ name, octave }) => {
        const { note } = keyManager.selectNote(name.toLowerCase());
        return { name: note, octave };
      });
    }

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
  }, [notes, key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div ref={elementRef}></div>
    </div>
  );
}

export default Staff;
