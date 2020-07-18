import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Artist } from '../models/artist';
import { Song } from '../models/song';
import { Album } from '../models/album';


//services
import { UserService} from '../services/user.service';
import { GLOBAL } from '../services/global';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';




@Component({
selector: 'song-add',
templateUrl: '../views/song-add.html',
providers: [UserService, AlbumService, SongService]
})
export class SongAddComponent  {

  public titulo: string;
  public song: Song;
  public album: Album;

  public identity;
  public token;
  public url: string;
  public alertMessage;


  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService
  ) {

    this.titulo = 'Crear nueva cancion';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song( 1, '', '' , '', '');
    this.album = new Album('', '', 2017 , '', '');


  }

  ngOnInit() {
    console.log('song-add.Component cargado...');
    this.getAlbum();

  }

  getAlbum(){
    this._route.params.forEach((params: Params) =>{
      let id = params['album'];

      this._albumService.getAlbum(this.token, id).subscribe(

        response => {
            if(!response.album){
              console.log('album no existe');
            }else{
              this.album = response.album;
            }
        },

        error => {

        }

      );
    });
  }

  onSubmit(){


    this._route.params.forEach((params: Params) => {
      let album_id = params['album'];
      this.song.album = album_id;
      console.log(this.song);


      this._songService.addSong(this.token, this.song).subscribe(

          response => {
            if(!response.song){
              this.alertMessage = 'Error en el servidor';

            }else{
              this.alertMessage = 'La cancion se ha creado correctamente';
              this.song = response.song;

              console.log(this.alertMessage);
              this._router.navigate(['/editar-tema', response.song._id]);

            }

          },
          error =>{
              var errorMessage = <any>error;

              if(errorMessage != null){

                var body = JSON.parse(error._body);
                this.alertMessage = body.message;

              }

        }

      );
    });
  }
}
