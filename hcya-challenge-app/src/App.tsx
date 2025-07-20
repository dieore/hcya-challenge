import { Provider } from 'react-redux';
import { store } from './store/store';
import MainLayout from './components/Layout/MainLayout';
import CustomSnackbar from './components/common/Snackbar';

function App() {
  return (
    <Provider store={store}>
      <MainLayout />
      <CustomSnackbar />
    </Provider>
  );
}

export default App;
