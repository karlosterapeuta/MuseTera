'use client'

import { usePatients } from '@/hooks/usePatients'
import { Patient } from '@/types'

interface PatientSelectProps {
  onSelect: (patient: Patient | null) => void
  selectedId?: string
  disabled?: boolean
  className?: string
}

export function PatientSelect({ onSelect, selectedId, disabled, className = '' }: PatientSelectProps) {
  const { patients, loading } = usePatients()

  if (loading) {
    return (
      <div className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm text-center">
        Carregando pacientes...
      </div>
    )
  }

  return (
    <div className="w-full space-y-1">
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        Selecione o Paciente
      </label>
      <select
        value={selectedId || ''}
        onChange={(e) => {
          const selectedValue = e.target.value
          const patient = selectedValue ? patients.find(p => p.id === selectedValue) : null
          if (typeof onSelect === 'function') {
            onSelect(patient)
          }
        }}
        disabled={disabled}
        className={`
          block w-full rounded-lg border-gray-300 
          py-2 sm:py-2.5 
          pl-3 pr-10 
          text-sm text-gray-900 
          focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 
          ${className}
        `}
      >
        <option value="">Selecione um paciente</option>
        {patients.map((patient) => (
          <option 
            key={patient.id} 
            value={patient.id}
            className="text-xs sm:text-sm"
          >
            {patient.nome}
          </option>
        ))}
      </select>
    </div>
  )
}