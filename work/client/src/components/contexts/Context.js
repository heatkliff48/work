import { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

const ProjectContextProvider = ({ children }) => {
  const [promProduct, setPromProduct] = useState({});
  const [version, setVersion] = useState(1);
  const [modal, setModal] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalAddClient, setModalAddClient] = useState(false);
  const [currentClientID, setClientID] = useState(1);

  return (
    <ProjectContext.Provider
      value={{
        promProduct,
        setPromProduct,
        version,
        modal,
        setModal,
        modalUpdate,
        setModalUpdate,
        currentClientID,
        setClientID,
        modalAddClient,
        setModalAddClient,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;

const useProjectContext = () => useContext(ProjectContext);
export { useProjectContext };
