import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { IPessoa } from '../types/pessoa.types';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  apiUrl = 'http://localhost:8080/api/pessoa'

  private pessoas: IPessoa[] = [];
  constructor(private http : HttpClient) { }

  getPessoas(): Observable<IPessoa[]> {
    return this.http.get<IPessoa[]>(this.apiUrl);
  }

  criarPessoa(pessoa: IPessoa): Observable<IPessoa> {
    return this.http.post<IPessoa>(this.apiUrl, pessoa);
  }

  salvarPessoa(pessoa: IPessoa): Observable<IPessoa> {
    return this.getPessoas().pipe(
      take(1),
      switchMap((pessoas) => {
        const usuarioExistente = pessoas.find(p => p.nome.toLowerCase() === pessoa.nome.toLowerCase());

        if (usuarioExistente && usuarioExistente.id !== pessoa.id) {
          return throwError({ message: 'Já existe um usuário com esse nome.' });
        }

        if (pessoa.id) {
          return this.http.put<IPessoa>(this.apiUrl, pessoa);
        } else {
          return this.criarPessoa(pessoa);
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }


  deletarPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

}
