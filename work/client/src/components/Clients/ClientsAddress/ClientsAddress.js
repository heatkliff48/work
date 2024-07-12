import React, { Fragment, useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getLegalAddress } from '#components/redux/actions/clientAction';
import { ClientContext } from '#components/Clients/ClientsInfo/ClientsInfo';

const ClientsAddress = () => {
    const [entries, setEntries] = useState([]);
    const [c_id, setCID] = useState("1");
    const [currentClient, setCurrentClient] = useContext(ClientContext);

    const dispatch = useDispatch();
    const legalAddress = useSelector((state) => state.legalAddress);

    // const getAddress = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/clientsAddress/${currentClientID}`);
    //         const jsonData = await response.json();
            
    //         setEntries(jsonData);
    //     } catch (err) {
    //         console.error(err.message);
    //     }
    // }

    useEffect(() => {
        dispatch(getLegalAddress(currentClient.id));
    }, [currentClient.id]);
    
    return (
    <Fragment>
        {" "}
        <h3 className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            Legal Address
        </h3>
                <p>id:{legalAddress?.id}</p>
                <p>street: {legalAddress?.street}</p>
                <p>additional_info: {legalAddress?.additional_info}</p>
                <p>city: {legalAddress?.city}</p>
                <p>zip_code: {legalAddress?.zip_code}</p>
                <p>province: {legalAddress?.province}</p>
                <p>country: {legalAddress?.country}</p>
                <p>phone_number: {legalAddress?.phone_number}</p>
                <p>email: {legalAddress?.email}</p>
    </Fragment>
    );

    /*
    {entries.map(entrie => (
                    <tr>
                        <td>{entrie.c_id}</td>
                        <td>{entrie.street}</td>
                        <td>{entrie.additional_info}</td>
                        <td>{entrie.city}</td>
                        <td>{entrie.zip_code}</td>
                        <td>{entrie.province}</td>
                        <td>{entrie.country}</td>
                        <td>{entrie.phone_number}</td>
                        <td>{entrie.email}</td>
                    </tr>
                ))}
    */
};

export default ClientsAddress;

/*
<table className="table mt-5 table-bordered text-center table-striped table-hover"
        align="left">
            <thead>
            <tr>
                <th>c_id</th>
                <th>street</th>
                <th>additional_info</th>
                <th>city</th>
                <th>zip_code</th>
                <th>province</th>
                <th>country</th>
                <th>phone_number</th>
                <th>email</th>
            </tr>
            </thead>
            <tbody>
                {}
                {
                    <tr>
                        <td>{entries.c_id}</td>
                        <td>{entries.street}</td>
                        <td>{entries.additional_info}</td>
                        <td>{entries.city}</td>
                        <td>{entries.zip_code}</td>
                        <td>{entries.province}</td>
                        <td>{entries.country}</td>
                        <td>{entries.phone_number}</td>
                        <td>{entries.email}</td>
                    </tr>
                }
            </tbody>
        </table>
*/