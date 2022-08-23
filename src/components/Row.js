import "./Row.css";

const Row = ({ handleOnClick, matrix, pieces }) => {
  return (
    <div className="row">
      <div className="col-4" onClick={handleOnClick} id={matrix[0]}>
        {pieces[0] && pieces[0]}
      </div>
      <div className="col-4" onClick={handleOnClick} id={matrix[1]}>
        {pieces[1] && pieces[1]}
      </div>
      <div className="col-4" onClick={handleOnClick} id={matrix[2]}>
        {pieces[2] && pieces[2]}
      </div>
    </div>
  );
};

export default Row;
