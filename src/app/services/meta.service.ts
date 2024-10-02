import { Injectable } from '@angular/core';
import { IMetasSalvar, IMetasShow } from '../types/meta.types';
import { Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  apiUrl = 'http://localhost:3000/metas/'

  constructor(private http : HttpClient
  ) { }

  getMetas(): Observable<IMetasShow[]> {
    return this.http.get<IMetasShow[]>(this.apiUrl);
  }

  criarMeta(Meta: IMetasSalvar): Observable<IMetasSalvar> {
    return this.http.post<IMetasSalvar>(this.apiUrl, Meta);
  }

  salvarMeta(meta: IMetasSalvar): Observable<IMetasSalvar> {
    if (meta.id) {
      return this.http.put<IMetasSalvar>(`${this.apiUrl}/${meta.id}`, meta);
    } else {
      return this.criarMeta(meta);
    }
  }

  deletarMeta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
