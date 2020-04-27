/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// Les imports importants
import React, {useState, useContext} from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/authAPI";
import authAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');

AuthAPI.setup();

const App = () => {
    // TODO: Il faudrait par defaul qu'on demande a notre AuthAPI si on est connecte ou pas
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());
    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
        <HashRouter>
            <NavbarWithRouter />

            <main className="container pt-5">
                <Switch>
                    <Route path="/login" component={LoginPage}/>
                    <PrivateRoute path="/invoices" component={InvoicesPage}/>
                    <PrivateRoute path="/customers" component={CustomersPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDom.render(<App/>, rootElement);
