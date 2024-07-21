import { UploadType } from '../upload.model';

function excel(): UploadType {
  return {
    name: 'excel',
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: ['xls, xlsx'].join(),
    color: 'red',
    label: '',
  };
}

function doc(): UploadType {
  return {
    name: 'word',
    accept: '.doc',
    extensions: ['doc, docx'].join(),
    color: '#ddd',
    label: '',
  };
}

function txt(): UploadType {
  return {
    name: 'txt',
    accept: '.txt',
    extensions: 'txt',
    label: '',
  };
}

function pdf(): UploadType {
  return {
    name: 'pdf',
    accept: 'application/pdf',
    extensions: 'pdf',
    label: '',
  };
}

function png(): UploadType {
  return {
    name: 'png',
    accept: 'image/png',
    extensions: 'png',
    label: '',
  };
}

function jpeg(): UploadType {
  return {
    name: 'jpeg',
    accept: 'image/jpeg',
    extensions: 'jpeg',
    label: '',
  };
}

function jpg(): UploadType {
  return {
    name: 'jpg',
    accept: 'image/jpg',
    extensions: 'jpg',
    label: '',
  };
}

export { excel, doc, txt, pdf, png, jpeg, jpg };
