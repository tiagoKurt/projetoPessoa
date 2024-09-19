import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormularioServiceService } from './formulario.service.service';
import { IPessoa } from './formulario.types';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';

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
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {
  sexos: Sexo[] = [
    { sexo: 'Masculino' },
    { sexo: 'Feminino' }
  ];

  formDesabilitado = false;

  pessoas: IPessoa[] = [];

  pessoa: IPessoa = { id: null, nome: '', cpf: '', email: '', telefone: '' }

  constructor(
    private formularioService: FormularioServiceService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      // this.pessoa = this.formularioService.obterPessoaPorCpf(cpf);
      this.formDesabilitado = true;
    }
  }

  cadastrar(): void {

    this.formularioService.criarPessoa(this.pessoa).subscribe(
      (resposta) => {
        this.messageService.add({ severity: 'success', summary: 'Concluido!', detail: 'Usuario: '+ this.pessoa.nome+', foi cadatrada com sucesso!' });
        this.pessoa = { id: null, nome: '', cpf: '', email: '', telefone: '' };

      }, error => {
        console.log(this.pessoa.nome)
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Falha ao cadastrar o usuário.' });
      });
  }

  validateAgeInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 2 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
