import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import setContent from "../../utils/setContent";


const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const {process, setProcess, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])


    const updateChar = () => {
        const {charId} = props;
        if(!charId) {
            return
        }
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            //Вызываем когда данные сформированы
            //когда данные загружены и переданы в текущий state
            .then(() => setProcess('confirmed'))
    }

    //Создадим метод записывающий персонажа
    const onCharLoaded = (char) => {
        //{char} == {char: char}
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
    
}

//Отделим статичный элемент отображения от компонента с логикой
const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
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