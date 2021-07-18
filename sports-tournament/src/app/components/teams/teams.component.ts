import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { League } from 'src/app/models/league';
import { Team } from 'src/app/models/team';
import { CONNECTION } from 'src/app/services/global';
import { RestLeagueService } from 'src/app/services/restLeague/rest-league.service';
import { RestTeamService } from 'src/app/services/restTeam/rest-team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  teams: Array<Team> = [];
  teamId: string = "";
  league: League;
  team: Team;
  uri;
  filesImage: Array<File> = [];

  constructor(private restTeam: RestTeamService, private restLeague: RestLeagueService) { 
    this.league = new League("",'',[],[],[]);
    this.team = new Team("","",'');
    this.uri = CONNECTION.URI;
  }

  ngOnInit(): void {
    this.league = JSON.parse(localStorage.getItem("league")!);
    this.teams = this.league.teams;
  }

  ngDoCheck(){
    this.league = JSON.parse(localStorage.getItem("league")!);
    this.teams = this.league.teams;
  }

  onSubmit(teamsForm: NgForm){
    let teamToUpdate:any = this.team;
    delete teamToUpdate._id;
    delete teamToUpdate.__v;
    delete teamToUpdate.img;
    this.restTeam.updateTeam(teamToUpdate,this.teamId).subscribe((resp:any)=>{
      if(resp.team){
        if(this.filesImage.length == 0 || null || undefined){
          Swal.fire({
            icon: 'success',
            title: 'Equipo actualizado exitosamente'
          })
          teamsForm.reset();
          let league = JSON.parse(localStorage.getItem("league")!);
          this.restLeague.getLeague(league._id).subscribe((resp: any)=>{
          if(resp.league){
            localStorage.setItem("league",JSON.stringify(resp.league));
          }else{
            Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: "Error al refrescar"
            })
          }
          })
        }else{
          this.restTeam.addTeamImage(this.teamId,[],this.filesImage,"img").then((resp:any)=>{
            if(resp.team){
              Swal.fire({
                icon: 'success',
                title: 'Equipo actualizado exitosamente'
              })
              teamsForm.reset();
              let league = JSON.parse(localStorage.getItem("league")!);
              this.restLeague.getLeague(league._id).subscribe((resp: any)=>{
              if(resp.league){
                localStorage.setItem("league",JSON.stringify(resp.league));
              }else{
                Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: "Error al refrescar"
                })
              }
              })
            }else{
              Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: resp.message
              })
            }
          },
          (error: any) =>{
            Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: error.error.message
            })
          }
          )
        }
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

  setTeamInfo(team: any){
    this.team = team;
    this.teamId = team._id;
  }

  clearTeamInfo(){
    this.team = new Team("","",'');
    this.teamId = "";
  }

  fileChange(fileInput){
    this.filesImage = <Array<File>>fileInput.target.files;
    Swal.fire({
      icon: 'success',
      title: 'Imagen cargada'
    })
  }

  deleteTeam(team){
    Swal.fire({
      title: "¿Eliminar el equipo '" + team.name + "' ?" ,
      text: "Esta acción no se puede remover",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          let league = JSON.parse(localStorage.getItem("league")!);
          this.restTeam.deleteTeam(team._id,league._id).subscribe((resp:any)=>{
            if(resp.team){
              Swal.fire({
                icon: 'success',
                title: 'Equipo eliminado permanente'
              })
            }
            this.restLeague.getLeague(league._id).subscribe((resp: any)=>{
            if(resp.league){
              localStorage.setItem("league",JSON.stringify(resp.league));
            }else{
              Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: "Error al refrescar"
              })
            }
            })
          },
           (error:any)=>{
            Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: error.error.message
            })
          })
        }else {
          this.clearTeamInfo();
        }
    });
  }

}