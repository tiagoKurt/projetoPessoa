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
  meta: string;
  tipo: string;
  valor: number;
  categoria: string
  descricao: string
  grupo: IGrupoShow
}

export type DropDownStandard = {
  label: string;
  value: string;
}
