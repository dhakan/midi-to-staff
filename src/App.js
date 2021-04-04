import useMidi from "./useMidi";
import Staff from "./Staff";

function App() {
  const notes = useMidi();

  return (
    <div>
      <Staff notes={notes} />
    </div>
  );
}

export default App;
