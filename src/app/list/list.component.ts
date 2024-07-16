import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColumnKeys, user_VV } from '../interfaces/verdeventura.interfaces';
import { VVService} from '../list/users_verdeventura.service'
import { tap } from 'rxjs';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-user-list',
  templateUrl: '../user-list/user-list.component.html',
  styleUrls: ['../user-list/user-list.component.css']
})
export class ListComponent implements OnInit {
  users = signal<user_VV[]>([]);

  displayedColumns: ColumnKeys<user_VV> = ['id', 'name', 'email', 'CP','rol', 'points', 'group'];
  sortables: ColumnKeys<user_VV> = ['id', 'name', 'email'];


  private readonly _user_VVSvc = inject(VVService);
  private readonly _destroyRef = inject(DestroyRef);  

  ngOnInit(): void {
    this.getAllUsers();
  }


  getAllUsers() {
    this._user_VVSvc.getAllUsers()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap((users:user_VV[]) => this.users.set(users))
      )
    .subscribe()
  }
}
