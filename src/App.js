import "./App.css";
import Notes from "./components/notes/Notes";
import PreviousNotes from "./components/previousNotes/PreviousNotes"
function App() {
  return (
    <div className='App'>
      <PreviousNotes/>
      <Notes />
    </div>
  );
}

export default App;
