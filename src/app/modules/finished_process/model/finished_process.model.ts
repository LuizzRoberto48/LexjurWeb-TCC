export interface FinishedProcess {
  id?: number;
  canBeEndded: boolean;
  date: string;
  waitToAuthorizaded: boolean;
  type: string;
  value: number; 
  observation: string;
}
