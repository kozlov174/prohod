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
import { VisitRequest } from '@/Components/Pages/VisitRequest';

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
  const isPrivate = import.meta.env.VITE_ENABLE_PRIVATE;
  return (
    <QueryClientProvider client={queryClient}>
      <PermissionContext.Provider value={{ isPublic: !isPrivate }}>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Main isPublic={isPrivate !== '1'} />} />
            <Route path="/login" element={<Login isPublic={isPrivate !== '1'} />} />
            <Route path="/enter" element={<Enter />} />
            <Route path="*" element={<PrivateWrapper isPublic={isPrivate !== '1'} />} />
          </Routes>
        </BrowserRouter>
      </PermissionContext.Provider>
    </QueryClientProvider>
  );
}

function PrivateWrapper({ isPublic }: { isPublic: boolean }) {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = getTokenFromCookie('access');
    const tokenData = parseJwt(accessToken);
    if (!accessToken || !tokenData) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  return (
    <div className={'container'}>
      <Header isPublic={isPublic} />
      <main className={'main'}>
        <Routes>
          <Route path="/visits" element={<Visits isPublic={isPublic} />} />
          <Route path="/visits/:id" element={<VisitRequest isPublic={isPublic} />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
}

export const App = AppComponent;
