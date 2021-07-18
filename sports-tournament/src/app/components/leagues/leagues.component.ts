import { Component, OnInit, DoCheck } from '@angular/core';
import { NgForm } from '@angular/forms';
import { League } from 'src/app/models/league';
import { RestLeagueService } from 'src/app/services/restLeague/rest-league.service';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.css']
})
export class LeaguesComponent implements OnInit {

  leagues: Array<League> = [];
  league: League;
  user = JSON.parse(localStorage.getItem("user")!);
  leagueId: string = "";

  constructor(private restLeague: RestLeagueService, private restUser: RestUserService) { 
    this.league = new League("",'',[],[],[]);
  }

  ngOnInit(): void {
    if(this.user.role == "ROLE_ADMIN"){
      this.loadLeaguesByAdmin();
    }else{
      this.loadLeaguesByUser();
    }
  }

  ngDoCheck(): void{
    if(this.user.role != "ROLE_ADMIN"){
      this.loadLeaguesByUser();
    }else{
      this.leagues = JSON.parse(localStorage.getItem("leagues")!);
    }
  }

  loadLeaguesByAdmin(){
    this.restLeague.getLeagues().subscribe((resp:any)=>{
      if(resp.league){
        localStorage.setItem("leagues",JSON.stringify(resp.league));
        this.leagues = JSON.parse(localStorage.getItem("leagues")!);
      }
    },
    (error:any) => 
      Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: error.error.message
      })
    )
  }

  loadLeaguesByUser(){
    let user = JSON.parse(localStorage.getItem("user")!);
    this.leagues = user.leagues;
    localStorage.setItem("leagues",JSON.stringify(user.leagues)!);
  }

  onSubmit(leagueForm: NgForm){
    let leagueToCreate:any = this.league;
    delete leagueToCreate._id;
    delete leagueToCreate.teams;
    delete leagueToCreate.reports;
    delete leagueToCreate.journey;
    this.restLeague.createLeague(this.league).subscribe((resp:any)=>{
      if(resp.league){
        Swal.fire({
          icon: 'success',
          title: 'Liga creada exitosamente'
        })
        leagueForm.reset();
        this.setInfoLocalStorage();
        this.leagues.push(resp.league);
        localStorage.setItem("leagues",JSON.stringify(this.leagues)!);
      }
    },
    (error:any)=>
      Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: error.error.message
      })
    )
  }

  setLeagueInfo(league:any){
    this.league = league;
    this.leagueId = league._id;
  }

  deleteLeagueInfo(){
    this.league = new League("",'',[],[],[]);
    this.leagueId = "";
  }

  updateLeague(updateLeagueForm: NgForm){
    let leagueToUpdate:any = this.league;
    delete leagueToUpdate.teams;
    delete leagueToUpdate.reports;
    delete leagueToUpdate.journey;
    delete leagueToUpdate.__v;
    delete leagueToUpdate._id;
    this.restLeague.updateLeague(leagueToUpdate,this.leagueId).subscribe((resp:any)=>{
      if(resp.league){
        Swal.fire({
          icon: 'success',
          title: 'Liga actualizada exitosamente'
        })
        updateLeagueForm.reset();
        this.setInfoLocalStorage();
        this.deleteLeagueInfo();
      }
    },
    (error:any) =>
      Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: error.error.message
      })
    )
  }

  deleteLeague(league: League){
    this.setLeagueInfo(league);
    let leagueToDelete:any = this.league;
    Swal.fire({
      title: "¿Eliminar la liga '" + leagueToDelete.name + "' ?" ,
      text: "Esta acción no se puede remover",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.restLeague.deleteLeague(this.leagueId).subscribe((resp:any)=>{
            if(resp.league){
            Swal.fire({
                icon: 'success',
                title: 'Liga eliminada permanente'
              })
              this.setInfoLocalStorage();
              this.deleteLeagueInfo();
            }
          },
            (error:any)=>{
            Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: error.error.message
            })
          })
        }else {
          this.deleteLeagueInfo();
        }
    });
  }

  setInfoLocalStorage(){
    if(this.user.role == "ROLE_CLIENT"){
      this.restUser.getUser(this.user._id).subscribe((resp:any)=>{
        if(resp.user){
          localStorage.setItem("user",JSON.stringify(resp.user));
        }
      },
      (error:any)=>
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: error.error.message
        })
      )
    }else{
      this.loadLeaguesByAdmin();
    }
  }

  sendLeagueInfo(league: League){
    localStorage.setItem("league",JSON.stringify(league)!);
  }

}