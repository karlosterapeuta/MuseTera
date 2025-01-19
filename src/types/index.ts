export interface User {
  id: string;
  name: string;
  email: string;
  professionalRegister?: string;
  createdAt: Date;
}

export interface Patient {
  id: string;
  nome: string;
  dataNascimento: Date;
  telefone: string;
  therapistId: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Session {
  id: string;
  patientId: string;
  date: Date;
  notes: string;
  interventions: string[];
  evaluation?: {
    demucaScale: number;
    observations: string;
  };
}

export interface Anamnesis {
  id: string;
  patientId: string;
  medicalHistory: {
    currentConditions: string[];
    medications: string[];
    previousTreatments: string[];
  };
  musicalHistory: {
    musicalPreferences: string[];
    musicalExperience: string;
    favoriteInstruments: string[];
  };
  familyBackground: string;
  objectives: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DemucaEvaluation {
  id: string;
  patientId: string;
  date: Date;
  scores: {
    musicalEngagement: number; // 1-5
    emotionalResponse: number; // 1-5
    socialInteraction: number; // 1-5
    communicationSkills: number; // 1-5
    motorCoordination: number; // 1-5
  };
  observations: string;
  evaluatorId: string;
}

export interface TherapeuticPlan {
  id: string;
  patientId: string;
  startDate: Date;
  endDate?: Date;
  objectives: {
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'achieved';
    targetDate: Date;
  }[];
  interventions: {
    id: string;
    type: string;
    description: string;
    frequency: string;
  }[];
  updatedAt: Date;
}

export interface Intervention {
  id: string;
  name: string;
  category: 'musical' | 'cognitive' | 'motor' | 'social' | 'emotional';
  description: string;
  materials: string[];
  duration: number; // em minutos
  objectives: string[];
  contraindications?: string[];
  createdBy: string;
  isTemplate: boolean;
}

export interface SessionReport {
  id: string;
  patientId: string;
  date: Date;
  interventionsUsed: {
    interventionId: string;
    duration: number;
    effectiveness: 1 | 2 | 3 | 4 | 5;
    notes: string;
  }[];
  patientResponse: {
    mood: 'positive' | 'neutral' | 'negative';
    participation: 1 | 2 | 3 | 4 | 5;
    observations: string;
  };
  nextSessionPlanning: string;
  therapistId: string;
  createdAt: Date;
} 