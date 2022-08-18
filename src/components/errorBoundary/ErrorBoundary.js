import { Component } from "react/cjs/react.production.min";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    //также можно использоватьgetDerivedStateFromError
    // только обновляет состояние 
    // т.е. тот-же setState но который работает только с ошибками
    // static getDerivedStateFromError(error) {
    //     return {error: true}
    // }

    componentDidCatch(error, errorInfo) {
        console.log(error);
        console.log(errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage/>
        }

        //если никакой ошибки нет, то будет рендерить то, что находится внутри этого компонента
        //т.к. ErrorBoundary это оборачивающий компонент

        return this.props.children;
    }
}

export default ErrorBoundary;