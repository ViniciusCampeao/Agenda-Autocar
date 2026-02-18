import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Appointment } from '../types';
import PageShell from '../components/PageShell';
import AppointmentModal from '../components/AppointmentModal';
import AppointmentCard from '../components/AppointmentCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Agenda: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const loadAppointments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      const loadedAppointments: Appointment[] = [];
      querySnapshot.forEach((docSnap) => {
        loadedAppointments.push({ id: docSnap.id, ...docSnap.data() } as Appointment);
      });
      
      loadedAppointments.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
      
      setAppointments(loadedAppointments);
    } catch {
      setLoading(false);
    }
  };

  const filterAppointmentsByDate = () => {
    const filtered = appointments.filter((apt) => apt.date === selectedDate);
    filtered.sort((a, b) => a.time.localeCompare(b.time));

    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointmentsByDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, appointments]);

  const handleSaveAppointment = async (appointment: Appointment) => {
    try {
      if (editingAppointment?.id) {
        const docRef = doc(db, 'appointments', editingAppointment.id);
        await updateDoc(docRef, { ...appointment });
      } else {
        await addDoc(collection(db, 'appointments'), appointment);
      }
      await loadAppointments();
      setIsModalOpen(false);
      setEditingAppointment(undefined);
    } catch {
      alert('Erro ao salvar agendamento.');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Deseja excluir?')) {
      await deleteDoc(doc(db, 'appointments', id));
      await loadAppointments();
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleNewAppointment = () => {
    setEditingAppointment(undefined);
    setIsModalOpen(true);
  };

  return (
    <PageShell
      title="Agenda"
      subtitle="Selecione uma data, registre um novo agendamento ou clique em um existente para editar ou excluir."
    >
        <div className="surface-card mb-8 p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="surface-title mb-2 text-2xl font-bold sm:text-3xl">Agenda do Dia</h2>
              <p className="flex items-center gap-2 text-sm text-slate-300 sm:text-base">
                <svg className="h-5 w-5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {format(new Date(selectedDate + 'T00:00:00'), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[minmax(180px,240px)_1fr] xl:w-auto">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-modern"
              />
              <button
                onClick={handleNewAppointment}
                className="btn-primary w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Novo Agendamento
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="surface-card py-20 text-center">
            <div className="relative inline-block">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-transparent border-l-violet-400 border-t-cyan-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-pulse rounded-full bg-linear-to-br from-cyan-400 to-violet-500"></div>
              </div>
            </div>
            <p className="mt-6 font-medium text-slate-300">Carregando agendamentos...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="surface-card p-10 text-center sm:p-14">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-cyan-500/20 to-violet-500/20 sm:h-32 sm:w-32">
              <svg className="h-14 w-14 text-cyan-300 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-slate-100">Nenhum agendamento</h3>
            <p className="mb-6 text-slate-300">Não há agendamentos para este dia</p>
            <button
              onClick={handleNewAppointment}
              className="btn-primary"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Criar Novo Agendamento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onEdit={handleEditAppointment} onDelete={handleDeleteAppointment} />
            ))}
          </div>
        )}
        <AppointmentModal key={editingAppointment?.id || 'new'} isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setEditingAppointment(undefined);}} onSave={handleSaveAppointment} appointment={editingAppointment} userName={currentUser?.name || ''} />
    </PageShell>
  );
};

export default Agenda;
