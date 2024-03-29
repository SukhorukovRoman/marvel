import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from "react-transition-group";

import useMarvelService from '../../services/MarvelService';
import './charList.scss';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            //у нас нет ожидания, поэтому заменим на спинер
            return <Spinner/>
        case 'loading':
            //загрузка показывается только при первом запросе, далее отображается компонент
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'error':
            return <ErrorMessage/>
        case 'confirmed':
            return <Component/>
        default:
            throw new Error('Unexpected process state');
    }
};

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    //загрузка новых элементов (персонажей)
    const [newItemLoading, setNewItemLoading] = useState(false);
    //добавим базовый отступ от начала для загрузки персонажей
    //отдельный, чтобы не загрезнять класс
    const [offset, setOffset] = useState(210);
    //Добавим св-во для обработки случая, когда персонажи больше не приходят (список закончился)
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    //для симуляции componentDidMount используем useEffect
    //с пустым массивом зависимостей
    useEffect(() => {
        //т.к. useEffect вызовется после рендера, 
        //мы можем вызывать в нем функции до их объявления
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        //т.к. у нас теперь loading всегда в true
        //будем передавать параметр нужна она или нет
        //иначе при дозагрузке персонажей, предыдущие меняются на loading
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharlistLoaded)
            .then(() => setProcess('confirmed'))
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
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item?.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }


    // Этот метод создан для оптимизации,
    // чтобы не помещать такую конструкцию в метод render
    function renderCharItem (arr){
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    //т.к. при клике идет вызов onCharSelected и повторная перерисовка, фокус устанавливается на элемент и затем элементы перерисовываются
    //запомним значение через useMemo во избежание лишней перерисовки
    const elements = useMemo(() => {
        return setContent(process, () => renderCharItem(charList), newItemLoading)
    }, [process])

    return (
        <div className="char__list">
            {elements}
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