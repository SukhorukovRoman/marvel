import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './charList.scss';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    //загрузка новых элементов (персонажей)
    const [newItemLoading, setNewItemLoading] = useState(false);
    //добавим базовый отступ от начала для загрузки персонажей
    //отдельный, чтобы не загрезнять класс
    const [offset, setOffset] = useState(210);
    //Добавим св-во для обработки случая, когда персонажи больше не приходят (список закончился)
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    //для симуляции componentDidMount используем useEffect
    //с пустым массивом зависимостей
    useEffect(() => {
        //т.к. useEffect вызовется после рендера, 
        //мы можем вызывать в нем функции до их объявления
        onRequest();
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharlistLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharlistLoaded = (newCharList) => {
        //Добавим проверку на то, что при запросе приходят всё те-же 9 персонажей
        //проверка на но то, что список не закончился
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        //т.к. мы будем добавлять персонажей к уже существующему массиву, нам нужен предыдущий state
        //для этого переделае в функцию
        setCharList(charList => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }


    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderCharItem(charList) {
        const resultChars = charList.map((char, i) => {
            const {thumbnail, name} = char;
            return (
                <li 
                className="char__item" 
                ref={el => itemRefs.current[i] = el} 
                key={char.id} 
                onClick={() => {
                    props.onCharSelected(char.id);
                    focusOnItem(i);
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        props.onCharSelected(char.id);
                        focusOnItem();
                    }
                }}>
                    <img src={thumbnail} alt="abyss" style={~thumbnail.indexOf('image_not_available') ? {objectFit: "contain"} : null}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {resultChars}
            </ul>
        )
    }

   // const {charList, loading, error, newItemLoading, offset, charEnded} = this.state
    const charElements = renderCharItem(charList);
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error) ? charElements : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;