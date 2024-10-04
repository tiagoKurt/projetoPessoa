import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { GrupoService } from '../../../services/grupo.service';
import { LancamentoService } from '../../../services/lancamento.service';
import { IGrupoShow } from '../../../types/grupo.types';
import { ILancamentosSalvar, ILancamentosShow, Lancamento } from '../../../types/lancamento.types';
import { DropDownStandard } from '../../../types/meta.types';
import { SidebarComponent } from '../../home/sidebar/sidebar.component';

@Component({
  selector: 'app-lancamento-list',
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
    InputMaskModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './lancamento-list.component.html',
  styleUrl: './lancamento-list.component.scss'
})
export class LancamentoListComponent {

  periodoInicio : string = ''
  periodoFim: string = ''

  lancamentos: ILancamentosShow[] = [];
  visible: boolean = false;
  visibleData: boolean = false;
  tipoSelecionado : DropDownStandard = {label : '', value : ''};
  tipos: DropDownStandard[] = [
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Saida', value: 'SAIDA' }
  ];
  categorias: DropDownStandard[] = [
    { label: 'Alimentação', value: 'ALIMENTACAO' },
    { label: 'Educação', value: 'EDUCACAO' },
    { label: 'Lazer', value: 'LAZER' },
    { label: 'Saúde', value: 'SAUDE' },
    { label: 'Transporte', value: 'TRANSPORTE' },
  ]

  categoriaSelecionada : DropDownStandard = {label : '', value : ''}
  grupoSelecionado: IGrupoShow | null = null;
  grupoRelatorio: IGrupoShow | null = null;
  
  lancamentoSave: ILancamentosSalvar = { id : null, nome: '', descricao: '', valor: null, data: '', tipo: '', categoria: '', grupoId: null};
  grupos: IGrupoShow[] = [];
  dataFiltro = ''
  relatorios : Lancamento[] = []

  constructor(
    private grupoService: GrupoService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.grupoService.getGrupos().subscribe((data: IGrupoShow[]) => {
      this.grupos = data;
    });

    this.lancamentoService.getLancamentos().subscribe((data: ILancamentosShow[]) => {
      this.lancamentos = data;
    });
  }
  onTipoChange(event: any) {
    this.lancamentoSave.tipo =this.tipoSelecionado.value
  }

  onCategoriaChange(event: any) {

    this.lancamentoSave.categoria = this.categoriaSelecionada.value
  }
  onGrupoChange(event: any) {
    this.lancamentoSave.grupoId = event.value ? event.value.id : null;
    console.log(this.lancamentoSave.grupoId);
  }

  editarLancamento(lancamento: ILancamentosShow): void {
    if (this.lancamentoSave.nome)
    {
    this.lancamentoSave.id = lancamento.id;
    this.lancamentoSave.nome = lancamento.nome;
    this.lancamentoSave.descricao = lancamento.descricao;
    this.lancamentoSave.id = lancamento.id;
    this.lancamentoSave.tipo = lancamento.tipo;
    this.lancamentoSave.valor = lancamento.valor;
    this.lancamentoSave.grupoId = lancamento.grupo ? lancamento.grupo.id : null;
    this.visible = true;
    }
  }

  cadastrarLancamento(): void {
    this.lancamentoSave.valor = this.lancamentoSave.valor ? +this.lancamentoSave.valor : null;

    if (!this.lancamentoSave.tipo || !this.lancamentoSave.valor || !this.lancamentoSave.grupoId || !this.lancamentoSave.descricao || !this.lancamentoSave.nome || !this.lancamentoSave.categoria) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: 'Todos os campos são obrigatórios.',
      });
      return;
    }

    this.lancamentoService.salvarLancamento(this.lancamentoSave).subscribe(
      (resposta) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Concluído!',
          detail: 'Lancamento foi cadastrada com sucesso!',
        });
        this.visible = false;
        console.log("JSON enviado:", JSON.stringify(this.lancamentoSave));
        this.ngOnInit();
        this.limparCampos();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          detail: 'Falha ao cadastrar lancamento.',
        });
      }
    );
  }

  excluirLancamento(id: number): void {
    if (id) {
      this.lancamentoService.deletarLancamento(id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Concluído!',
            detail: `Lancamento foi removida com sucesso!`,
          });
          this.ngOnInit();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Falha ao excluir o lancamento.',
          });
        }
      );
    }
  }

  confirmacaoExclusao(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja excluir essa lancamento?',
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
        this.excluirLancamento(id);
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'excluir', detail: 'excluir' });
      },
    });
  }

  showDialog() {
    this.visible = true;
  }
  showDataDialog(){
    this.visibleData = true;
  }

  limparCampos() {
    this.lancamentoSave.id = null;
    this.lancamentoSave.tipo = '';
    this.lancamentoSave.nome = '';
    this.lancamentoSave.categoria = '';
    this.lancamentoSave.valor = null;
    this.lancamentoSave.descricao = '';
    this.lancamentoSave.data = '';
    this.grupoSelecionado = null;
  }

  
  gerarRelatorioMensal() {
    console.log(this.dataFiltro)
    this.lancamentoService.getRelatorio('mensal' , `?data=${this.dataFiltro}&grupo=${this.grupoRelatorio?.id}`).subscribe((data: Lancamento[]) => {
        this.relatorios =  data;
        const doc = new jsPDF();

        // Título do relatório
        doc.setFontSize(14);
        doc.text(`RELATÓRIO MENSAL DE LANÇAMENTOS DO ${this.relatorios[0].grupo?.nome}`, 10, 10);
      
        // Definindo as colunas
        const colunas = ['Data', 'Categoria', 'Descrição', 'Valor', 'Tipo', 'Saldo Total do Grupo'];
        const inicioX = 10;
        const inicioY = 30;
        let posicaoY = inicioY;
      
        // Largura de cada coluna (ajuste conforme necessário)
        const larguraColunas = [30, 30, 50, 25, 25, 40];
      
        // Cabeçalho da tabela
        doc.setFontSize(12);
        colunas.forEach((coluna, index) => {
          doc.text(coluna, inicioX + larguraColunas.slice(0, index).reduce((a, b) => a + b, 0), posicaoY);
        });
      
        // Desenha a linha abaixo do cabeçalho
        posicaoY += 5;
        doc.line(inicioX, posicaoY, 200, posicaoY);
      
        // Dados da tabela
        this.relatorios.forEach(lancamento => {
          posicaoY += 10; // Mover para a próxima linha
      
          // Preenchendo cada coluna com os dados de um lançamento
          doc.text(lancamento.data, inicioX, posicaoY);
          doc.text(lancamento.categoria, inicioX + larguraColunas[0], posicaoY);
          doc.text(lancamento.descricao, inicioX + larguraColunas[0] + larguraColunas[1], posicaoY);
          doc.text(lancamento.valor.toFixed(2), inicioX + larguraColunas[0] + larguraColunas[1] + larguraColunas[2], posicaoY);
          doc.text(lancamento.tipo, inicioX + larguraColunas[0] + larguraColunas[1] + larguraColunas[2] + larguraColunas[3], posicaoY);
          if(lancamento.grupo)
          doc.text(lancamento.grupo.saldo.toFixed(2), inicioX + larguraColunas[0] + larguraColunas[1] + larguraColunas[2] + larguraColunas[3] + larguraColunas[4], posicaoY);
        });
      
        // Adicionar rodapé
        const pageHeight = doc.internal.pageSize.height;
        doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 10, pageHeight - 10);
      
        // Salvar o PDF
        doc.save(`relatorio_${this.relatorios[0].grupo?.descricao}.pdf`);
      }
    )

    
  }

  gerarRelatorioPorGrupo(){

  }


  gerarRelatorioPorCategoria(){
    
  }

}
