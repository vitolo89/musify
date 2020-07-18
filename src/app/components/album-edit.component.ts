import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';

//services
import { UserService} from '../services/user.service';
import { GLOBAL } from '../services/global';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';



@Component({
selector: 'album-edit',
templateUrl: '../views/album-add.html',
providers: [UserService, AlbumService, UploadService, ArtistService]
})
export class AlbumEditComponent implements OnInit {

  public titulo: string;
  public album: Album;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;


  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _albumService: AlbumService,
    private _uploadService: UploadService



  ) {

    this.titulo = 'Editar Album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '', 2017 , '', '');
    this.is_edit = true;
    this.artist = new Artist("","","");


  }

  ngOnInit() {

    this.getAlbum();
  }

  getArtist(){
    this._route.params.forEach((params: Params)=>{
      let id = params['artist'];

      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if(!response.artist){
            console.log('no existe el artista');
          }else{
            this.artist = response.artist;

          }
        },

        error =>{

        }
      )
    });

  }

  getAlbum(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id).subscribe(

        response => {


          if(!response.album){

            this._router.navigate(['/']);

          }else{
          this.album = response.album;


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

  onSubmit(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];


      this._albumService.editAlbum(this.token,id, this.album).subscribe(

          response => {
              if(!response.album){
                this.alertMessage = 'Error en el servidor';
              }else{
                this.alertMessage = 'El album se ha creado correctamente';
                if(!this.filesToUpload){
                  //redirigir
                  this._router.navigate(['/artista', response.album.artist]);


                }else{
                  this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                  (result) => {
                                      this._router.navigate(['/artista', response.album.artist]);
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
                console.log(error);

              }

        }

      );

    });
  }

  public  filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
