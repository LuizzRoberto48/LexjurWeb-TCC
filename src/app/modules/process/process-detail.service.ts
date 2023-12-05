import { Injectable } from "@angular/core";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { BehaviorSubject, Observable, of, switchMap } from "rxjs";
import { ProcessService } from "./process.service";

export const RESOURCE = 'process-details.resources';
export const GENERAL = 'process-details.general'
export const SCHEDULE = 'process-details.schedule'

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
      ]
    }]
  }

  getItemById(id: string): FuseNavigationItem {
    this.$currentPanel.next(this.topics[0].children.find(topic => topic.id === id))
    return this.topics[0].children.find(topic => topic.id === id)
  }



}