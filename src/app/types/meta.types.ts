import { IGrupoSalvar, IGrupoShow } from "./grupo.types";

export interface IMetasSalvar{
  id: number | null;
  tipo: string;
  valor: number | null;
  grupoId: number | null
}

export interface IMetasShow{
  id: number | null;
  tipo: string;
  valor: number;
  grupo: IGrupoShow
}
