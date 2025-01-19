'use client'

import { usePatients } from '@/hooks/usePatients'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { 
  UserPlusIcon, 
  PencilIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline'

export default function PacientesPage() {
  const { patients, loading } = usePatients()

  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
        <Link
          href="/pacientes/novo"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <UserPlusIcon className="h-5 w-5" />
          Novo Paciente
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <Card key={patient.id}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <UserCircleIcon className="h-12 w-12 text-gray-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{patient.nome}</h2>
                    <p className="text-sm text-gray-500">
                      {calculateAge(patient.dataNascimento)} anos
                    </p>
                  </div>
                </div>
                <Link
                  href={`/pacientes/${patient.id}/editar`}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Data de Nascimento:</span>{' '}
                  {new Date(patient.dataNascimento).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Contato:</span>{' '}
                  {patient.telefone}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`${
                    patient.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <Link
                  href={`/processos/${patient.id}/anamnese`}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Ver Anamnese
                </Link>
                <Link
                  href={`/processos/${patient.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Ver Processos
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}