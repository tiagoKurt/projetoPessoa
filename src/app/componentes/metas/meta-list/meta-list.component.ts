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
import { IGrupoShow } from '../../../types/grupo.types';
import { GrupoService } from '../../../services/grupo.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { IPessoa } from '../../../types/pessoa.types';
import { FormularioService } from '../../../services/formulario.service';
import { InputTextModule } from 'primeng/inputtext';
import { of, switchMap, take } from 'rxjs';
import { IMetasSalvar, IMetasShow } from '../../../types/meta.types';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'app-meta-list',
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
  templateUrl: './meta-list.component.html',
  styleUrl: './meta-list.component.scss'
})
export class MetaListComponent {
  metas: IMetasShow[] = [];
  visible: boolean = false;

  grupoSelecionado: IGrupoShow | null = null;
  metaSave: IMetasSalvar = { id: null, tipo: '', valor:null, grupoId: null };
  grupos: IGrupoShow[] = [];

  constructor(
    private grupoService: GrupoService,
    private metaService: MetaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.grupoService.getGrupos().subscribe((data: IGrupoShow[]) => {
      this.grupos = data;
    });

    this.metaService.getMetas().subscribe((data: IMetasShow[]) => {
      this.metas = data;
    });
  }

  onGrupoChange(event: any) {
    this.metaSave.grupoId = event.value ? event.value.id : null;
    console.log(this.metaSave.grupoId);
  }

  editarMeta(meta: IMetasShow): void {
    this.metaSave.id = meta.id;
    this.metaSave.tipo = meta.tipo;
    this.metaSave.valor = meta.valor;
    this.metaSave.grupoId = meta.grupo ? meta.grupo.id : null; // Assume que o objeto 'pessoa' existe em 'grupo'
    this.visible = true;
  }

  cadastrarMeta(): void {
    if (!this.metaSave.tipo || !this.metaSave.valor || !this.metaSave.grupoId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: 'Todos os campos são obrigatórios.',
      });
      return;
    }

    this.metaService.salvarMeta(this.metaSave).subscribe(
      (resposta) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Concluído!',
          detail: 'Meta foi cadastrada com sucesso!',
        });
        this.visible = false;
        this.limparCampos();
        this.ngOnInit();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          detail: 'Falha ao cadastrar a meta.',
        });
      }
    );
  }

  excluirMeta(id: number): void {
    if (id) {
      this.metaService.deletarMeta(id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Concluído!',
            detail: `Meta foi removida com sucesso!`,
          });
          this.ngOnInit();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Falha ao excluir a meta.',
          });
        }
      );
    }
  }

  confirmacaoExclusao(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja excluir essa meta?',
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
        this.excluirMeta(id);
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
    this.metaSave.id = null;
    this.metaSave.tipo = '';
    this.metaSave.valor = null;
    this.grupoSelecionado = null;
  }
}
