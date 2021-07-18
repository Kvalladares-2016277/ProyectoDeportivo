import { Component, OnInit, DoCheck } from '@angular/core';
import { NgForm } from '@angular/forms';
import { League } from 'src/app/models/league';
import { Team } from 'src/app/models/team';
import { Journey } from 'src/app/models/journey';
import { RestJourneyService } from 'src/app/services/restJourney/rest-journey.service';
import { SoccerGame } from 'src/app/models/soccergame';
import { Report } from 'src/app/models/report';
import { RestReportService } from 'src/app/services/restReport/rest-report.service';
import { RestSoccerGameService } from 'src/app/services/restSoccerGame/rest-soccer-game.service';
import { RestLeagueService } from 'src/app/services/restLeague/rest-league.service';
import { RestTeamService } from 'src/app/services/restTeam/rest-team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-league',
  templateUrl:'./league.component.html',
  styleUrls: ["./league.component.css"]
})

export class LeagueComponent implements OnInit, DoCheck {

  report: Report;
  journey: Journey;
  journeysLeague: Array<Journey> = [];
  soccergame: SoccerGame;
  league: League;
  team: Team;
  teamsLeague: Array<Team> = [];
  filesImage: Array<File> = [];

  constructor(private restLeague: RestLeagueService, private restTeam: RestTeamService,
    private restJourney: RestJourneyService, private restSoccerGame: RestSoccerGameService,
    private restReport: RestReportService) {
    this.league = new League("",'',[],[],[]);
    this.team = new Team("","",'');
    this.journey = new Journey('','',[]);
    this.soccergame = new SoccerGame('','', '', [], 0, [], 0);
    this.report = new Report(0, 0, 0);
  }

  ngOnInit(): void {
    let league = JSON.parse(localStorage.getItem("league")!);
    this.restLeague.getLeague(league._id).subscribe((resp: any)=>{
      if(resp.league){
        localStorage.setItem("league",JSON.stringify(resp.league));
        this.league = JSON.parse(localStorage.getItem("league")!);
        this.teamsLeague = this.league.teams;
        console.log(this.league.journey);
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: "Error al obtener datos"
        })
      }
    })
  }

  ngDoCheck(): void {
    this.league = JSON.parse(localStorage.getItem("league")!);
    this.teamsLeague = this.league.teams;
    this.journeysLeague = this.league.journey;
  }

  onSubmit(teamForm: NgForm){
    let league = JSON.parse(localStorage.getItem("league")!)
    if(this.filesImage.length == 0 || null || undefined){
      Swal.fire({
        icon: 'error',
        title: '¡No hay imagen!',
        text: "Debe ingresar una imagen para poder agregar el equipo"
      })
    }else{
      if(league.teams.length < 10){
        let teamToCreate:any = this.team;
        delete teamToCreate._id;
        this.restTeam.createTeam(teamToCreate,league._id).subscribe((resp:any)=>{
          if(resp.team){
            let teamId = resp.team._id;
            this.restTeam.addTeamImage(teamId,[],this.filesImage,"img").then((resp:any)=>{
              if(resp.team){
                Swal.fire({
                  icon: 'success',
                  title: 'Equipo creado exitosamente'
                })
                if(league.teams.length > 0){

                  let journeyToCreate:any = this.journey;
                  delete journeyToCreate._id;
                  let league = JSON.parse(localStorage.getItem("league")!)
                  journeyToCreate.journey = league.name + ' - ' + ' Jornada ' + league.teams.length;
                  this.restJourney.createJourney(journeyToCreate, league._id).subscribe((resp:any)=>{
                    this.journeysLeague.push(resp.journey);
                    console.log(resp)
                    if(resp.journey){
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
                  })
                }
                teamForm.reset();
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
                text: error.message
              })
            }
            )
          }
        },
        (error: any) =>{
          Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: error.message
          })
        }
        )
      }else{
        Swal.fire({
          icon: 'warning',
          title: '¡Ups!',
          text: "Una liga no puede tener más de 10 equipos"
        })
      }
    }
  }

  createMatchDay(match_dayForm: NgForm){
    let teamOneId = match_dayForm.value.teamOne;
    let teamTwoId = match_dayForm.value.teamTwo;
    let journeyId = match_dayForm.value.journeyId;
    let soccerGameToCreate:any = this.soccergame;
    if(teamOneId == teamTwoId){
      Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: "Un equipo no puede competir contra él mismo."
      })
    }else{
      delete soccerGameToCreate._id;
      soccerGameToCreate.dateMatch = match_dayForm.value.dateMatch;
      soccerGameToCreate.timeMatch = match_dayForm.value.timeMatch;
      soccerGameToCreate.goalsTeamOne = match_dayForm.value.teamOneGoals;
      soccerGameToCreate.goalsTeamTwo = match_dayForm.value.teamTwoGoals;
      delete soccerGameToCreate.teamOne;
      delete soccerGameToCreate.teamTwo;

      this.restSoccerGame.createSoccerGame(soccerGameToCreate,teamOneId,teamTwoId,journeyId).subscribe((resp:any)=>{
        if(resp.soccerGame){
          let soccerGameId = resp.soccerGame._id;
          console.log(soccerGameId);
          if(soccerGameToCreate.goalsTeamOne == soccerGameToCreate.goalsTeamTwo){
            // team uno reporte

            this.report.goals = soccerGameToCreate.goalsTeamOne;
            this.report.goalsAgainst = soccerGameToCreate.goalsTeamTwo;
            this.report.score = 1;
            this.restReport.createReport(this.report, this.league._id, teamOneId, soccerGameId, journeyId).subscribe((resp:any)=>{
              console.log(resp);
              if(resp.report){
                // team dos reporte
                this.report.goals = soccerGameToCreate.goalsTeamTwo;
                this.report.goalsAgainst = soccerGameToCreate.goalsTeamOne;
                this.report.score = 1;
                this.restReport.createReport(this.report, this.league._id, teamTwoId, soccerGameId, journeyId).subscribe((resp:any)=>{
                  if(resp.report){
                    Swal.fire({
                      icon: 'success',
                      title: '¡Marcador y reporte agregado!'
                    })
                  }else{
                    Swal.fire({
                      icon: 'error',
                      title: '¡Ups!',
                      text: resp.message
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
            })
          }else if (soccerGameToCreate.goalsTeamOne > soccerGameToCreate.goalsTeamTwo){
                        // team uno reporte
                        console.log("hola")
                        this.report.goals = soccerGameToCreate.goalsTeamOne;
                        this.report.goalsAgainst = soccerGameToCreate.goalsTeamTwo;
                        this.report.score = 3;
                        this.restReport.createReport(this.report, this.league._id, teamOneId, soccerGameId, journeyId).subscribe((resp:any)=>{

                          if(resp.report){

                            // team dos reporte
                            this.report.goals = soccerGameToCreate.goalsTeamTwo;
                            this.report.goalsAgainst = soccerGameToCreate.goalsTeamOne;
                            this.report.score = 0;
                            this.restReport.createReport(this.report, this.league._id, teamTwoId, soccerGameId, journeyId).subscribe((resp:any)=>{
                              if(resp.report){
                                Swal.fire({
                                  icon: 'success',
                                  title: '¡Marcador y reporte agregado!'
                                })
                              }else{
                                Swal.fire({
                                  icon: 'error',
                                  title: '¡Ups!',
                                  text: resp.message
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
                        })
          }else if (soccerGameToCreate.goalsTeamOne < soccerGameToCreate.goalsTeamTwo){
                        // team uno reporte
                        this.report.goals = soccerGameToCreate.goalsTeamOne;
                        this.report.goalsAgainst = soccerGameToCreate.goalsTeamTwo;
                        this.report.score = 0;
                        this.restReport.createReport(this.report, this.league._id, teamOneId, soccerGameId, journeyId).subscribe((resp:any)=>{
                          if(resp.report){
                            // team dos reporte
                            this.report.goals = soccerGameToCreate.goalsTeamTwo;
                            this.report.goalsAgainst = soccerGameToCreate.goalsTeamOne;
                            this.report.score = 3;
                            this.restReport.createReport(this.report, this.league._id, teamTwoId, soccerGameId, journeyId).subscribe((resp:any)=>{
                              if(resp.report){
                                Swal.fire({
                                  icon: 'success',
                                  title: '¡Marcador y reporte agregado!'
                                })
                              }else{
                                Swal.fire({
                                  icon: 'error',
                                  title: '¡Ups!',
                                  text: resp.message
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
                        })
          }else{
            Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: resp.message
            })
          }
        }else{
          Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: resp.message
          })
        }
      })
    }

  }

  fileChange(fileInput){
    this.filesImage = <Array<File>>fileInput.target.files;
    Swal.fire({
      icon: 'success',
      title: 'Imagen cargada'
    })
  }
}
