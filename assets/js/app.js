/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

import React, {useState, useContext} from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
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
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

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
                    <Route path="/register" component={RegisterPage}/>
                    <PrivateRoute path="/invoices/:id" component={InvoicePage}/>
                    <PrivateRoute path="/invoices" component={InvoicesPage}/>
                    <PrivateRoute path="/customers/:id" component={CustomerPage}/>
                    <PrivateRoute path="/customers" component={CustomersPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT}/>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDom.render(<App/>, rootElement);
