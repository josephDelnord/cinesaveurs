// fonctions pour interagir avec le localstorage

// sauvegarde le pseudo et le token dans le localstorage
export const saveTokenAndPseudoInLocalStorage = (pseudo: string, token: string) => {
    localStorage.setItem("pseudo", pseudo);
    localStorage.setItem("token", token);
}

// récupère le pseudo et le token du localstorage
export const getTokenAndPseudoFromLocalStorage = () => {
    const pseudo = localStorage.getItem('pseudo');
    const token = localStorage.getItem('token');
    
    return {pseudo, token};
}

// supprime le pseudo et le token du localstorage
export const removePseudoAndTokenFromLocalStorage = () => {
    localStorage.removeItem("pseudo");
    localStorage.removeItem("token");
}