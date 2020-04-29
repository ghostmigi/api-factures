import React, {useState, useContext} from "react";
import axios from 'axios';
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/field";
import {toast} from "react-toastify";
// import CustomersAPI from "../services/customersAPI";

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
       username: "",
       password: ""
    });

    const [error, setError] = useState("");

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        // const value = currentTarget.value;
        // const name = currentTarget.name;
        setCredentials({ ...credentials, [name]: value });
    };

    // Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("Vous etes desormais connecte !");
            // Apres authentification rediriger vers page customers
            history.replace("/customers");
            // const data = await CustomersAPI.findAll();
            // console.log(data);
        } catch (error) {
            setError(
                "Aucun compte ne possede cette adresse ou alors les informations ne correspondant pas !"
            );
            toast.error("Une erreur est survenue");
        }
    };

    return (
        <>
            <h1>Connexion a l'application</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    label="Adresse email"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse email de connexion"
                    error={error}
                />

                <Field
                    name="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    error=""
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;