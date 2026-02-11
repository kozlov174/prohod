import { ToastContainer } from 'react-toastify';
import './Styles.scss';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../Styles/index.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { Login } from '@/Components/Pages/Login';
import { Header } from '@/Components/UI/Header';
import { PermissionContext } from '@/Contexts/permission';
import { AxiosError, isAxiosError } from 'axios';
import { useEffect } from 'react';
import { getTokenFromCookie, parseJwt } from '@/Utils/token';

function AppComponent() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: Error | AxiosError) => {
          if (isAxiosError(error) && error.response?.status === 401) {
            return false;
          }
          return failureCount < 3;
        },
        placeholderData: (prev: unknown) => prev,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<OutletWrapper />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function OutletWrapper() {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = getTokenFromCookie('access');
    const tokenData = parseJwt(accessToken);
    if (!accessToken || !tokenData) {
      navigate('/login');
      return;
    }
  }, []);
  return (
    <PermissionContext.Provider value={{ user: null }}>
      <div className={'container'}>
        <Header />
        <main className={'main'}>
          <div className={'main__content'}>
            <Routes></Routes>
          </div>
        </main>
      </div>
    </PermissionContext.Provider>
  );
}

export const App = AppComponent;
