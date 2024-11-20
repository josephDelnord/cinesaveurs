import './Recipes.scss';

function Recipes () {
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
            </div>
        </div>
    )
}

export default Recipes;