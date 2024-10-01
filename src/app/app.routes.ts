import { Routes } from '@angular/router';
import { FormularioComponent } from './componentes/pessoas/formulario/formulario.component';
import { ListarComponent } from './componentes/pessoas/listar/listar.component';
import { VisualizarComponent } from './componentes/pessoas/visualizar/visualizar.component';
import { HomeComponent } from './componentes/home/home.component';
import { GruposListComponent } from './componentes/grupos/grupos-list/grupos-list.component';


export const routes: Routes = [
  { path: 'pessoas/formulario', component: FormularioComponent },
  { path: '', component: HomeComponent },
  { path: 'pessoas/listar', component: ListarComponent },
  {path: 'pessoas/editar/:id', component: VisualizarComponent},
  {path: 'grupos/listar', component: GruposListComponent}


];
