export interface WalkSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  steps: number;
  duration: number;
  distance: number;
  calories: number;
  isActive: boolean;
}
