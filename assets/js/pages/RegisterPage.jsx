import React, {useState} from 'react';
import Field from "../components/forms/field";
import {Link} from "react-router-dom";
import axios from "axios";
import userAPI from "../services/userAPI";
import {toast} from "react-toastify";

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Gestion des changement des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]:value});
    };

    // Gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault()

        const apiErrors = {};

        if (user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            toast.error("Des erreur dans votre formulaire !");
            return;
        }

        try {
            await userAPI.register(user);
            setErrors({});
            toast.success("Vous etes desormais inscrit, vous pouvez vous connectez !")
            history.replace('/login');
        } catch (error) {
            const {violations} = error.response.data;

            if (violations){
                violations.forEach(violation => {
                   apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            toast.error("Des erreur dans votre formulaire !");
        }
    };

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prenom :"
                    placeholder="Votre joli prenom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom de famille :"
                    placeholder="Votre nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Adresse email :"
                    placeholder="Votre adresse email"
                    type="email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field
                    name="password"
                    label="Mot de passe :"
                    type="password"
                    placeholder="Votre mot de passe ultra securise"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmation de mot de passe :"
                    type="password"
                    placeholder="Confirmez votre super mot de passe"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je m'inscris</button>
                    <Link to="/login" className="btn btn-link">
                        J'ai deja un compte
                    </Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;