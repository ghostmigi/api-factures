import React, {useState, useEffect} from 'react';
import Field from "../components/forms/field";
import {Link} from "react-router-dom";
import axios from "axios";
import customersAPI from "../services/customersAPI";

const CustomerPage = ({match, history}) => {
    const { id = "new" } = match.params;

    // Recuperation de customer en fonction de l'identifiant
    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [error, setError] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    const fetchCustomer = async id => {
        try {
            const { firstName, lastName, email, company } = await customersAPI.find(id);
            setCustomer({ firstName, lastName, email, company });
        } catch (error) {
            // TODO : Notification flash d'une erreur
        }
    };

    // Changement du costomer si besoin au changement du composant ou au changement de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Gestion des changement des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]:value});
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();
        
        try {
            if (editing){
                await customersAPI.update(id, customer);
                // TODO : Flash notification de succes
            } else {
                await customersAPI.create(customer);
                // TODO : Flash notification de succes
                history.replace("/customers");
            }
            setError({});
        } catch ({ response }) {
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setError(apiErrors);

                // TODO : Flash notification d'erreurs
            }
        }
    };

    return (
        <>
            {!editing && <h1>Creation d'un client</h1> || <h1>Modification de client</h1>}

            <form onSubmit={handleSubmit}>
                <Field name="lastName" label="Nome de famille :" placeholder="Nom de famille du client" value={customer.lastName} onChange={handleChange} error={error.lastName}/>
                <Field name="firstName" label="Prenom :" placeholder="Prenom du client" value={customer.firstName} onChange={handleChange} error={error.firstName}/>
                <Field name="email" label="Email :" placeholder="Adresse email du client" type="email" value={customer.email} onChange={handleChange} error={error.email}/>
                <Field name="company" label="Entreprise :" placeholder="Entreprise du client" value={customer.company} onChange={handleChange} error={error.company}/>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour a la liste</Link>
                </div>
            </form>
        </>
    );
};

export default CustomerPage;