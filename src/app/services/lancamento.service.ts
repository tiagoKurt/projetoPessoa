import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILancamentosSalvar, ILancamentosShow, Lancamento } from '../types/lancamento.types';

@Injectable({
  providedIn: 'root'
})

export class LancamentoService {

  apiUrl = 'http://localhost:8080/api/lancamento'

  constructor(private http : HttpClient
  ) { }

  getLancamentos(): Observable<ILancamentosShow[]> {
    return this.http.get<ILancamentosShow[]>(this.apiUrl);
  }

  criarLancamento(Lancamento: ILancamentosSalvar): Observable<ILancamentosSalvar> {

    console.log(Lancamento)

    return this.http.post<ILancamentosSalvar>(this.apiUrl, Lancamento);
  }

  salvarLancamento(Lancamento: ILancamentosSalvar): Observable<ILancamentosSalvar> {
    if (Lancamento.id) {

      return this.http.put<ILancamentosSalvar>(this.apiUrl, Lancamento);
    } else {
      return this.criarLancamento(Lancamento);
    }
  }

  deletarLancamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getRelatorio( tipoRelatorio: string , pesquisa : string): Observable<Lancamento[]> {
    console.log(`${this.apiUrl}/relatorio/${tipoRelatorio}${pesquisa}`)
    return this.http.get<Lancamento[]>(`${this.apiUrl}/relatorio/${tipoRelatorio}${pesquisa}`);
  }
}

