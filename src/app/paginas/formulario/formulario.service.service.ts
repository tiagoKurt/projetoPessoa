import { Injectable } from '@angular/core';
import { IPessoa } from './formulario.types';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormularioServiceService {

  apiUrl = 'http://localhost:8080/pessoas/'

  private pessoas: IPessoa[] = [];
  constructor(private http : HttpClient) { }

  getPessoas(): Observable<IPessoa[]> {
    return this.http.get<IPessoa[]>(this.apiUrl);
  }

  criarPessoa(pessoa: IPessoa): Observable<IPessoa> {
    return this.http.post<IPessoa>(this.apiUrl, pessoa);
  }

  salvarPessoa(pessoa: IPessoa): Observable<IPessoa> {
    if (pessoa.cpf) {
      return this.http.put<IPessoa>(`${this.apiUrl}/${pessoa.cpf}`, pessoa);
    } else {
      return this.criarPessoa(pessoa);
    }
  }

  deletarPessoa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

}
