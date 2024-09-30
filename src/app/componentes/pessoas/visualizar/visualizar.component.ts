import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { IPessoa } from '../../../types/pessoa.types';
import { of, switchMap, take } from 'rxjs';
import { FormularioService } from '../../../services/formulario.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../home/sidebar/sidebar.component";
interface Sexo {
  sexo: string;
}

@Component({
  selector: 'app-visualizar',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    DropdownModule,
    InputMaskModule,
    RouterModule,
    ToastModule,
    CommonModule,
    SidebarComponent
],
  providers: [MessageService],
  templateUrl: './visualizar.component.html',
  styleUrl: './visualizar.component.scss',
})
export class VisualizarComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private formularioService: FormularioService,
    private messageService: MessageService,
    private _router: Router
  ) {}

  pessoa: IPessoa = { id: null, nome: '', cpf: '', email: '', telefone: '' };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formularioService.getPessoas().subscribe((pessoas) => {
        this.pessoa = pessoas.find((p) => p.id === parseInt(id)) || this.pessoa;
      });
    }
  }

  alterarPessoa(): void {
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
          this.messageService.add({
            severity: 'success',
            summary: 'Concluído!',
            detail: `Usuário ${this.pessoa?.nome} alterado com sucesso!`,
          });
      }
    },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          detail: 'Falha ao alterar os dados do usuário.',
        });
      }
    );
  }

}
