import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewDeliveryAddress } from '#components/redux/actions/clientAction';
import { useProjectContext } from '#components/contexts/Context.js';

function DeliveryAddressModal(props) {
  const [street, setStreet] = useState("")
  const [additional_info, setAddInfo] = useState("")
  const [city, setCity] = useState("")
  const [zip_code, setZIP] = useState("")
  const [province, setProvince] = useState("")
  const [country, setCountry] = useState("")
  const [phone_number, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const { currentClient } = useProjectContext();

  const dispatch = useDispatch();

  const onSubmitForm = async(e) => {
      e.preventDefault();
      try {
        const currentClientID = currentClient.id;
          const deliveryAddress = {
            currentClientID,
            street, 
            additional_info, 
            city,
            zip_code,
            province,
            country,
            phone_number,
            email
          };
          dispatch(addNewDeliveryAddress({deliveryAddress}))
          props.onHide();
          setStreet("")
          setAddInfo("")
          setCity("")
          setZIP("")
          setProvince("")
          setCountry("")
          setPhone("")
          setEmail("")
      } catch (err) {
          console.error(err.message);
      }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Delivery Address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form 
        id ="addProductModal" 
        className="w-full max-w-sm" 
        onSubmit={onSubmitForm}
        >
          
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
      </Modal.Body>
      <Modal.Footer>
        <button form='addProductModal'>Add Delivery Address</button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ShowDeliveryAddressModal() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" 
        onClick={() => setModalShow(true)}>
        Add Delivery Address
      </Button>

      <DeliveryAddressModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default ShowDeliveryAddressModal;
