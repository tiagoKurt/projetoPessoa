import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IPessoa } from '../../../types/pessoa.types';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormularioService } from '../../../services/formulario.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarComponent } from "../../home/sidebar/sidebar.component";

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
    ToastModule,
    ConfirmDialogModule, SidebarComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.scss'
})
export class ListarComponent implements OnInit{
  pessoas: IPessoa[] = [];

  constructor(private formularioService: FormularioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService

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
          this.ngOnInit();
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

  confirmacaoExclusao(event: Event, id: number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Tem certeza que deseja excluir esse usuário?',
        header: 'Confirmação de exclusão',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        acceptButtonStyleClass:"Sim p-button-danger p-button-text Não",
        rejectButtonStyleClass:"p-button-text p-button-text ",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: () => {
            // this.messageService.add({ severity: 'success', summary: 'confirmar', detail: 'confirmar' });
            this.excluirPessoa(id)
        },
        reject: () => {
            // this.messageService.add({ severity: 'error', summary: 'excluir', detail: 'excluir' });
        }
    });
}

}
