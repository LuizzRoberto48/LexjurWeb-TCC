import { Injectable } from "@angular/core";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { BehaviorSubject } from "rxjs";
import { ProcessService } from "./process.service";

export const RESOURCE = 'process-details.resources';
export const GENERAL = 'process-details.general';
export const SCHEDULE = 'process-details.schedule';
export const FILES = 'process-details.files';
export const PROGRESS = 'process-details.progress';
export const EXPENSES = 'process-details.expenses';
export const PARTS = 'process-details.parts';
export const ATTACHED = 'process-details.attached';
export const GUARANTEES = 'process-details.guarantees';
export const REQUESTS = 'process-details.requests';

export const RESOURCE_PATH = 'resources';
export const GENERAL_PATH = 'general';
export const SCHEDULE_PATH = 'schedule';
export const FILES_PATH = 'files';
export const PROGRESS_PATH = 'progress';
export const EXPENSES_PATH = 'expenses';
export const PARTS_PATH = 'parts';
export const ATTACHED_PATH = 'attached';
export const GUARANTEES_PATH = 'guarantees';
export const REQUESTS_PATH = 'requests';



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
          link: GENERAL_PATH
        },
        {
          id: RESOURCE,
          title: 'Recursos/Incidentes',
          type: 'basic',
          link: RESOURCE_PATH
        },
        {
          id: SCHEDULE,
          title: 'Agendamentos',
          type: 'basic',
          link: SCHEDULE_PATH
        },
        {
          id: PROGRESS,
          title: 'Andamentos',
          type: 'basic',
          link: PROGRESS_PATH
        },
        {
          id: PARTS,
          title: 'Partes',
          type: 'basic',
          link: PARTS_PATH
        },
        {
          id: FILES,
          title: 'Arquivos',
          type: 'basic',
          link: FILES_PATH
        },
        {
          id: EXPENSES,
          title: 'Despesas',
          type: 'basic',
          link: EXPENSES_PATH
        },
        {
          id: ATTACHED,
          title: 'Apensos',
          type: 'basic',
          link: ATTACHED_PATH
        },
        {
          id: GUARANTEES,
          title: 'Garantias',
          type: 'basic',
          link: GUARANTEES_PATH
        },
        {
          id: REQUESTS,
          title: 'Pedidos',
          type: 'basic',
          link: REQUESTS_PATH
        },
      ]
    }]
  }

  getItemById(id: string): FuseNavigationItem {
    this.$currentPanel.next(this.topics[0].children.find(topic => topic.id === id))
    return this.topics[0].children.find(topic => topic.id === id)
  }



}