import React, { useState } from 'react';
import type { Appointment } from '../types';
import { formatCurrency, formatPhone } from '../utils/formatters';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 sm:p-7">
      {/* Efeito de fundo */}
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-violet-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 px-4 py-2 shadow-md">
              <span className="font-bold text-lg text-white">
                {appointment.time}
              </span>
            </div>
            {appointment.isInsurance && (
              <span className="flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 shadow-md">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Seguro
              </span>
            )}
          </div>

          {appointment.clientName && (
            <p className="mb-3 text-lg font-semibold text-slate-100">{appointment.clientName}</p>
          )}

          {appointment.clientPhone && (
            <p className="mb-4 flex items-center gap-2 text-sm text-slate-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {formatPhone(appointment.clientPhone)}
            </p>
          )}

          {showDetails && (
            <div className="mt-5 space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              {appointment.carModel && (
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 w-5 h-5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Veículo</p>
                    <p className="text-sm font-medium text-slate-100">{appointment.carModel}</p>
                  </div>
                </div>
              )}
              {appointment.service && (
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 w-5 h-5 text-violet-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Serviço</p>
                    <p className="text-sm font-medium text-slate-100">{appointment.service}</p>
                  </div>
                </div>
              )}
              {appointment.value && (
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Valor</p>
                    <p className="text-sm font-bold text-emerald-300">{formatCurrency(appointment.value)}</p>
                  </div>
                </div>
              )}
              <div className="border-t border-white/10 pt-2">
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Agendado por: <span className="font-medium text-slate-200">{appointment.createdBy}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:ml-4 lg:grid-cols-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
          >
            {showDetails ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Ocultar
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Ver mais
              </span>
            )}
          </button>
          <button
            onClick={() => onEdit(appointment)}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-amber-300/40 bg-amber-500/20 px-4 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/30"
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Editar
            </span>
          </button>
          <button
            onClick={() => appointment.id && onDelete(appointment.id)}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-300/40 bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-100 transition hover:bg-red-500/30"
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Excluir
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
