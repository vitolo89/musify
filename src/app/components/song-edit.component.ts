import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Artist } from '../models/artist';
import { Song } from '../models/song';
import { Album } from '../models/album';


//services
import { UserService} from '../services/user.service';
import { UploadService} from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';




@Component({
selector: 'song-edit',
templateUrl: '../views/song-add.html',
providers: [UserService, AlbumService, SongService, UploadService]
})
export class SongEditComponent  {

  public titulo: string;
  public song: Song;
  public album: Album;
  public is_edit;
  public identity;
  public token;
  public url: string;
  public alertMessage;


  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService,
    private _uploadService: UploadService
  ) {

    this.titulo = 'Editar cancion';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song( 1, '', '' , '', '');
    this.album = new Album('', '', 2017 , '', '');
    this.is_edit = true;


  }

  ngOnInit() {
    console.log('song-edit.Component cargado...');
    this.getSong();


  }

  getSong(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._songService.getSong(this.token, id).subscribe(
        response => {
          if(!response.song){
              this._router.navigate(['']);
          }else{
            this.song = response.song;
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
      let id = params['id'];

      console.log(this.song);


      this._songService.editSong(this.token, id, this.song).subscribe(

          response => {
            if(!response.song){
              this.alertMessage = 'Error en el servidor';

            }else{
              this.alertMessage = 'La cancion se ha actualizado correctamente';

              //subir el fichero de audio
              if(!this.filesToUpload){
                  this._router.navigate(['/album', response.song.album]);

              }else{

                  this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id, [], this.filesToUpload, this.token, 'file')
                  .then(
                    (result) => {
                      this._router.navigate(['/album', response.song.album]);
                      //subir la imagen del album
                    },
                    (error) =>{

                      console.log(error);
                    }
                  );
              }



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

  public filesToUpload;
  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
