import "./Header.scss";

function Header(){
    return (
        <div>
        <div id="header">
        <div id="logo-title-header">
        <img id="logo-header" src="/img/logo2.png" alt="logo" />
        <div id="title-header">
        <div className="text base">Cine <br /> Delices</div>
        <h1 className="text overlay" id="title">Cine <br /> Delices</h1>
        </div>
        </div>
        <nav id="nav"> <h2>Recettes</h2> <h2>Pseudo</h2> <h2>Deconnexion</h2></nav>
        <div id="orange-line" />
        </div>
        
        </div>
    )
};

export default Header;