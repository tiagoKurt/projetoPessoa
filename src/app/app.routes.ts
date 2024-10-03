import { Routes } from '@angular/router';
import { GruposListComponent } from './componentes/grupos/grupos-list/grupos-list.component';
import { HomeComponent } from './componentes/home/home.component';
import { FormularioComponent } from './componentes/pessoas/formulario/formulario.component';
import { ListarComponent } from './componentes/pessoas/listar/listar.component';
import { VisualizarComponent } from './componentes/pessoas/visualizar/visualizar.component';
import { MetaListComponent } from './componentes/metas/meta-list/meta-list.component';
import { LancamentoListComponent } from './componentes/lancamento/lancamento-list/lancamento-list.component';



export const routes: Routes = [
  { path: 'pessoas/formulario', component: FormularioComponent },
  { path: '', component: HomeComponent },
  { path: 'pessoas/listar', component: ListarComponent },
  {path: 'pessoas/editar/:id', component: VisualizarComponent},
  {path: 'grupos/listar', component: GruposListComponent},
  {path: 'metas/listar', component: MetaListComponent},
  {path: 'lancamentos/listar', component: LancamentoListComponent}


];
