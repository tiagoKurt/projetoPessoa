import { Injectable } from '@angular/core';
import { IGrupoSalvar, IGrupoShow } from '../types/grupo.types';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  apiUrl = 'http://localhost:3000/grupos/'


  constructor(private http : HttpClient
  ) { }

  getGrupos(): Observable<IGrupoShow[]> {
    return this.http.get<IGrupoShow[]>(this.apiUrl);
  }

  criarGrupo(pessoa: IGrupoSalvar): Observable<IGrupoSalvar> {
    return this.http.post<IGrupoSalvar>(this.apiUrl, pessoa);
  }

  salvarGrupos(grupo: IGrupoSalvar): Observable<IGrupoSalvar> {
    return this.getGrupos().pipe(
      take(1),
      switchMap((grupos) => {
        const usuarioExistente = grupos.find(p => p.nome.toLowerCase() === grupo.nome.toLowerCase());
        if (usuarioExistente && usuarioExistente.id !== grupo.id) {

          return throwError({ message: 'Já existe um usuário com esse nome.' });
        }

        if (grupo.id) {

          return this.http.put<IGrupoSalvar>(`${this.apiUrl}/${grupo.id}`, grupo);

        } else {
          return this.criarGrupo(grupo);
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  deletarGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
