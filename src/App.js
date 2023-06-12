import "./App.css";
import AppointmentTable from "./components/AppointmentTable";
import Notes from "./components/notes/Notes";
import PreviousNotes from "./components/notes/PreviousNotes";

function App() {
  return (
    <div className='App'>
      <PreviousNotes />
      <Notes />
      {/* <AppointmentTable/> */}
    </div>
  );
}

export default App;
