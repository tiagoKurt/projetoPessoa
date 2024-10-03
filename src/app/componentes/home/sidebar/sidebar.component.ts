import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button'
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DockModule } from 'primeng/dock';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenubarModule,  DockModule, CommonModule, FormsModule,  CommonModule,  SidebarModule, ButtonModule, RouterModule, MatSidenavModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit{
  sidebarVisible: boolean = false;

  items: MenuItem[] | undefined;
  items2: MenuItem[] | undefined;

  position: 'bottom' | 'top' | 'left' | 'right' = 'left';


  ngOnInit() {
      this.items = [
          {
              label: 'Home',
              icon: 'assets/icons/botao-de-inicio.png',
              routerLink: '/'
          },
          {
              label: 'pessoas',
              icon: 'assets/icons/grupo-de-usuarios.png',
              routerLink: 'pessoas/listar'
          },
          {
              label: '',
              icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png'
          },
          {
              label: '',
              icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png'
          }
      ];

      this.items2 = [
          {
              label: 'Página inicial',
              icon: 'pi pi-home',
              routerLink: '/'
          },
          {
              label: 'pessoas',
              icon: 'pi pi-users',
              items: [
                {
                    label: 'Listar',
                    icon: 'pi pi-list',
                    routerLink: '/pessoas/listar'
                },
                {
                    label: 'Cadastrar',
                    icon: 'pi pi-plus-circle',
                    routerLink: '/pessoas/formulario'
                }
              ]
          },
          {
            label: 'Grupos',
            icon: 'pi pi-sitemap',
            items: [
              {
                  label: 'Listar',
                  icon: 'pi pi-list',
                  routerLink: '/grupos/listar'
              }
            ]
        },
        {
          label: 'Metas',
          icon: 'pi pi-lock',
          items: [
            {
                label: 'Listar',
                icon: 'pi pi-list',
                routerLink: '/metas/listar'
            }
          ]
        },
        {
          label: 'Lancamentos',
          icon: 'pi pi-money-bill',
          items: [
            {
                label: 'Listar',
                icon: 'pi pi-list',
                routerLink: '/lancamentos/listar'
            }
          ]
        }
      ];
  }
}
