import './Recipes.scss';
import { useState } from 'react';

function Recipes({ togglePopular }: { togglePopular: () => void }) {
    const [showMore, setShowMore] = useState(false);

    const handleShowMore = () => {
        setShowMore(!showMore);
        togglePopular();
    };


    return (
        <div>
            <div > <input type="text" id="research" placeholder='Recherche...' /></div>
            <div id="recipes-list">
                <div className="recipe-card">
                    <div className='recipe-card-top'>
                        <aside className='aside-card'>+</aside>
                        <div className='recipe-card-img-container'>
                        <img src="/img/1.jpg" alt="" className="recipe-card-img" /></div>
                    </div>
                    <div className='recipe-card-bottom'>
                        <h3>Happy Porridge</h3>
                        <div className='recipe-card-description'>a bowl of rice porridge with a cheerful face made from two fried eggs for eyes and bacon strips as a smile</div>
                        <h4 className='recipe-card-recipe'>Mulan</h4>
                    </div>
                </div>
                <div className="recipe-card">  <div className='recipe-card-top'>
                        <aside className='aside-card'>+</aside>
                        <div className='recipe-card-img-container'>
                        <img src="/img/1.jpg" alt="" className="recipe-card-img" /></div>
                    </div>
                    <div className='recipe-card-bottom'>
                        <h3>Happy Porridge</h3>
                        <div className='recipe-card-description'>a bowl of rice porridge with a cheerful face made from two fried eggs for eyes and bacon strips as a smile</div>
                        <h4 className='recipe-card-recipe'>Mulan</h4>
                    </div></div>
                <div className="recipe-card"> <div className='recipe-card-top'>
                        <aside className='aside-card'>+</aside>
                        <div className='recipe-card-img-container'>
                        <img src="/img/1.jpg" alt="" className="recipe-card-img" /></div>
                    </div>
                    <div className='recipe-card-bottom'>
                        <h3>Happy Porridge</h3>
                        <div className='recipe-card-description'>a bowl of rice porridge with a cheerful face made from two fried eggs for eyes and bacon strips as a smile</div>
                        <h4 className='recipe-card-recipe'>Mulan</h4>
                    </div></div>
                <div className="recipe-card"> <div className='recipe-card-top'>
                        <aside className='aside-card'>+</aside>
                        <div className='recipe-card-img-container'>
                        <img src="/img/1.jpg" alt="" className="recipe-card-img" /></div>
                    </div>
                    <div className='recipe-card-bottom'>
                        <h3>Happy Porridge</h3>
                        <div className='recipe-card-description'>a bowl of rice porridge with a cheerful face made from two fried eggs for eyes and bacon strips as a smile</div>
                        <h4 className='recipe-card-recipe'>Mulan</h4>
                    </div></div>
                <div className={`recipe-card ${!showMore ? 'hidden' : ''}`}> <div className='recipe-card-top'>
                        <aside className='aside-card'>+</aside>
                        <div className='recipe-card-img-container'>
                        <img src="/img/1.jpg" alt="" className="recipe-card-img" /></div>
                    </div>
                    <div className='recipe-card-bottom'>
                        <h3>Happy Porridge</h3>
                        <div className='recipe-card-description'>a bowl of rice porridge with a cheerful face made from two fried eggs for eyes and bacon strips as a smile</div>
                        <h4 className='recipe-card-recipe'>Mulan</h4>
                    </div></div>
                <div className={`recipe-card ${!showMore ? 'hidden' : ''}`}> <div className='recipe-card-top'>
                        <aside className='aside-card'>+</aside>
                        <div className='recipe-card-img-container'>
                        <img src="/img/1.jpg" alt="" className="recipe-card-img" /></div>
                    </div>
                    <div className='recipe-card-bottom'>
                        <h3>Happy Porridge</h3>
                        <div className='recipe-card-description'>a bowl of rice porridge with a cheerful face made from two fried eggs for eyes and bacon strips as a smile</div>
                        <h4 className='recipe-card-recipe'>Mulan</h4>
                    </div></div>
            </div>
            <button id="show-more" type="button" onClick={handleShowMore}>
                {showMore ? 'Voir moins' : 'Voir plus'}
            </button>
        </div>
    )
}

export default Recipes;