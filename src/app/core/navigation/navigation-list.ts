import { FuseNavigationItem } from "@fuse/components/navigation";

export const NavigationList: FuseNavigationItem[] = [
  {
      id   : 'dashboard',
      title: 'Dashboard',
      type : 'basic',
      icon : 'heroicons_outline:chart-pie',
      link : '/dashboard'
  },
  {
    id   : 'processes',
    title: 'Processos',
    type : 'basic',
    icon : 'heroicons_outline:chart-pie',
    link : '/processos'
}
];