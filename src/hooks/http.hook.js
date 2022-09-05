import { useState, useCallback } from "react";

//хук позволяет оптравлять любые запросы, обрабатывать результаты и сохранять локальное состояние
export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //оба состояния error и loading надо менять при запросе
    //loading пока не пришле ответ и error если вернулась ошибка
    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        //перед отправкой запроса, установим loading в true 
        setLoading(true);

        //реализуем обработку ошибки
        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            //если данные загрузились
            setLoading(false);
            //чистые данные, пришедшие с api без обработки
            return data;
        } catch(e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError}
}