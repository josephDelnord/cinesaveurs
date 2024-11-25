import './Popular.scss';

function Popular({ isVisible }: { isVisible: boolean }) {
    return (
        <div id='popular' className={isVisible ? 'visible' : ''}>
        <div id='popular-footer'>
            <div id='popular-footer-orange'> 
            <div id='title-popular'>
                <div className="text base popular-footer-popular" id=''>
                Populaire
                </div><h1 className="text overlay popular-footer-popular" id="title">Populaire</h1>
            </div>
            </div>
            <div id="popular-footer-description">
                a bowl of rice porridge with a cheerful face made from two fried eggs for eyes and bacon strips as a smile
            </div>
            <aside id="popular-footer-source">
                My neighbour totoro
            </aside>
            <aside id="popular-footer-score">
                *****
            </aside>
            <h4 className="popular-footer-title" id='popular-footer-title'>
                black susuwatari
                
            </h4>
            <img className="popular-footer-title" src="/img/arrow.png" alt="arrow" id='popular-arrow' />
            <div id='popular-footer-img-container'>
                <img src="/img/2.jpg" alt="" id="popular-footer-img" />
            </div>
            
        </div>
        </div>
    )
}


export default Popular;