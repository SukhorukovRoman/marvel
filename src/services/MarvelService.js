//Создадим обычный js класс
class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=062633041e17e1c2507b4d50287307de';

    getResource = async (url) => {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }
    
        return await response.json();
    }

    getAllCharacters = async () => {
        const result = await this.getResource(`${this._apiBase}characters?limit=9&offset=120&${this._apiKey}`);
        return result.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const result = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(result.data.results[0])
    }

    _transformCharacter = (character) => {
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
}

export default MarvelService;