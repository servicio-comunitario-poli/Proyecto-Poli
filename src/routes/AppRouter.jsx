import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from '../Components/Navbar';

import Landing from '../Pages/Landing';
import PreRegistro from '../Pages/PreRegistro';
import InscripcionFinal from '../Pages/inscripcionFinal';
import PortalRegulares from '../Pages/PortalRegulares';
import Login from '../Pages/Login';
import AdminPanel from '../Pages/AdminPanel';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/pre-registro" element={<PreRegistro />} />
                        <Route path="/inscripcion" element={<InscripcionFinal />} />
                        <Route path="/regulares" element={<PortalRegulares />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default AppRouter;