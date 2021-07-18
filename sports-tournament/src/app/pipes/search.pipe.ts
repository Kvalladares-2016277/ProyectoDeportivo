import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(users: any, search: any): any {
    if(search != undefined && users != undefined){
      return users.filter(user =>{
        return user.username.toLowerCase().includes(search.toLowerCase());
      })
    }else{
      return users;
    }
  }

}
