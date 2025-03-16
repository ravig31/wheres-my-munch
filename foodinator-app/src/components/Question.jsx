import ButtonList from "./buttonList";
import ball from '../assets/ascii-ball.png';
import '../styles/Question.css';

const Question = ({ question, options }) => {
    return (
        <div className="question-prompt">
            <div className="container">
            <img src={ball} alt="Logo" className="question-image" />
            <p className="question-text">{question}</p>
        </div>
        <div className="question-buttons-list">
                <ButtonList items={options} />
        </div>
        </div>
    );
};

export default Question;