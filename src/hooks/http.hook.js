import { useState, useCallback } from "react";

//хук позволяет оптравлять любые запросы, обрабатывать результаты и сохранять локальное состояние
export const useHttp = () => {
    const [process, setProcess] = useState('waiting');

    //оба состояния error и loading надо менять при запросе
    //loading пока не пришле ответ и error если вернулась ошибка
    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        setProcess('loading');

        //реализуем обработку ошибки
        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            //чистые данные, пришедшие с api без обработки
            return data;
        } catch(e) {
            setProcess('error');
            throw e;
        }
    }, []);

    const clearError = useCallback(() => {
        setProcess('loading');
    }, [])

    return {request, clearError, process, setProcess}
}