import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private url = `${environment.url}`;
    currentUser?: User;

    constructor(private http: HttpClient) { }

    get isLoggedIn(): boolean {
        return !!this.currentUser; // false if currentUser = undefined
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }
  
    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.url}/${id}`)
            .pipe(
                map((user: User) => {
                    this.currentUser = user;
                    return this.currentUser;
                })
            );
    }

    getUserToDelete(id: number): Observable<User> {
        return this.http.get<User>(`${this.url}/${id}`);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.url, user, httpOptions);
    }

    updateUser(user: User): Observable<void> {
        return this.http.put<void>(`${this.url}/${user.id}`, user, httpOptions);
    }

    updateCurrentUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.url}/${user.id}`, user, httpOptions)
            .pipe(
                map((user: User) => {
                    this.currentUser = user;
                    return this.currentUser;
                })
            );
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

}
