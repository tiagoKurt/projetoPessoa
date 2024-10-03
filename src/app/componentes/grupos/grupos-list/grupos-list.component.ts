import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { of, switchMap, take } from 'rxjs';
import { FormularioService } from '../../../services/formulario.service';
import { GrupoService } from '../../../services/grupo.service';
import { IGrupoSalvar, IGrupoShow } from '../../../types/grupo.types';
import { IPessoa } from '../../../types/pessoa.types';
import { SidebarComponent } from '../../home/sidebar/sidebar.component';
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
  grupoSave: IGrupoSalvar = { id: null, nome: '', descricao : '',pessoaId: null };
  pessoas: IPessoa[] = [];

  constructor(
    private grupoService: GrupoService,
    private formularioService: FormularioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.grupoService.getGrupos().subscribe((data: IGrupoShow[]) => {
      console.log(data);
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
    this.grupoSave.descricao = grupo.descricao;
    this.pessoaSelecionada = grupo.pessoa;
    this.visible = true;
  }

  cadastrarGrupo(): void {
    if (!this.grupoSave.nome || !this.grupoSave.pessoaId || !this.grupoSave.descricao) {
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
    this.grupoSave.descricao = '';
    this.pessoaSelecionada = null;
  }

}
