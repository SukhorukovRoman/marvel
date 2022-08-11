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

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=6&offset=120&${this._apiKey}`);
    }

    getCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    }
}

export default MarvelService;