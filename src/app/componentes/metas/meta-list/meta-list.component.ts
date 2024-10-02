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
import { GrupoService } from '../../../services/grupo.service';
import { MetaService } from '../../../services/meta.service';
import { IGrupoShow } from '../../../types/grupo.types';
import { DropDownMetas, IMetasSalvar, IMetasShow } from '../../../types/meta.types';
import { SidebarComponent } from '../../home/sidebar/sidebar.component';

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
  tipoSelecionado : DropDownMetas = {label : '', value : ''};
  tipos: DropDownMetas[] = [
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Saida', value: 'SAIDA' }
  ];  
  categorias: DropDownMetas[] = [
    { label: 'Alimentação', value: 'ALIMENTACAO' },
    { label: 'Educação', value: 'EDUCACAO' },
    { label: 'Lazer', value: 'LAZER' },
    { label: 'Saúde', value: 'SAUDE' },
    { label: 'Transporte', value: 'TRANSPORTE' },
  ]
  
  categoriaSelecionada : DropDownMetas = {label : '', value : ''}
  grupoSelecionado: IGrupoShow | null = null;
  metaSave: IMetasSalvar = { id : null, tipo: '', meta: '', valor: 0, descricao: '', categoria: '', grupoId: null};
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
  onTipoChange(event: any) {
    if (this.metaSave.meta)
    this.metaSave.tipo =this.tipoSelecionado.value
  }

  onCategoriaChange(event: any) {
    if (this.metaSave.meta)
    this.metaSave.categoria = this.categoriaSelecionada.value
  }
  onGrupoChange(event: any) {
    this.metaSave.grupoId = event.value ? event.value.id : null;
    console.log(this.metaSave.grupoId);
  }

  editarMeta(meta: IMetasShow): void {
    if (this.metaSave.meta)
    {
    this.metaSave.id = meta.id;
    this.metaSave.tipo = meta.tipo;
    this.metaSave.valor = meta.valor;
    this.metaSave.grupoId = meta.grupo ? meta.grupo.id : null; // Assume que o objeto 'pessoa' existe em 'grupo'
    this.visible = true;
    }
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
