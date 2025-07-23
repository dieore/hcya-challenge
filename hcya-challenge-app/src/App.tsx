import { useEffect } from 'react';
import { useAppSelector } from './store/hooks';
import MainLayout from './components/Layout/MainLayout';
import CustomSnackbar from './components/common/Snackbar';
import GlobalConfirmationModal from './components/common/GlobalConfirmationModal';

function App() {
  const dirtyState = useAppSelector((state) => state.dirty);
  const isDirty = Object.values(dirtyState).some(Boolean);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <>
      <MainLayout />
      <CustomSnackbar />
      <GlobalConfirmationModal />
    </>
  );
}



export default App;
