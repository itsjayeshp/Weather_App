const InputCity = ({ inputCity, onInputHandler, onSubmitHandler }) => {
  return (
    <form onSubmit={onSubmitHandler} className="input">
      <input
        type="text"
        value={inputCity}
        onChange={onInputHandler}
        placeholder="Enter city name"
      />
      <button type="submit" className="input_btn">Search</button>
    </form>
  );
};

export default InputCity;
