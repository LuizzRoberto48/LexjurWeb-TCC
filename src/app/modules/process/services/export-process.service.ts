import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ExportProcess } from '../models/export-process';

@Injectable({
  providedIn: 'root',
})
export class ExportProcessService {
  constructor(private _http: HttpClient) {}

  exportExcel(data: ExportProcess) {
    return this._http.post(`${environment.apiURL}/export_process`, data, {
      responseType: 'blob' as 'json', // Expect a blob response
      observe: 'response', // Get the full response including headers
    });
  }

  saveFile(blob: Blob, filename: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  transformResponseToBlob(response: any) {
    const blob = new Blob([response.body], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'processos.xlsx';
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    return { blob, filename };
  }
}
