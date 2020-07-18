import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import user
import { UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.component';

//Import artist
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//import album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

//song-add
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

const APP_ROUTES: Routes = [

  { path: 'routePath', component: ArtistListComponent },
  { path: 'home', component: HomeComponent },
  { path: 'mis-datos', component: UserEditComponent },
  { path: 'artistas/:page', component: ArtistListComponent },
  { path: 'crear-artista', component: ArtistAddComponent },
  { path: 'editar-artista/:id', component: ArtistEditComponent },
  { path: 'crear-album/:artist', component: AlbumAddComponent },
  { path: 'editar-album/:id', component: AlbumEditComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'artista/:id', component: ArtistDetailComponent },
  { path: 'crear-tema/:album', component: SongAddComponent },
  { path: 'editar-tema/:id', component: SongEditComponent },
  { path: '**', component: HomeComponent }
];

export const APPROUTINGPROVIDES: any[] = [];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
