import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Deconnexion (supprission du token du localStorage et sur axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requete HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param credentials
 * @returns {Promise<AxiosResponse<any>>}
 */
function authenticate(credentials) {
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stocke le token dans mon localestorage
            window.localStorage.setItem("authToken", token);
            // On previent Axios qu'on a maintenant un header par default sur toutes nos futures requetes HTTP
            setAxiosToken(token);
        });
}

/**
 * Positionne le token JWT sur Axios
 * @param token
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de application
 */
function setup() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp: expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifie ou pas
 * @returns {boolean}
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp: expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};