import { Routes } from '@angular/router';
import { FormularioComponent } from './componentes/pessoas/formulario/formulario.component';
import { ListarComponent } from './componentes/pessoas/listar/listar.component';
import { VisualizarComponent } from './componentes/pessoas/visualizar/visualizar.component';


export const routes: Routes = [
  { path: 'formulario', component: FormularioComponent },
  { path: '', component: ListarComponent },
  {path: 'editar/:id', component: VisualizarComponent}

];
