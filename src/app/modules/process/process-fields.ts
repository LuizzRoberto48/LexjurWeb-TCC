/* 
***** Quando houver um "." entre strings, quer dizer que há uma separação nas tabelas (Objetos no backend) no banco ******
**** Ex: Organ.name ****
*/

export const processFields = [
  {name:'Phase.name', label: 'Fase'},
  {name:'ActionType.name', label: 'Tipo de ação'},
  {name:'Organ.name', label: 'Orgão'},
  {name:'organNumber', label: 'Número do órgão'},
  {name:'Forum.County.name', label: 'Comarca'},
  {name:'Forum.name', label: 'Foro'},
  {name:'cnj', label: 'CNJ'},
  {name:'caseNumber', label: 'Número do processo'},
  {name:'oldCaseNumber', label: 'Número antigo do processo'},
  {name:'EletronicSystem.name', label: 'Sistema Eletrônico'},
  {name:'LawSubArea.LawArea.name', label: 'Área do direito'},
  {name:'LawSubArea.name', label: 'Subarea do direito'},
  {name:'Organ.Origin.name', label: 'Origem'},
  {name:'Forum.County.uf', label: 'UF'},
  {name:'insideLawyer.name', label: 'Advogado responsável'},
  {name:'Core.name', label: 'Núcleo'},
  {name:'instance', label: 'Instância'},
  {name:'SubObject.Object.name', label: 'Objeto'},
  {name:'SubObject.name', label: 'Sub objeto'},
  {name:'subject.name', label: 'Assunto'},
  {name:'Stakeholder.Client.name', label: 'Cliente'},
  {name:'Stakeholder.name', label: 'Parte Interessada'},
  {name:'stakeholderPosition', label: 'Posição da Parte Interessada'},
  {name:'AdverseStakeholder.type', label: 'Parte Adversa (Tipo)'},
  {name:'AdverseStakeholder.name', label: 'Nome da Parte Adversa'},
  {name:'adversePosition', label: 'Posição da Parte Adversa'},
  {name:'AdverseStakeholder.cpfCnpj', label: 'CPF/CNPJ – Parte Adversa'},
  {name:'AdverseStakeholder.phone', label: 'Telefone Parte Adversa'},
  {name:'adverseLawyer.name', label: 'Nome advogado adverso'},
  {name:'adverseLawyer.oab', label: 'OAB advogado adverso'},
  {name:'adverseLawyer.ufOab', label: 'UF OAB advogado adverso'},
  {name:'distributionDate', label: 'Data da Distribuição'},
  {name:'quoteDate', label: 'Data da Citação'},
  {name:'causeValue', label: 'Valor da causa'},
  {name:'description', label: 'Breve Relato'},
  
]