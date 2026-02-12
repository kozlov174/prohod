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
import { Main } from '@/Components/Pages/Main';
import { Visits } from '@/Components/Pages/Visits';
import { Enter } from '@/Components/Pages/Enter';
import { Users } from '@/Components/Pages/Users';

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
          <Route path="/" element={<Main isPublic />} />
          <Route path="/login" element={<Login isPublic />} />
          <Route path="/enter" element={<Enter />} />
          <Route path="/admin" element={<Main />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="*" element={<PrivateWrapper />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function PrivateWrapper() {
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
          <Routes>
            <Route path="/visits" element={<Visits isPublic />} />
            <Route path="/admin/visits" element={<Visits />} />
            <Route path="/admin/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </PermissionContext.Provider>
  );
}

export const App = AppComponent;
