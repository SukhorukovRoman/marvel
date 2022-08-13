import img from './error.gif' 

const ErrorMessage = () => {
    return (
        //нам нужно достать gif
        //если нам потребуется использовать переменную окружения process.env.PUBLIC_URL
        //<img src={`${process.env.PUBLIC_URL}/error.gif`}/>
        //!используется редко лучше переместить в папку с компонентами
        <img 
            src={img}
            alt="error"
            style={{
                display: 'block',
                width: "250px",
                height: "250px",
                objectFit: 'contain',
                margin: '0 auto'
            }}
            />
    )
}

export default ErrorMessage