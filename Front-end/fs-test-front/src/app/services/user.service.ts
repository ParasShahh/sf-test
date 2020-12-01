import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8080/api/test/user';


  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }

  getUserBoard(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'x-access-token': this.tokenService.getToken() })
    };

    return this.http.get(this.userUrl, httpOptions);
  }


}
