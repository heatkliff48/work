import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showErrorMessage from '../../Utils/showErrorMessage';
import { setToken } from '../actions/jwtAction';
import { GET_ALL_CLIENTS, ALL_CLIENTS, NEW_CLIENTS, ADD_NEW_CLIENT, NEED_UPDATE_CLIENT, UPDATE_CLIENT,
  ONE_LEGAL_ADDRESS, NEW_LEGAL_ADDRESS, NEED_UPDATE_LEGAL_ADDRESS, UPDATE_LEGAL_ADDRESS,
  ADD_CLIENTS_LEGAL_ADDRESS, GET_CLIENTS_LEGAL_ADDRESS,
  GET_ALL_DELIVERY_ADDRESSES, ALL_DELIVERY_ADDRESSES,
  ADD_DELIVERY_ADDRESSES, NEW_DELIVERY_ADDRESSES,
  GET_ALL_CONTACT_INFO, ALL_CONTACT_INFO,
  ADD_CONTACT_INFO, NEW_CONTACT_INFO
 } from '../types/clientsTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

url.interceptors.request.use(
  async (config) => {
    const accessToken = window.localStorage.getItem('jwt');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    console.log('Interceptor: Final config', config);
    return config;
  },
  (error) => {
    console.log('Interceptor: Request error', error);
    return Promise.reject(error);
  }
);

const getAllClients = () => {
  return url
    .get('/clients')
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewClient = ({ client }) => {
  return url
    .post('/clients', { client })
    .then((res) => {
      console.log(res.data)
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateClient = ({ client }) => {
  return url
    .post(`/clients/update/${client.c_id}`, { client })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const getLegalAddress = (currentClientID) => {
  return url
    .get(`/clientsAddress/${currentClientID}`)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewLegalAddress = ({ legalAddress }) => {
  return url
    .post('/clientsAddress', { legalAddress })
    .then((res) => {
      console.log(res.data)
      return res.data;
    })
    .catch(showErrorMessage);
};

const updateLegalAddress = ({ legalAddress }) => {
  console.log('UPDATE SAGA START', legalAddress)
  return url
    .post(`/clientsAddress/update/${legalAddress.c_id}`, { legalAddress })
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

// delivery address
const getAllDeliveryAddresses = (currentClientID) => {
  return url
    .get(`/deliveryAddress/${currentClientID}`)
    .then((res) => {
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewDeliveryAddress = ({ deliveryAddress }) => {
  return url
    .post('/deliveryAddress', { deliveryAddress })
    .then((res) => {
      console.log(res.data)
      return res.data;
    })
    .catch(showErrorMessage);
};

// Contact Info
const getAllContactInfo = (currentClientID) => {
  console.log('SAGA START', currentClientID)
  return url
    .get(`/clientsContactInfo/${currentClientID}`)
    .then((res) => {
      console.log('GET CONTACT', res.data)
      return res.data;
    })
    .catch(showErrorMessage);
};

const addNewContactInfo = ({ contactInfo }) => {
  return url
    .post('/clientsContactInfo', { contactInfo })
    .then((res) => {
      console.log(res.data)
      return res.data;
    })
    .catch(showErrorMessage);
};

// workers

function* getAllClientsWatcher(action) {
  try {
    const { allClients, accessToken, accessTokenExpiration } = yield call(getAllClients);

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ALL_CLIENTS, payload: allClients });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_CLIENTS, payload: [] });
  }
}

function* addNewClientWatcher(action) {
  try {
    console.log(action.payload);
    const { client, accessToken, accessTokenExpiration } = yield call(
      addNewClient,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_CLIENTS, payload: client });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_CLIENTS, payload: [] });
  }
}

function* updateClientWorker(action) {
  try {
    const { client, accessToken, accessTokenExpiration } = yield call(
      updateClient,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_CLIENT, payload: client });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_CLIENT, payload: [] });
  }
}

function* getLegalAddressWorker(action) {
  try {
    const { legalAddress, accessToken, accessTokenExpiration } = yield call(
      getLegalAddress,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ONE_LEGAL_ADDRESS, payload: legalAddress });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: ONE_LEGAL_ADDRESS, payload: [] });
  }
}

function* addNewLegalAddressWorker(action) {
  try {
    console.log(action.payload);
    const { legalAddress, accessToken, accessTokenExpiration } = yield call(
      addNewLegalAddress,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_LEGAL_ADDRESS, payload: legalAddress });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_LEGAL_ADDRESS, payload: [] });
  }
}

function* updateLegalAddressWorker(action) {
  try {
    const { legalAddress, accessToken, accessTokenExpiration } = yield call(
      updateLegalAddress,
      action.payload
    );
    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: UPDATE_LEGAL_ADDRESS, payload: legalAddress });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: UPDATE_LEGAL_ADDRESS, payload: [] });
  }
}

function* getAllDeliveryAddressesWorker(action) {
  try {
    const { deliveryAddresses, accessToken, accessTokenExpiration } = yield call(
      getAllDeliveryAddresses,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: ALL_DELIVERY_ADDRESSES, payload: deliveryAddresses });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_DELIVERY_ADDRESSES, payload: [] });
  }
}

function* addNewDeliveryAddressWorker(action) {
  try {
    console.log(action.payload);
    const { deliveryAddress, accessToken, accessTokenExpiration } = yield call(
      addNewDeliveryAddress,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_DELIVERY_ADDRESSES, payload: deliveryAddress });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_DELIVERY_ADDRESSES, payload: [] });
  }
}

function* getAllContactInfoWorker(action) {
  console.log('SAGA WORKER', action.payload)
  try {
    const { contactInfo, accessToken, accessTokenExpiration } = yield call(
      getAllContactInfo,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    console.log('SAGA CONTACT', contactInfo)

    yield put({ type: ALL_CONTACT_INFO, payload: contactInfo });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: ALL_CONTACT_INFO, payload: [] });
  }
}

function* addNewContactInfoWorker(action) {
  try {
    console.log(action.payload);
    const { contactInfo, accessToken, accessTokenExpiration } = yield call(
      addNewContactInfo,
      action.payload
    );

    window.localStorage.setItem('jwt', accessToken);

    yield put({ type: NEW_CONTACT_INFO, payload: contactInfo });
    yield put(setToken(accessToken, accessTokenExpiration));
  } catch (err) {
    yield put({ type: NEW_CONTACT_INFO, payload: [] });
  }
}

// watchers

function* clientsWatcher() {
  yield takeLatest(GET_ALL_CLIENTS, getAllClientsWatcher);
  yield takeLatest(ADD_NEW_CLIENT, addNewClientWatcher);
  yield takeLatest(NEED_UPDATE_CLIENT, updateClientWorker);

  yield takeLatest(ADD_CLIENTS_LEGAL_ADDRESS, addNewLegalAddressWorker);
  yield takeLatest(GET_CLIENTS_LEGAL_ADDRESS, getLegalAddressWorker);
  yield takeLatest(NEED_UPDATE_LEGAL_ADDRESS, updateLegalAddressWorker);

  yield takeLatest(GET_ALL_DELIVERY_ADDRESSES, getAllDeliveryAddressesWorker);
  yield takeLatest(ADD_DELIVERY_ADDRESSES, addNewDeliveryAddressWorker);

  yield takeLatest(GET_ALL_CONTACT_INFO, getAllContactInfoWorker);
  yield takeLatest(ADD_CONTACT_INFO, addNewContactInfoWorker);
}

export default clientsWatcher;
