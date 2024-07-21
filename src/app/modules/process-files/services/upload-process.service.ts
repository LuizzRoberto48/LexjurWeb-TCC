import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  from,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'environments/environment';
import { UploadType } from '@components/upload-file/upload.model';
import {
  CreateUploadProcessFile,
  CrudFileMethod,
  GetUploadFile,
  TargetFiles,
  allTargets,
} from '../models/upload-process-files';
import { getLastIndex } from 'app/global/utils/str-manipulations';
import { UploadFileService } from '@components/upload-file/upload-file.service';

@Injectable({
  providedIn: 'any',
})
export class UploadProcessFileService {
  private currentFile$: BehaviorSubject<GetUploadFile> = new BehaviorSubject(
    null,
  );
  $obsevableFile = this.currentFile$.asObservable();
  $crudFile: Subject<CrudFileMethod> = new Subject();

  currentTarget: { name: string; id: number };
  $currentProcessNumber: Observable<string>;
  $isFinishedFile:BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor(
    private _http: HttpClient,
    private fileService: UploadFileService
  ) {}

  private formatDataFile(file: File, obj: CreateUploadProcessFile) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    // Append properties from obj to formData
    Object.entries(obj).forEach(([key, value]: any) => {
      if (key === 'processNumber') {
        formData.append('processNumber[name]', value.name);
        formData.append('processNumber[number]', value.number);
      } else {
        formData.append(key, value?.toString() ?? '');
      }
    });
    return formData;
  }

  createFile(file: File, obj: CreateUploadProcessFile): Observable<any> {
    const { id, ...uploadObj } = obj;
    const formData: FormData = this.formatDataFile(file, uploadObj);
    // Create headers to specify that you are sending form data
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this._http.post<GetUploadFile>(
      `${environment.apiURL}/process/uploads`,
      formData,
      { headers },
    );
  }


  sendFinishedFile(isFinished:boolean) {
    this.$isFinishedFile.next(isFinished)
  }

  updateFile(obj: CreateUploadProcessFile, file?: File): Observable<any> {
    const formData: FormData = this.formatDataFile(file, obj);

    // Create headers to specify that you are sending form data
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    // Make the POST request with both JSON data and form data
    return this._http.put<GetUploadFile>(
      `${environment.apiURL}/process/uploads`,
      formData,
      { headers },
    );
  }

  removeProcessFile(id: number) {
    return this._http.delete<any>(
      `${environment.apiURL}/process/uploads/${id}`,
    );
  }

  findClassifications() {
    return this._http.get<{ id: number; name: string }[]>(
      `${environment.apiURL}/process/uploads/classifications`,
    );
  }

  findByTarget(target: string, processId: number, targetId?: number, isFinished:boolean = false) {
    let params = new HttpParams();
    if (targetId) params = params.set('targetId', targetId);
    params = params.set('processId', processId.toString());
    params = params.set('name', target);
    params = params.set('isFinished', isFinished);
    return this._http.get<GetUploadFile[]>(
      `${environment.apiURL}/process/uploads/targets`,
      { params },
    );
  }

  findByTargetId(id: number, targetId: number, target: string) {
    let params = new HttpParams();
    params = params.set('targetId', targetId.toString());
    params = params.set('target', target);
    return this._http.get<GetUploadFile>(
      `${environment.apiURL}/process/uploads/targets/${id}`,
      { params },
    );
  }

  downloadFile(path: string) {
    let params = new HttpParams().set('key', path);

    return this._http.get<{ url: string }>(
      `${environment.apiURL}/process/uploads/download`,
      {
        params,
      },
    );
  }

  get targetList(): TargetFiles[] {
    return allTargets;
  }

  set file(file: GetUploadFile) {
    this.currentFile$.next(file);
  }

  public findCardFile(uploadFile: GetUploadFile): UploadType {
    if (!uploadFile) return;
    try {
      const extension = getLastIndex(uploadFile.originalName);
      const file = this.fileService.acceptedTypes.find((accepted) =>
        accepted.extensions.includes(extension),
      );
      //if(!file) return;
      
      file.label = uploadFile?.originalName;
      file.target = uploadFile?.target;
      file.id = uploadFile.id;
      return { ...file } as UploadType;
    } catch(e) {
      console.error("Erro ao tentar mostrar o card file")
    }
  }

  fetchFileAsObservable(
    urlFile: string,
    fileProperties: UploadType,
    name: string,
  ) {
    return from(fetch(urlFile)).pipe(
      switchMap((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return Promise.all([
          response.blob(),
          Promise.resolve(response.headers.get('Content-Type')),
        ]);
      }),
      switchMap(([blob, contentType]) => {
        // Infer the MIME type if not provided
        let mimeType = contentType;
        if (!mimeType || mimeType === 'application/octet-stream') {
          mimeType = fileProperties.accept;
        }
        const file = new File([blob], name, { type: mimeType });
        return [file];
      }),
      catchError((error) => {
        console.error('Error fetching file:', error);
        throw error;
      }),
    );
  }

  toGetUploadFile(uploadType: UploadType, files: GetUploadFile[]) {
    return files.find((f) => f.id == uploadType.id);
  }

  getFileFromBucket(
    uploadFile: GetUploadFile,
  ): Observable<{ file: File; urlFile: string }> {
    const fileProperties = this.findCardFile(uploadFile);
    return this.downloadFile(uploadFile.bucketKey).pipe(
      switchMap((res: { url: string }) => {
        const urlFile = res.url;
        return this.fetchFileAsObservable(
          urlFile,
          fileProperties,
          uploadFile.originalName,
        ).pipe(
          map((file) => ({ file, urlFile })), // Use map here to transform the data
        );
      }),
    );
  }
}
