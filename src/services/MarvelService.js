import {useHttp} from '../hooks/http.hook'
//Создадим обычный js класс
const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=062633041e17e1c2507b4d50287307de';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const result = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return result.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
        const result = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(result.data.results[0])
    }

    const _transformCharacter = (character) => {
        return {
            id: character.id,
            name: character.name,
            description: character.description || 'Данные про этого персонажа отсутсвуют',
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError}
}

export default useMarvelService;