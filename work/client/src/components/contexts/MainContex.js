const { default: ProjectContextProvider } = require('./Context');
const { default: OrderContextProvider } = require('./OrderContext');

const MainContextProvider = ({ children }) => {
  return (
    <ProjectContextProvider>
      <OrderContextProvider>{children}</OrderContextProvider>
    </ProjectContextProvider>
  );
};
export default MainContextProvider;
