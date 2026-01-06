export const InputCity = ({ city, onInputHandler, onSubmitHandler }) => {
  return (
    <form onSubmit={onSubmitHandler} className="input-container">
      <input
        type="text"
        value={city}
        onChange={onInputHandler}
        placeholder="Enter city name"
      />
      <button type="submit">Search</button>
    </form>
  );
};
