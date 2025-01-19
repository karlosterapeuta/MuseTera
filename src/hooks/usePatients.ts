import { useState, useEffect } from 'react'
import { Patient } from '@/types'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  const loadPatients = () => {
    const savedPatients = JSON.parse(localStorage.getItem('patients') || '[]')
    
    const formattedPatients = savedPatients.map((patient: any) => ({
      ...patient,
      dataNascimento: new Date(patient.dataNascimento),
      createdAt: new Date(patient.createdAt)
    }))

    setPatients(formattedPatients)
    setLoading(false)
  }

  const addPatient = (newPatient: Patient) => {
    const existingPatients = [...patients]
    const updatedPatients = [...existingPatients, newPatient]
    
    localStorage.setItem('patients', JSON.stringify(updatedPatients))
    window.dispatchEvent(new Event('patientsUpdated'))
  }

  const updatePatient = (updatedPatient: Patient) => {
    const existingPatients = [...patients]
    const index = existingPatients.findIndex(p => p.id === updatedPatient.id)
    
    if (index !== -1) {
      existingPatients[index] = updatedPatient
      localStorage.setItem('patients', JSON.stringify(existingPatients))
      window.dispatchEvent(new Event('patientsUpdated'))
    }
  }

  const deletePatient = (patientId: string) => {
    const existingPatients = patients.filter(p => p.id !== patientId)
    localStorage.setItem('patients', JSON.stringify(existingPatients))
    window.dispatchEvent(new Event('patientsUpdated'))
  }

  useEffect(() => {
    loadPatients()
    window.addEventListener('patientsUpdated', loadPatients)
    return () => window.removeEventListener('patientsUpdated', loadPatients)
  }, [])

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    refreshPatients: loadPatients
  }
}