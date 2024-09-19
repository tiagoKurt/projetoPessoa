import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IPessoa } from '../formulario/formulario.types';
import { FormularioServiceService } from '../formulario/formulario.service.service';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
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

  constructor(private formularioService: FormularioServiceService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formularioService.getPessoas().subscribe((data: IPessoa[]) => {
      this.pessoas = data;
    });
  }

}
