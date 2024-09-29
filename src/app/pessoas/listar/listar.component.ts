import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IPessoa } from '../formulario/formulario.types';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormularioService } from '../formulario/formulario.service.service';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [ButtonModule,
    TagModule,
    CommonModule,
    CardModule,
    TableModule,
    RouterModule,
    DialogModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.scss'
})
export class ListarComponent implements OnInit{
  pessoas: IPessoa[] = [];

  constructor(private formularioService: FormularioService,
    private messageService: MessageService,

  ) {}

  ngOnInit() {
    this.formularioService.getPessoas().subscribe((data: IPessoa[]) => {
      this.pessoas = data;
    });
  }

  excluirPessoa(id: number): void {

    if (id) {
      this.formularioService.deletarPessoa(id).subscribe(
        () => {

          this.messageService.add({
            severity: 'success',
            summary: 'Concluído!',
            detail: `Usuário foi removido com sucesso!`,
          });

        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Falha ao excluir o usuário.',
          });
        }
      );
    }
  }

}
