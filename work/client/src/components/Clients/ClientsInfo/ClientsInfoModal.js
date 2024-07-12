import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {Fragment, useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import { addNewClient, addNewLegalAddress } from '#components/redux/actions/clientAction';
import './styles.css';

function ClientsModal(props) {
  const [c_name, setName] = useState("")
  const [tin, setTIN] = useState("")
  const [category, setCategory] = useState("")
  const [street, setStreet] = useState("")
  const [additional_info, setAddInfo] = useState("")
  const [city, setCity] = useState("")
  const [zip_code, setZIP] = useState("")
  const [province, setProvince] = useState("")
  const [country, setCountry] = useState("")
  const [phone_number, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [lastID, setLastID] = useState("");
  const nextID = 0;

  const dispatch = useDispatch();
  // const client = useSelector((state) => state.client);

  // const getLastID = async () => {
  //   try {
  //       const response = await fetch("http://localhost:5000/clients/id");
  //       const jsonData = await response.json();
        
  //       setLastID(jsonData);
  //       //nextID = lastID.id + 1
  //   } catch (err) {
  //       console.error(err.message);
  //   }
  // }

  // useEffect(() => {
  //   getLastID();
  // }, [setName]);

  const onSubmitForm = async(e) => {
    e.preventDefault();
    const client = {
      c_name,
      tin,
      category
    }
    console.log('before dispatch')
    dispatch(addNewClient({client}));
    const legalAddress = {
      street, 
      additional_info, 
      city,
      zip_code,
      province,
      country,
      phone_number,
      email            
    }
    console.log('before dispatch legal', legalAddress)
    dispatch(addNewLegalAddress({legalAddress}));
  }

  // const onSubmitForm = async(e) => {
  //     e.preventDefault();
  //     try {
  //         const body = {
  //           c_name, 
  //           tin, 
  //           category
  //         };
  //         const response = await fetch("http://localhost:5000/clients", {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify(body)
  //         });
          
  //         const addressBody = {
  //           //id: lastID.id + 1,
  //           street, 
  //           additional_info, 
  //           city,
  //           zip_code,
  //           province,
  //           country,
  //           phone_number,
  //           email
  //         };
  //         if (response) {
  //           const adressResponse = await fetch("http://localhost:5000/clientsAddress", {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify(addressBody)
  //         });
  //         }
  //         window.location = "/";
  //     } catch (err) {
  //         console.error(err.message);
  //     }
  // }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="modal-auto-size"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Client
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Container>
        
        <form 
        id ="addProductModal" 
        className="w-full max-w-sm" 
        onSubmit={e => {onSubmitForm(e);} }
        >
          <h3>Client's info</h3>
          <Row>
          <Col>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="version">
                Client's Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="c_name" 
                type="text" 
                value={c_name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
          </div>
          </Col>
          <Col>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="version">
                TIN
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="tin" 
                type="text" 
                value={tin} 
                onChange={e => setTIN(e.target.value)} 
              />
            </div>
          </div>
          </Col>
          <Col>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="discription">
                Category
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="category" 
                type="text" 
                value={category}
                onChange={e => setCategory(e.target.value)}  
              />
            </div>
          </div>
          </Col>
          </Row>


          <h3>Client's legal address</h3>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="version">
                Street
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="street" 
                type="text" 
                value={street} 
                onChange={e => setStreet(e.target.value)} 
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="version">
                Additional info
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="additional_info" 
                type="text" 
                value={additional_info} 
                onChange={e => setAddInfo(e.target.value)} 
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="discription">
                City
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="city" 
                type="text" 
                value={city}
                onChange={e => setCity(e.target.value)}  
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="discription">
                ZIP code
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="zip_code" 
                type="text" 
                value={zip_code}
                onChange={e => setZIP(e.target.value)}  
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="discription">
                Province
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="province" 
                type="text" 
                value={province}
                onChange={e => setProvince(e.target.value)}  
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="discription">
                Country
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="country" 
                type="text" 
                value={country}
                onChange={e => setCountry(e.target.value)}  
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="discription">
                Phone number
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="phone_number" 
                type="text" 
                value={phone_number}
                onChange={e => setPhone(e.target.value)}  
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="discription">
                email
              </label>
            </div>
            <div className="md:w-2/3">
              <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                id="email" 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}  
              />
            </div>
          </div>
          
        </form>

        </Container>
      </Modal.Body>
      <Modal.Footer>
        <button form='addProductModal'>Add Client</button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowClientsModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" 
        onClick={() => {setModalShow(true);}}>
        Add Client
      </Button>

      <ClientsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default ShowClientsModal;

/*
        </form>

        <form 
        id ="addProductModal" 
        className="w-full max-w-sm" 
        onSubmit={onSubmitAddress}
        >
*/