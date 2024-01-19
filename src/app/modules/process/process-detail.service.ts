import { Injectable } from "@angular/core";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { BehaviorSubject, Observable, of, switchMap } from "rxjs";
import { ProcessService } from "./process.service";

export const RESOURCE = 'process-details.resources';
export const GENERAL = 'process-details.general';
export const SCHEDULE = 'process-details.schedule';
export const FILES = 'process-details.files';
export const PROGRESS = 'process-details.progress';
export const EXPENSES = 'process-details.expenses';
export const PARTS = 'process-details.parts';

@Injectable({
  providedIn: 'any'
})
export class ProcessDetailService {

  public current: FuseNavigationItem = {} as FuseNavigationItem;
  public $currentPanel: BehaviorSubject<FuseNavigationItem> = new BehaviorSubject<FuseNavigationItem>(null);
 

  constructor(private processService: ProcessService) {
  }


  get topics(): FuseNavigationItem[] {
    return [{
      id: 'process-detail',
      title: 'Detalhes do processo',
      type: 'group',
      children: [
        {
          id: GENERAL,
          title: 'Geral',
          type: 'basic',
          link: 'general'
        },
        {
          id: RESOURCE,
          title: 'Recursos/Incidentes',
          type: 'basic',
          link: 'resources'
        },
        {
          id: SCHEDULE,
          title: 'Agendamento',
          type: 'basic',
          link: 'schedule'
        },
        {
          id: PROGRESS,
          title: 'Andamento',
          type: 'basic',
          link: 'progress'
        },
        {
          id: PARTS,
          title: 'partes',
          type: 'basic',
          link: 'parts'
        },
        {
          id: FILES,
          title: 'Arquivos',
          type: 'basic',
          link: 'files'
        },
        {
          id: EXPENSES,
          title: 'Despesas',
          type: 'basic',
          link: 'expenses'
        },
      ]
    }]
  }

  getItemById(id: string): FuseNavigationItem {
    this.$currentPanel.next(this.topics[0].children.find(topic => topic.id === id))
    return this.topics[0].children.find(topic => topic.id === id)
  }



}