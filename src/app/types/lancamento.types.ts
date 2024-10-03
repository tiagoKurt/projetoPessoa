import { Data } from "@angular/router";
import { IGrupoShow } from "./grupo.types";

export interface ILancamentosSalvar{
  id: number | null;
  nome: string;
  descricao: string
  valor: number | null;
  data: string;
  tipo: string;
  categoria: string
  grupoId: number | null
}

export interface ILancamentosShow{
  id: number | null;
  nome: string;
  descricao: string
  tipo: string;
  data: string;
  categoria: string
  valor: number | null;
  grupo: IGrupoShow
}
