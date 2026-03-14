import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { Signup } from './components/signup/signup';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ClientListComponent } from './components/admin/client-list/client-list.component';
import { ClientCreateComponent } from './components/admin/client-create/client-create.component';
import { ClientEditComponent } from './components/admin/client-edit/client-edit.component';
import { ProjectListComponent } from './components/admin/project-list/project-list.component';
import { ProjectCreateComponent } from './components/admin/project-create/project-create.component';
import { ProjectEditComponent } from './components/admin/project-edit/project-edit.component';
import { TicketListComponent } from './components/tickets/ticket-list/ticket-list.component';
import { TicketCreateComponent } from './components/tickets/ticket-create/ticket-create.component';
import { TicketDetailComponent } from './components/tickets/ticket-detail/ticket-detail.component';
import { TechnicienListComponent } from './components/admin/technicien-list/technicien-list.component';
import { TechnicienCreateComponent } from './components/admin/technicien-create/technicien-create.component';
import { TechnicienEditComponent } from './components/admin/technicien-edit/technicien-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { MainLayout } from './components/layout/main-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { TechnicienDashboard } from './components/technicien/dashboard';
import { ProjectList } from './components/projects/list/project-list';
import { ProjectDetailComponent } from './components/projects/detail/project-detail.component';
import { AdminUsers } from './components/admin/users/admin-users';
import { ContactFormComponent } from './components/contact/contact-form.component';
import { ContactInboxComponent } from './components/admin/contact-inbox/contact-inbox.component';
import { ClientMessagesComponent } from './components/client/client-messages/client-messages.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: Signup },
    {
        path: '',
        component: MainLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
            { path: 'admin/dashboard', component: AdminDashboardComponent },
            { path: 'admin/users/pending', component: AdminUsers },
            { path: 'admin/clients', component: ClientListComponent },
            { path: 'admin/clients/new', component: ClientCreateComponent },
            { path: 'admin/clients/edit/:id', component: ClientEditComponent },
            { path: 'admin/techniciens', component: TechnicienListComponent },
            { path: 'admin/techniciens/new', component: TechnicienCreateComponent },
            { path: 'admin/techniciens/edit/:id', component: TechnicienEditComponent },
            { path: 'admin/projects', component: ProjectListComponent },
            { path: 'admin/projects/new', component: ProjectCreateComponent },
            { path: 'admin/projects/edit/:id', component: ProjectEditComponent },
            { path: 'admin/messages', component: ContactInboxComponent },
            { path: 'dashboard', component: Dashboard },
            { path: 'projects', component: ProjectList },
            { path: 'projects/:id', component: ProjectDetailComponent },
            { path: 'contact', component: ContactFormComponent },
            { path: 'client/messages', component: ClientMessagesComponent },
            { path: 'technicien-dashboard', component: TechnicienDashboard },
            { path: 'tickets', component: TicketListComponent },
            { path: 'tickets/all', component: TicketListComponent },
            { path: 'tickets/new', component: TicketCreateComponent },
            { path: 'tickets/assigned', component: TicketListComponent },
            { path: 'tickets/:id', component: TicketDetailComponent },
        ]
    },
    { path: '**', redirectTo: 'login' }
];
