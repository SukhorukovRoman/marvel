import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';
import './charList.scss';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        charList: [],
        loading: true,
        error: false,
        //загрузка новых элементов (персонажей)
        newItemLoading: false,
        //добавим базовый отступ от начала для загрузки персонажей
        //отдельный, чтобы не загрезнять класс
        offset: 210,
        //Добавим св-во для обработки случая, когда персонажи больше не приходят (список закончился)
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharlistLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharlistLoaded = (newCharList) => {
        //Добавим проверку на то, что при запросе приходят всё те-же 9 персонажей
        //проверка на но то, что список не закончился
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        //т.к. мы будем добавлять персонажей к уже существующему массиву, нам нужен предыдущий state
        //для этого переделае в функцию
        this.setState(({offset, charList}) => ({
            //к предыдущим элементам добавим новые
            charList: [...charList, ...newCharList],
            loading: false,
            error: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }


    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderCharItem(charList) {
        const resultChars = charList.map(char => {
            const {thumbnail, name} = char;
            return (
                <li className="char__item" key={char.id} onClick={() => this.props.onCharSelected(char.id)}>
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

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state
        const charElements = this.renderCharItem(charList);
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
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;