import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LeagueComponent } from './components/league/league.component';
import { LeaguesComponent } from './components/leagues/leagues.component';
import { RegisterComponent } from './components/register/register.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { UsersComponent } from './components/users/users.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { LoginComponent } from './components/login/login.component';
import { StadisticsComponent } from './components/stadistics/stadistics.component';
import { AccountComponent } from './components/account/account.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { GraphicReportComponent } from './components/graphic-report/graphic-report.component'

const routes: Routes = [
  {
    path: "", redirectTo: "login", pathMatch: "full"
  },
  {
    path: "league",
    canActivate:[UserGuard],
    component: LeagueComponent
  },
  {
    path: "leagues",
    canActivate: [UserGuard],
    component: LeaguesComponent
  },
  {
    path: "register", component: RegisterComponent
  },
  {
    path:"account", canActivate: [UserGuard], component: AccountComponent
  },
  {
    path: "home",
    canActivate:[UserGuard],
    component: HomeComponent
  },
  {
    path:"homeAdmin", component: HomeAdminComponent
  },
  {
    path:"users", canActivate: [AdminGuard], component: UsersComponent
  },
  {
    path:"tournaments", component: TournamentsComponent
  },
  {
    path:"login",
    //canActivate:[UserGuard],
    component: LoginComponent
  },
  {
    path:"stadistics", canActivate: [UserGuard], component: StadisticsComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
