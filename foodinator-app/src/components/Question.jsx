import ButtonList from "./buttonList";

const Question = ({ question, options }) => {
    return (
        <div className="question-prompt">
            <p className="question-text">{question}</p>
            <div className="question-buttons-list">
                <ButtonList items={options} />
            </div>
        </div>
    );
};

export default Question;