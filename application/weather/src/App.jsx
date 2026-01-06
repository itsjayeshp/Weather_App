import Header from "./components/Header";
import InputCity from "./components/InputCity";
import "./App.css";
import { useState } from "react";

function App() {
  const [city, setCity] = useState("");

  const onInputHandler = (event) => {
    setCity(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log("City submitted:", city);
  };

  return (
    <div className="App">
      <Header />
      <InputCity
        city={city}
        onInputHandler={onInputHandler}
        onSubmitHandler={onSubmitHandler}
      />
    </div>
  );
}

export default App;
