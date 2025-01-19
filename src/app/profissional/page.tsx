'use client'

import { useState, useRef, useEffect } from 'react'
import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

const initialFormData = {
  nome: '',
  registro: '',
  especialidade: '',
  email: '',
  telefone: '',
  cidade: ''
}

export default function ProfissionalPage() {
  const [isEditing, setIsEditing] = useState(true)
  const [savedData, setSavedData] = useState<null | typeof initialFormData>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carrega os dados salvos quando a página é carregada
  useEffect(() => {
    const savedProfessional = localStorage.getItem('professional')
    const savedImage = localStorage.getItem('professionalImage')
    
    if (savedProfessional) {
      const data = JSON.parse(savedProfessional)
      setFormData(data)
      setSavedData(data)
      setIsEditing(false)
    }
    
    if (savedImage) {
      setImagePreview(savedImage)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        setImagePreview(imageData)
        localStorage.setItem('professionalImage', imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavedData(formData)
    setIsEditing(false)
    // Salva os dados no localStorage
    localStorage.setItem('professional', JSON.stringify(formData))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const renderField = (label: string, value: string, name: string) => {
    if (isEditing) {
      return (
        <div>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={name === 'email' ? 'email' : name === 'telefone' ? 'tel' : 'text'}
            id={name}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
      )
    }
    return (
      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </span>
        <p className="px-4 py-2 bg-gray-50 rounded-md text-gray-800">
          {value || '-'}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex flex-col items-center mb-8 relative">
          <div 
            onClick={handleImageClick}
            className={`w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 ${isEditing ? 'cursor-pointer hover:opacity-80' : ''} overflow-hidden transition-opacity`}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Foto do perfil"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-24 h-24 text-gray-400" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {isEditing && (
            <button 
              type="button"
              onClick={handleImageClick}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Alterar imagem
            </button>
          )}
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Musicoterapeuta
          </h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {renderField('Nome', savedData?.nome || '', 'nome')}
            {renderField('Nº de Registro (MT)', savedData?.registro || '', 'registro')}
            {renderField('Especialidade', savedData?.especialidade || '', 'especialidade')}
            {renderField('Email', savedData?.email || '', 'email')}
            {renderField('Telefone', savedData?.telefone || '', 'telefone')}
            {renderField('Cidade', savedData?.cidade || '', 'cidade')}
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Salvar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
