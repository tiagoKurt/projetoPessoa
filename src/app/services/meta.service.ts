import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMetasSalvar, IMetasShow } from '../types/meta.types';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  apiUrl = 'http://localhost:8080/api/meta'

  constructor(private http : HttpClient
  ) { }

  getMetas(): Observable<IMetasShow[]> {
    return this.http.get<IMetasShow[]>(this.apiUrl);
  }

  criarMeta(Meta: IMetasSalvar): Observable<IMetasSalvar> {

    console.log(Meta)

    return this.http.post<IMetasSalvar>(this.apiUrl, Meta);
  }

  salvarMeta(meta: IMetasSalvar): Observable<IMetasSalvar> {
    if (meta.id) {

      return this.http.put<IMetasSalvar>(this.apiUrl, meta);
    } else {
      return this.criarMeta(meta);
    }
  }

  deletarMeta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
