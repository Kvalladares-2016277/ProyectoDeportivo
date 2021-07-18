import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { LeagueComponent } from './components/league/league.component';
import { FormsModule } from '@angular/forms';
import { LeaguesComponent } from './components/leagues/leagues.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { UsersComponent } from './components/users/users.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { LoginComponent } from './components/login/login.component';
import { StadisticsComponent } from './components/stadistics/stadistics.component';
import { TeamsComponent } from './components/teams/teams.component';
import { AccountComponent } from './components/account/account.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchPipe } from './pipes/search.pipe';
import { RestUserService } from './services/restUser/rest-user.service';
import { RestLeagueService } from './services/restLeague/rest-league.service';
import { GraphicReportComponent } from './components/graphic-report/graphic-report.component';
import { ChartsModule } from 'ng2-charts'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    LeagueComponent,
    LeaguesComponent,
    RegisterComponent,
    HomeAdminComponent,
    UsersComponent,
    TournamentsComponent,
    LoginComponent,
    StadisticsComponent,
    TeamsComponent,
    AccountComponent,
    SearchPipe,
    GraphicReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    RestUserService,
    RestLeagueService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
