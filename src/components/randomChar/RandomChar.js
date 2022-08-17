import { Component } from 'react';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class RandomChar  extends Component {

    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updadeChar();
        //this.timerId = setInterval(this.updadeChar, 3000);
    }

    componentWillUnmount() {
       //clearInterval(this.timerId);
    }


    //Создадим метод записывающий персонажа
    onCharLoaded = (char) => {
        //{char} == {char: char}
        this.setState({
            char, 
            loading: false,
            error: false
        })
    }

    //Обработаем ошибки
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updadeChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            //если в then просто передается функция, то значение пришедшее в then передастся в функцию 
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    render() {
        const {char, loading, error} = this.state;
        //вынесем логику отображения компонентов вверх
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {/* * условный рендеринг */}
                {/* если придет null  */}
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updadeChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

//Отделим логический блок, для условного рендеринга компонента *(см выше)
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={~thumbnail.indexOf('image_not_available') ? {objectFit: "contain"} : null}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;