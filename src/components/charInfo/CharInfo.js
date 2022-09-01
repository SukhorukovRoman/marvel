import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './charInfo.scss';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';


const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    //изначально укажем false, т.к. при первом отображение блок не грузится, отображается скелетон
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])


    const updateChar = () => {
        const {charId} = props;
        if(!charId) {
            return
        }
        onCharLoading();
        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    //Создадим метод записывающий персонажа
    const onCharLoaded = (char) => {
        //{char} == {char: char}
        setChar(char);
        setLoading(false);
        setError(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    //Обработаем ошибки
    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;
    return (
        <div className="char__info">
            {/* из-за условий отобразится только один элемент, остальные т.к. null не отобразятся */}
            {skeleton}
            {spinner}
            {errorMessage}
            {content}
        </div>
    )
    
}

//Отделим статичный элемент отображения от компонента с логикой
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={~thumbnail.indexOf('image_not_available') ? {objectFit: "contain"} : null}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            {

            }
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        if  (i >= 10) return
                        return (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}


CharInfo.propTypes = {
    //название приходящего св-ва: валидация типа
    charId: PropTypes.number
}

export default CharInfo;