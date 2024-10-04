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

type Pessoa = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};

type Grupo = {
  id: number;
  nome: string;
  descricao: string;
  saldo: number;
  pessoa: Pessoa;
};

export type Lancamento = {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'ENTRADA' | 'SAIDA';
  categoria: string;
  grupo: Grupo | null;
  grupoId: number | null;
};

