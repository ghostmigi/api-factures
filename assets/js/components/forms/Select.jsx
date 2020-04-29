import React from "react";

const Select = ({name, value, error="", label, onchange, children}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                onChange={onchange}
                name={name}
                id={name}
                value={value}
                className={"form-control" + (error && " is-invalid")}
            >
                {children}
            </select>
            <p className="invalid-feedback">{error}</p>
        </div>
    );
};

export default Select;