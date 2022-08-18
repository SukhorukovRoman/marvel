import { Component } from 'react/cjs/react.production.min';
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
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.getCharList();
    }

    onCharlistLoaded = (charList) => {
        this.setState({
            charList,
            loading: false,
            error: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    getCharList = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharlistLoaded)
            .catch(this.onError)
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
        const {charList, loading, error} = this.state
        const charElements = this.renderCharItem(charList);
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? charElements : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;