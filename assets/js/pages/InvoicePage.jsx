import React, {useState, useEffect} from 'react';
import Field from "../components/forms/field";
import Select from "../components/forms/Select";
import {Link} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import axios from "axios";
import invoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({history, match}) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    // Recuperation des clients
    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);

            if (!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            history.replace("/invoices");
            // TODO : Flash notification erreur
        }
    };

    // Recuperation d'un facture
    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await invoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
        } catch (error) {
            // TODO : Flash notification erreur
            history.replace('/invoices');
        }
    };

    // Recuperation de la list des clients a chaque chargement du composant
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Recuperation de la bonne facture quand l'identifiant de l'URL change
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    // Gestion des changement des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]:value});
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if (editing){
                await invoicesAPI.update(id, invoice);
                // TODO : Flash notification success
            } else {
                await invoicesAPI.create(invoice);
                // TODO : Flash notification success
                history.replace("/invoices");
            }

        } catch ({ response }) {
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);

                // TODO : Flash notification d'erreurs
            }
        }
    };

    return (
        <>
            {editing && <h1>Modification d'une facture</h1> || <h1>Creation d'une facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="client"
                    value={invoice.customer}
                    error={errors.customer}
                    onchange={handleChange}
                >
                    {customers.map(customer => (
                        <option
                            key={customer.id}
                            value={customer.id}
                        >
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}
                </Select>

                <Select
                    name="status"
                    label="Status"
                    value={invoice.status}
                    error={errors.status}
                    onchange={handleChange}
                >
                    <option value="SENT">Envoyee</option>
                    <option value="PAID">Payee</option>
                    <option value="CANCELLED">Annulee</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/invoices" className="btn btn-link">
                        Retour aux factures
                    </Link>
                </div>
            </form>
        </>
    );
};

export default InvoicePage;