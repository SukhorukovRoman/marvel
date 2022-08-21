import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';
import './charInfo.scss';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';


class CharInfo extends Component {

    state = {
        char: null,
        //изначально укажем false, т.к. при первом отображение блок не грузится, отображается скелетон
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) {
        //условие нужно для предотвращения бесконенчого цикла
        //т.к. при updateChar дергает setState после которого всегда вызывается componentDidUpdate
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if(!charId) {
            return
        }
        
        this.onCharLoading();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
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

    onCharLoading = () => {
        this.setState({
            loading: true,
        })
    }

    //Обработаем ошибки
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const {char, loading, error} = this.state;

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