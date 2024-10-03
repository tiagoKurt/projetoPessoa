import { IPessoa } from "./pessoa.types";

export interface IGrupoSalvar{
  id: number | null;
  nome: string;
  descricao: string
  pessoaId: number | null;
}

export interface IGrupoShow{
  id: number | null;
  nome: string;
  descricao: string
  pessoa: IPessoa
  saldo: number
}
