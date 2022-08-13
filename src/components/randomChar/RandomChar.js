import { Component } from 'react';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../spinner/spinner';
import MarvelService from '../../services/MarvelService';

class RandomChar  extends Component {
    constructor(props) {
        super(props);
        //вызываем метод при констурировании(создании) объекта
        //!!!!! но это плохая практика т.к. мы вызывает setState на компоненте который еще не появился на странице
        this.updadeChar();
    }

    state = {
        char: {},
        loading: true
    }

    marvelService = new MarvelService();

    //Создадим метод записывающий персонажа
    onCharLoaded = (char) => {
        //{char} == {char: char}
        this.setState({
            char, 
            loading: false
        })
    }

    updadeChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            //если в then просто передается функция, то значение пришедшее в then передастся в функцию 
            .then(this.onCharLoaded)
    }

    render() {
        const {char, loading} = this.state;

        return (
            <div className="randomchar">
                {/* * условный рендеринг */}
                {loading ? <Spinner/> : <View char={char}/>}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
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
            <img src={thumbnail} alt="Random character" className="randomchar__img"/>
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