import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { IGrupoSalvar, IGrupoShow } from '../types/grupo.types';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  apiUrl = 'http://localhost:8080/api/grupo'


  constructor(private http : HttpClient
  ) { }

  getGrupos(): Observable<IGrupoShow[]> {
    return this.http.get<IGrupoShow[]>(this.apiUrl);
  }

  criarGrupo(pessoa: IGrupoSalvar): Observable<IGrupoSalvar> {
    console.log(pessoa)
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
          console.log(grupo.id)
          return this.http.put<IGrupoSalvar>(this.apiUrl, grupo);

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
