import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarComponent } from '../../home/sidebar/sidebar.component';
import { IGrupoSalvar, IGrupoShow } from '../../../types/grupo.types';
import { GrupoService } from '../../../services/grupo.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { IPessoa } from '../../../types/pessoa.types';
import { FormularioService } from '../../../services/formulario.service';
import { InputTextModule } from 'primeng/inputtext';
import { of, switchMap, take } from 'rxjs';
@Component({
  selector: 'app-grupos-list',
  standalone: true,
  imports: [
    ButtonModule,
    TagModule,
    CommonModule,
    CardModule,
    TableModule,
    RouterModule,
    DialogModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    SidebarComponent,
    ConfirmDialogModule,
    FloatLabelModule,
    DropdownModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './grupos-list.component.html',
  styleUrl: './grupos-list.component.scss',
})
export class GruposListComponent {
  grupos: IGrupoShow[] = [];
  visible: boolean = false;

  pessoaSelecionada: IPessoa | null = null;
  grupoSave: IGrupoSalvar = { id: null, nome: '', pessoaId: null };
  pessoas: IPessoa[] = [];

  constructor(
    private grupoService: GrupoService,
    private formularioService: FormularioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.grupoService.getGrupos().subscribe((data: IGrupoShow[]) => {
      this.grupos = data;
    });

    this.formularioService.getPessoas().subscribe((data: IPessoa[]) => {
      this.pessoas = data;
    });
  }

  onPessoaChange(event: any) {
    this.grupoSave.pessoaId = event.value ? event.value.id : null;
    console.log(this.grupoSave.pessoaId);
  }

  editarGrupo(grupo: IGrupoShow): void {
    this.grupoSave.id = grupo.id;
    this.grupoSave.nome = grupo.nome;
    this.grupoSave.pessoaId = grupo.pessoa ? grupo.pessoa.id : null; // Assume que o objeto 'pessoa' existe em 'grupo'
    this.visible = true;
  }

  cadastrarGrupo(): void {
    if (!this.grupoSave.nome || !this.grupoSave.pessoaId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: 'Todos os campos são obrigatórios.',
      });
      return;
    }

    this.grupoService
      .getGrupos()
      .pipe(
        take(1),
        switchMap((grupos) => {
          const usuarioExistente = grupos.find(
            (g) => g.nome.toLowerCase() === this.grupoSave.nome.toLowerCase()
          );

          if (usuarioExistente && usuarioExistente.id !== this.grupoSave.id) {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro!',
              detail: 'Já existe um grupo com esse nome.',
            });

            return of(null);
          }

          return this.grupoService.salvarGrupos(this.grupoSave);
        })
      )
      .subscribe(
        (resposta) => {
          if (resposta) {
            this.messageService.add({
              severity: 'success',
              summary: 'Concluído!',
              detail:
                'Grupo: ' +
                this.grupoSave.nome +
                ', foi cadastrado com sucesso!',
            });
            this.visible = false;
            this.limparCampos();
            this.ngOnInit();
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Falha ao cadastrar o grupo.',
          });
        }
      );
  }

  excluirGrupo(id: number): void {
    if (id) {
      this.grupoService.deletarGrupo(id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Concluído!',
            detail: `Grupo foi removido com sucesso!`,
          });
          this.ngOnInit();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Falha ao excluir o Grupo.',
          });
        }
      );
    }
  }

  confirmacaoExclusao(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja excluir esse grupo?',
      header: 'Confirmação de exclusão',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'Sim p-button-danger p-button-text Não',
      rejectButtonStyleClass: 'p-button-text p-button-text ',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        // this.messageService.add({ severity: 'success', summary: 'confirmar', detail: 'confirmar' });
        this.excluirGrupo(id);
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'excluir', detail: 'excluir' });
      },
    });
  }

  showDialog() {
    this.visible = true;
  }

  limparCampos() {
    this.grupoSave.id = null;
    this.grupoSave.nome = '';
    this.pessoaSelecionada = null;
  }

}
