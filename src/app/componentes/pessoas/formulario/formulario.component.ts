import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { IPessoa } from '../../../types/pessoa.types';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { of, switchMap, take } from 'rxjs';
import { FormularioService } from '../../../services/formulario.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../home/sidebar/sidebar.component";

interface Sexo {
  sexo: string;
}

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    MenubarModule,
    ToastModule,
    ButtonModule,
    DropdownModule,
    InputMaskModule,
    RouterModule,
    CommonModule,
    SidebarComponent
],
  providers: [MessageService],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {

  formDesabilitado = false;

  pessoas: IPessoa[] = [];

  pessoa: IPessoa = { id: null, nome: '', cpf: '', email: '', telefone: '' }

  constructor(
    private formularioService: FormularioService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {

      this.formDesabilitado = true;
    }
  }

  cadastrar(): void {
    if (!this.pessoa.nome || !this.pessoa.email || !this.pessoa.cpf || !this.pessoa.telefone) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção!', detail: 'Todos os campos são obrigatórios.' });
      return;
    }

    this.formularioService.getPessoas().pipe(
      take(1),
      switchMap((pessoas) => {
        const usuarioExistente = pessoas.find(p => p.nome.toLowerCase() === this.pessoa.nome.toLowerCase());

        if (usuarioExistente && usuarioExistente.id !== this.pessoa.id) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Já existe um usuário com esse nome.' });

          return of(null);
        }

        return this.formularioService.salvarPessoa(this.pessoa);
      })
    ).subscribe(
      (resposta) => {
        if (resposta) {
          this.messageService.add({ severity: 'success', summary: 'Concluído!', detail: 'Usuário: ' + this.pessoa.nome + ', foi cadastrado com sucesso!' });
          this.pessoa = { id: null, nome: '', cpf: '', email: '', telefone: '' };
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Falha ao cadastrar o usuário.' });
      }
    );
  }



}
