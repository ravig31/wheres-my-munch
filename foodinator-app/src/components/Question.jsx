import ButtonList from "./buttonList";

const Question = ({ question, options }) => {
    return (
        <div className="question-prompt">
            <p className="question-header">header</p>
            <p className="question-text">{question}</p>
            <p className="options-header">header options</p>
            <div className="question-buttons-list">
                <ButtonList items={options} />
            </div>
        </div>
    );
};

export default Question;