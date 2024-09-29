import { Routes } from '@angular/router';
import { FormularioComponent } from './pessoas/formulario/formulario.component';
import { ListarComponent } from './pessoas/listar/listar.component';
import { VisualizarComponent } from './pessoas/visualizar/visualizar.component';


export const routes: Routes = [
  { path: 'formulario', component: FormularioComponent },
  { path: '', component: ListarComponent },
  {path: 'editar/:id', component: VisualizarComponent}

];
