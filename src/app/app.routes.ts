import { Routes } from '@angular/router';
import { FormularioComponent } from './paginas/formulario/formulario.component';
import { ListarComponent } from './paginas/listar/listar.component';


export const routes: Routes = [
  { path: 'formulario', component: FormularioComponent },
  { path: '', component: ListarComponent },

];
