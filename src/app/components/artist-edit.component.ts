import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Artist } from '../models/artist';

//services
import { UserService} from '../services/user.service';
import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';


@Component({
selector: 'app-artist-edit',
templateUrl: '../views/artist-add.html',
providers: [UserService, ArtistService, UploadService]
})
export class ArtistEditComponent implements OnInit {

public titulo: string;
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
  private _uploadService: UploadService


) {

  this.titulo = 'Editar Artista';
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getToken();
  this.url = GLOBAL.url;
  this.artist = new Artist('','','');
  this.is_edit = true;

}

ngOnInit() {
  console.log('artist-edit.components.ts cargado');
  //Llamar al metodo del api para sacar un artista en base a su id getArtist
  this.getArtist();
}

getArtist(){

  this._route.params.forEach((params: Params) => {
    let id = params['id'];

    this._artistService.getArtist(this.token, id).subscribe(
      response => {
          this.artist = response.artist;

          if(!response.artist){
            this._router.navigate(['/']);
          }else{
              this.artist = response.artist;

          }

      },

      error =>{
          var errorMessage = <any>error;

          if(errorMessage != null){

            var body = JSON.parse(error._body);
          //  this.alertMessage = body.message;

          }

      }
    );

  });
}

deleteAlbum(){
  
}


onSubmit(){

  this._route.params.forEach((params: Params) => {
  let id = params['id'];

    this._artistService.editArtist(this.token, id,this.artist).subscribe(
    response => {


      if(!response.artist){
        this.alertMessage = 'Error en el servidor';
      }else{
          this.alertMessage = 'El artista se ha actualizado correctamente!';

          if(!this.filesToUpload){
              this._router.navigate(['/artista', response.artist._id]);

          }else{

            this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, [], this.filesToUpload, this.token, 'image')
            .then(
              (result) => {
                this._router.navigate(['/artista', response.artist._id]);
              },
              (error) =>{
                console.log(error);
              }

            );

          }
          //Subir la imagen del artista


          //this.artist = response.artist;
        //this._route.navigate(['/editar-artista'], response.artist._id);

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

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any){

      this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
