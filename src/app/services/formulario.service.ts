import { Injectable } from '@angular/core';
import { IPessoa } from '../types/pessoa.types';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  apiUrl = 'http://localhost:3000/pessoas/'

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
      take(1), // Garante que só pegamos um valor e completamos o observable
      switchMap((pessoas) => {
        const usuarioExistente = pessoas.find(p => p.nome.toLowerCase() === pessoa.nome.toLowerCase());

        if (usuarioExistente && usuarioExistente.id !== pessoa.id) {
          // Se encontrar um usuário com o mesmo nome que não seja o mesmo
          return throwError({ message: 'Já existe um usuário com esse nome.' });
        }

        // Se não existir, prossegue com a operação de salvar
        if (pessoa.id) {
          return this.http.put<IPessoa>(`${this.apiUrl}/${pessoa.id}`, pessoa);
        } else {
          return this.criarPessoa(pessoa);
        }
      }),
      catchError((error) => {
        // Aqui você pode lidar com o erro, como exibir uma mensagem
        return throwError(error);
      })
    );
  }


  deletarPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

}
