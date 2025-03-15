import ButtonList from "./buttonList";

const Question = ({ items }) => {
  return (
    <div className="question-prompt">
      <p className="question-text">
        Question?
      </p>
      <div className="question-buttons-list">
        <ButtonList items={items} />
      </div>
    </div>
  );
};

export default Question;