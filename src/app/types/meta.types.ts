import { IGrupoShow } from "./grupo.types";
export interface IMetasSalvar{
  id: number | null;
  tipo: string;
  meta: string;
  valor: number | null;
  descricao: string
  categoria: string
  grupoId: number | null
}

export interface IMetasShow{
  id: number | null;
  tipo: string;
  valor: number;
  grupo: IGrupoShow
}

export type DropDownMetas = {
  label: string;
  value: string;
}
