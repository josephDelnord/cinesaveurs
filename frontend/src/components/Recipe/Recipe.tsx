import './Recipe.scss';

function Recipe() {
    return (
        <div className="recipe-id-container">
            <div className="recipe-id-left">
                <div className='recipe-id-titles'>
                <div className="recipe-id-image-container">
                    <img
                        src="/img/2.jpg"
                        alt="Bacon Pancakes"
                        className="recipe-id-recipe-image"
                    />
                    
                </div>
                </div>
                
                <h1 className="recipe-id-title">JAKE'S BACON PANCAKES</h1>
                <h2 className="recipe-id-subtitle">Adventure Time</h2>
                <p className="recipe-id-description">
                    A bowl of rice porridge with a cheerful face made from two fried eggs for eyes and bacon strips as a smile
                </p>
                <div className="recipe-id-rating">⭐⭐⭐⭐⭐</div>
                <p className="recipe-id-lyrics">
                    Bacon pancakes, makin' bacon pancakes,<br />
                    Take some bacon and I'll put it in a pancake,<br />
                    Bacon pancakes, that's what it's gonna make,<br />
                    Bacon pancake!
                </p>
            </div>
            <div className="recipe-id-right">
                <div className="recipe-id-ingredients">
                    <h2 className="recipe-id-section-title">INGREDIENTS</h2>
                    <ul className="recipe-id-list">
                        {["Mélange à pancake (en poudre)", "Eau", "1 à 2 packets de bacon précuit"].map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className="recipe-id-instructions">
                    <h2 className="recipe-id-section-title">INSTRUCTIONS</h2>
                    <ol className="recipe-id-list">
                        {[
                            "Faites chauffer une poêle ou une plaque chauffante. Mélangez la poudre de pancake avec la quantité d'eau indiquée sur l'emballage.",
                            "Versez une portion de pâte de la taille souhaitée dans la poêle et, pendant que le dessous du pancake cuit, placez plusieurs morceaux de bacon sur le dessus.",
                            "Retirez du feu lorsque le pancake est doré à votre goût et répétez jusqu'à ce que tout le mélange et le bacon soient utilisés.",
                        ].map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default Recipe;
