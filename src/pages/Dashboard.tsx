import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Appointment, DashboardStats } from '../types';
import PageShell from '../components/PageShell';
import { formatCurrency } from '../utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentModal from '../components/AppointmentModal';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    todayRevenue: 0,
    totalAppointments: 0,
    insurancePercentage: 0,
  });
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [dateStats, setDateStats] = useState<DashboardStats | null>(null);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [filteredByInsurance, setFilteredByInsurance] = useState<Appointment[]>([]);
  const [selectedInsuranceFilter, setSelectedInsuranceFilter] = useState<'all' | 'insurance' | 'particular'>('all');
  const [useFilterByDate, setUseFilterByDate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadDateStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const loadDashboardStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      
      let totalAppointments = 0;
      let totalRevenue = 0;
      let insuranceCount = 0;
      const allAppts: Appointment[] = [];

      querySnapshot.forEach((doc) => {
        const appointment = doc.data() as Appointment;
        appointment.id = doc.id;
        allAppts.push(appointment);
        totalAppointments++;
        totalRevenue += Number(appointment.value) || 0;

        if (appointment.isInsurance) {
          insuranceCount++;
        }
      });

      const insurancePercentage = totalAppointments > 0 
        ? (insuranceCount / totalAppointments) * 100 
        : 0;

      setAllAppointments(allAppts);
      setStats({
        todayAppointments: totalAppointments,
        todayRevenue: totalRevenue,
        totalAppointments: totalAppointments,
        insurancePercentage,
      });
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    const confirmDelete = window.confirm(
      '⚠️ Tem certeza que deseja excluir este agendamento?\n\nEsta ação não pode ser desfeita.'
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'appointments', id));
      alert('✅ Agendamento excluído com sucesso!');
      await loadDashboardStats();
      if (useFilterByDate) {
        await loadDateStats();
      }
    } catch {
      alert('❌ Erro ao excluir agendamento.');
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (appointment: Appointment) => {
    try {
      if (editingAppointment?.id) {
        const docRef = doc(db, 'appointments', editingAppointment.id);
        await updateDoc(docRef, { ...appointment });
        alert('✅ Agendamento atualizado com sucesso!');
      }
      await loadDashboardStats();
      if (useFilterByDate) {
        await loadDateStats();
      }
      setIsModalOpen(false);
      setEditingAppointment(undefined);
    } catch {
      alert('❌ Erro ao salvar agendamento.');
    }
  };

  const loadDateStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      
      let dateAppointments = 0;
      let dateRevenue = 0;
      let dateInsuranceCount = 0;

      querySnapshot.forEach((doc) => {
        const appointment = doc.data() as Appointment;

        if (appointment.date === selectedDate) {
          dateAppointments++;
          dateRevenue += Number(appointment.value) || 0;
          if (appointment.isInsurance) {
            dateInsuranceCount++;
          }
        }
      });

      const insurancePercentage = dateAppointments > 0 
        ? (dateInsuranceCount / dateAppointments) * 100 
        : 0;

      setDateStats({
        todayAppointments: dateAppointments,
        todayRevenue: dateRevenue,
        totalAppointments: dateAppointments,
        insurancePercentage,
      });
    } catch {
      return;
    }
  };

  const getDisplayedAppointments = () => {
    if (useFilterByDate) {
      return allAppointments.filter(apt => apt.date === selectedDate);
    }
    return allAppointments;
  };

  const pieData = [
    { name: 'Seguro', value: stats.insurancePercentage },
    { name: 'Particular', value: 100 - stats.insurancePercentage },
  ];

  const COLORS = ['#10b981', '#3b82f6'];

  const handlePieClick = (data: typeof pieData[0]) => {
    if (data.name === 'Seguro') {
      setSelectedInsuranceFilter('insurance');
      const filtered = allAppointments.filter(apt => apt.isInsurance);
      setFilteredByInsurance(filtered);
    } else {
      setSelectedInsuranceFilter('particular');
      const filtered = allAppointments.filter(apt => !apt.isInsurance);
      setFilteredByInsurance(filtered);
    }
  };

  if (loading) {
    return (
      <PageShell title="Dashboard" subtitle="Visão estratégica da operação em tempo real.">
        <div className="surface-card flex h-72 items-center justify-center sm:h-80">
          <div className="relative">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-transparent border-l-violet-400 border-t-cyan-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 animate-pulse rounded-full bg-linear-to-br from-cyan-400 to-violet-500"></div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Dashboard" subtitle="Visão geral do negócio com indicadores de produtividade e receita.">

        {/* Estatísticas Totais */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-2">
          <div className="surface-card group p-5 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-slate-300">Agendamentos Totais</p>
                <p className="surface-title text-3xl font-bold sm:text-4xl">{stats.totalAppointments}</p>
              </div>
              <div className="rounded-2xl bg-linear-to-br from-cyan-500 to-blue-500 p-4 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="surface-card group p-5 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-slate-300">Receita total estimada (com base nos agendamentos)</p>
                <p className="bg-linear-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">{formatCurrency(stats.todayRevenue)}</p>
              </div>
              <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 p-4 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Pizza */}
        <div className="surface-card mb-8 p-5 sm:p-6 lg:p-8">
          <h2 className="surface-title mb-6 text-2xl font-bold">Distribuição de Atendimentos</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={102}
                fill="#8884d8"
                dataKey="value"
                onClick={(e) => handlePieClick(e.payload as typeof pieData[0])}
                style={{ cursor: 'pointer' }}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(148,163,184,0.35)', background: 'rgba(15,23,42,0.88)', color: '#f8fafc' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-sm text-slate-400">Clique em um segmento para filtrar os atendimentos</p>
        </div>

        {/* Lista de Atendimentos Filtrados */}
        {selectedInsuranceFilter !== 'all' && filteredByInsurance.length > 0 && (
          <div className="surface-card mb-8 p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="surface-title text-2xl font-bold">
                  {selectedInsuranceFilter === 'insurance' ? 'Atendimentos com Seguro' : 'Atendimentos Particulares'}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{filteredByInsurance.length} atendimento(s)</p>
              </div>
              <button
                onClick={() => setSelectedInsuranceFilter('all')}
                className="rounded-lg border border-slate-400/30 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700/30 hover:text-slate-100"
              >
                Limpar Filtro
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {filteredByInsurance.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Consulta por Data e Listagem de Agendamentos */}
        <div className="surface-card p-5 sm:p-6 lg:p-8">
          <h2 className="surface-title mb-6 text-2xl font-bold">Todos os Agendamentos</h2>
          
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={useFilterByDate}
                  onChange={(e) => setUseFilterByDate(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-400 bg-slate-700 accent-cyan-500"
                />
                <span className="text-sm font-medium text-slate-200">Filtrar por data específica</span>
              </label>
            </div>
            
            {useFilterByDate && (
              <div className="max-w-xs">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-modern"
                />
              </div>
            )}
          </div>

          {useFilterByDate && dateStats && (
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-5">
                <p className="text-sm font-medium text-slate-200">Agendamentos</p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">{dateStats.todayAppointments}</p>
              </div>

              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-5">
                <p className="text-sm font-medium text-slate-200">Receita</p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">{formatCurrency(dateStats.todayRevenue)}</p>
              </div>

              <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-5">
                <p className="text-sm font-medium text-slate-200">Seguro vs Particular</p>
                <p className="mt-2 text-3xl font-bold text-rose-300">{dateStats.insurancePercentage.toFixed(1)}% Seguro</p>
              </div>
            </div>
          )}

          {getDisplayedAppointments().length > 0 ? (
            <div>
              <p className="mb-4 text-sm text-slate-400">
                Total: <span className="font-semibold text-slate-200">{getDisplayedAppointments().length}</span> agendamento(s)
                {useFilterByDate && (
                  <span> em {format(new Date(selectedDate + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                )}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {getDisplayedAppointments().map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEditAppointment}
                    onDelete={handleDeleteAppointment}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-700/50 p-10 text-center">
              <svg className="mx-auto mb-4 h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-400">Nenhum agendamento encontrado</p>
            </div>
          )}
        </div>

        <AppointmentModal
          key={editingAppointment?.id || 'new'}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAppointment(undefined);
          }}
          onSave={handleSaveAppointment}
          appointment={editingAppointment}
          userName={currentUser?.name || ''}
        />
    </PageShell>
  );
};

export default Dashboard;
