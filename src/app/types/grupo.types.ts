import { IPessoa } from "./pessoa.types";

export interface IGrupoSalvar{
  id: number | null;
  nome: string;
  pessoaId: number | null;
}

export interface IGrupoShow{
  id: number | null;
  nome: string;
  pessoa: IPessoa
}
