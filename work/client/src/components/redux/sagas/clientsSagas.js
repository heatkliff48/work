import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import showMessage from '../../Utils/showMessage';
import { errorToText } from '../../Utils/errorToText';
import {
  GET_ALL_CLIENTS,
  ALL_CLIENTS,
  NEW_CLIENTS,
  ADD_NEW_CLIENT,
  NEED_UPDATE_CLIENT,
  UPDATE_CLIENT,
  ONE_LEGAL_ADDRESS,
  NEED_UPDATE_LEGAL_ADDRESS,
  ADD_CLIENTS_LEGAL_ADDRESS,
  GET_CLIENTS_LEGAL_ADDRESS,
  GET_ALL_DELIVERY_ADDRESSES,
  ALL_DELIVERY_ADDRESSES,
  ADD_DELIVERY_ADDRESSES,
  NEW_DELIVERY_ADDRESSES,
  GET_ALL_CONTACT_INFO,
  ALL_CONTACT_INFO,
  ADD_CONTACT_INFO,
  NEW_CONTACT_INFO,
} from '../types/clientsTypes';

const url = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

const getAllClients = () => {
  return url
    .get('/clients')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewClient = ({ client }) => {
  return url
    .post('/clients', { client })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateClient = ({ client }) => {
  return url
    .post(`/clients/update/${client.c_id}`, { client })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const getLegalAddress = (currentClientID) => {
  return url
    .get(`/clientsAddress/${currentClientID}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewLegalAddress = ({ legalAddress }) => {
  return url
    .post('/clientsAddress', { legalAddress })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const updateLegalAddress = ({ legalAddress }) => {
  return url
    .post(`/clientsAddress/update/${legalAddress.c_id}`, { legalAddress })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// delivery address
const getAllDeliveryAddresses = () => {
  return url
    .get(`/deliveryAddress`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewDeliveryAddress = ({ deliveryAddress }) => {
  return url
    .post('/deliveryAddress', { deliveryAddress })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

// Contact Info
const getAllContactInfo = () => {
  return url
    .get(`/clientsContactInfo`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

const addNewContactInfo = ({ contactInfo }) => {
  return url
    .post('/clientsContactInfo', { contactInfo })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      showMessage(errorToText(err), 'error');
      throw err;
    });
};

function* getAllClientsWatcher(action) {
  try {
    const { allClients } = yield call(getAllClients);

    yield put({ type: ALL_CLIENTS, payload: allClients });
  } catch (err) {
    yield put({ type: ALL_CLIENTS, payload: [] });
  }
}

function* addNewClientWatcher(action) {
  try {
    const { client } = yield call(addNewClient, action.payload);

    yield put({ type: NEW_CLIENTS, payload: client });
  } catch (err) {
    yield put({ type: NEW_CLIENTS, payload: [] });
  }
}

function* updateClientWorker(action) {
  try {
    const { client } = yield call(updateClient, action.payload);

    yield put({ type: UPDATE_CLIENT, payload: client });
  } catch (err) {
    yield put({ type: UPDATE_CLIENT, payload: [] });
  }
}

function* getLegalAddressWorker(action) {
  try {
    const { legalAddress } = yield call(getLegalAddress, action.payload);

    yield put({ type: ONE_LEGAL_ADDRESS, payload: legalAddress });
  } catch (err) {
    yield put({ type: ONE_LEGAL_ADDRESS, payload: [] });
  }
}

function* addNewLegalAddressWorker(action) {
  try {
    const { legalAddress } = yield call(addNewLegalAddress, action.payload);

    yield put({ type: ONE_LEGAL_ADDRESS, payload: legalAddress });
  } catch (err) {
    yield put({ type: ONE_LEGAL_ADDRESS, payload: [] });
  }
}

function* updateLegalAddressWorker(action) {
  try {
    const { legalAddress } = yield call(updateLegalAddress, action.payload);

    yield put({ type: ONE_LEGAL_ADDRESS, payload: legalAddress });
  } catch (err) {
    yield put({ type: ONE_LEGAL_ADDRESS, payload: [] });
  }
}

function* getAllDeliveryAddressesWorker(action) {
  try {
    const { deliveryAddresses } = yield call(getAllDeliveryAddresses);

    yield put({ type: ALL_DELIVERY_ADDRESSES, payload: deliveryAddresses });
  } catch (err) {
    yield put({ type: ALL_DELIVERY_ADDRESSES, payload: [] });
  }
}

function* addNewDeliveryAddressWorker(action) {
  try {
    const { deliveryAddress } = yield call(addNewDeliveryAddress, action.payload);

    yield put({ type: NEW_DELIVERY_ADDRESSES, payload: deliveryAddress });
  } catch (err) {
    yield put({ type: NEW_DELIVERY_ADDRESSES, payload: [] });
  }
}

function* getAllContactInfoWorker(action) {
  try {
    const { contactInfo } = yield call(getAllContactInfo);

    yield put({ type: ALL_CONTACT_INFO, payload: contactInfo });
  } catch (err) {
    yield put({ type: ALL_CONTACT_INFO, payload: [] });
  }
}

function* addNewContactInfoWorker(action) {
  try {
    const { contactInfo } = yield call(addNewContactInfo, action.payload);

    yield put({ type: NEW_CONTACT_INFO, payload: contactInfo });
  } catch (err) {
    yield put({ type: NEW_CONTACT_INFO, payload: [] });
  }
}

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
