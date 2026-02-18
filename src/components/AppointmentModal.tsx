import React, { useState } from 'react';
import type { Appointment } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment?: Appointment;
  userName: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  appointment,
  userName,
}) => {
  const [formData, setFormData] = useState<Partial<Appointment>>(
    appointment || {
      clientName: '',
      clientPhone: '',
      carModel: '',
      service: '',
      value: undefined,
      isInsurance: false,
      date: '',
      time: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentData: Appointment = {
      ...formData,
      date: formData.date || '',
      time: formData.time || '',
      createdBy: userName,
      createdAt: new Date().toISOString(),
    };
    onSave(appointmentData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-slate-900 shadow-2xl">
        <div className="rounded-t-3xl bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 p-5 text-white sm:p-6">
          <h2 className="text-2xl font-bold">
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <p className="mt-1 text-sm text-blue-100">Preencha os campos abaixo e salve.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Data *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Horário *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Nome do Cliente
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Nome completo"
                className="input-modern"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Telefone
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="input-modern"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Carro
              </label>
              <input
                type="text"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                placeholder="Modelo do veículo"
                className="input-modern"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Serviço
              </label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="Ex: Troca de para-brisa"
                className="input-modern"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Valor
              </label>
              <input
                type="number"
                name="value"
                value={formData.value || ''}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input-modern"
              />
            </div>

            <div className="flex items-center gap-3 md:pt-8">
              <input
                type="checkbox"
                name="isInsurance"
                checked={formData.isInsurance}
                onChange={handleChange}
                className="h-5 w-5 rounded border-white/25 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
              />
              <label className="text-sm font-semibold text-slate-200">
                Seguro
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
