import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, Sidebar, Header],
    templateUrl: './main-layout.html',
    styleUrls: ['./main-layout.css']
})
export class MainLayout { }
