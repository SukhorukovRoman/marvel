import { useState, useEffect } from 'react';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import useMarvelService from '../../services/MarvelService';
import setContent from "../../utils/setContent";

const RandomChar = () => {

    const [char, setChar] = useState({});
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updadeChar();
        // const timerId = setInterval(updadeChar, 3000);
        // //аналог componentWillUnmount
        // return () => {
        //     clearInterval(timerId);
        // }
    }, []);


    //Создадим метод записывающий персонажа
    const onCharLoaded = (char) => {
        //{char} == {char: char}
        setChar(char);
    }

    const updadeChar = () => {
        //удаляем ошибку при новом запросе
        //иначе ошибка мешала бы вывести нового персонажа
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            //если в then просто передается функция, то значение пришедшее в then передастся в функцию 
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }


    return (
        <div className="randomchar">
            {/* * условный рендеринг */}
            {/* если придет null  */}
            {setContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updadeChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

//Отделим логический блок, для условного рендеринга компонента *(см выше)
const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki} = data
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={~thumbnail?.indexOf('image_not_available') ? {objectFit: "contain"} : null}/>
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