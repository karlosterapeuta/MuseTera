'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { PatientSelect } from '@/components/processos/PatientSelect'
import { Patient } from '@/types'
import { Logo } from '@/components/Logo'
import { PlanoTerapeuticoPanel } from '@/components/processos/PlanoTerapeuticoPanel'

export default function PlanoPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Logo size="sm" />
        </div>

        <PatientSelect
          onSelect={setSelectedPatient}
          selectedId={selectedPatient?.id}
        />

        {selectedPatient && (
          <Card className="mt-6">
            <PlanoTerapeuticoPanel 
              patient={selectedPatient} 
            />
          </Card>
        )}
      </div>
    </div>
  )
}