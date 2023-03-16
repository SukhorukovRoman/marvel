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

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    };

    const getAllComics = async (offset = 0) => {
        const res = await request(
            `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformComics);
    };


    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    };

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
    };

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "There is no description",
            pageCount: comics.pageCount
                ? `${comics.pageCount} p.`
                : "No information about the number of pages",
            thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
            language: comics.textObjects[0]?.language || "en-us",
            price: comics.prices[0].price
                ? `${comics.prices[0].price}$`
                : "not available",
        };
    };

    return {loading, error, getAllCharacters, getCharacter, getCharacterByName, getAllComics, getComic, clearError}
}

export default useMarvelService;