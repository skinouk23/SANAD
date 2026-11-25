export interface CarePlanMedication {
  id: number;
  name: string;
  dosage: string;
  condition: string;
  stock: number;
  nextRefill: string;
}

export interface CarePlanCondition {
  id: number;
  name: string;
  icon: string;
  since: string;
  status: 'controlled' | 'monitored' | 'attention';
}

export interface CarePlanAppointment {
  id: number;
  type: string;
  date: string;
  time: string;
  doctor?: string;
  location?: string;
}
