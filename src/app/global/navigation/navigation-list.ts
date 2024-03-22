import { FuseNavigationItem } from "@fuse/components/navigation";

export const NavigationList: FuseNavigationItem[] = [
  {
      id   : 'dashboard',
      title: 'Informações Gerais',
      type : 'basic',
      icon : 'heroicons_outline:library',
      link : '/dashboard'
  },
  {
    id   : 'lawyers',
    title: 'Usuários',
    type : 'basic',
    icon : 'heroicons_outline:identification',
    link : '/lawyers'
  },
  {
    id   : 'processes',
    title: 'Processos',
    type : 'basic',
    icon : 'heroicons_outline:collection',
    link : '/processos'
  },
];