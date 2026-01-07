const InputCity = ({ inputCity, onInputHandler, onSubmitHandler }) => {
  return (
    <form onSubmit={onSubmitHandler} className="input-container">
      <input
        type="text"
        value={inputCity}
        onChange={onInputHandler}
        placeholder="Enter city name"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default InputCity;
