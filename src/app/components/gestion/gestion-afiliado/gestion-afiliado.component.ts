import { Component, OnInit } from '@angular/core';
import { AfiliadoService } from '../../../service/afiliado.service';
import { Afiliado } from '../../../models/afiliado';
import { LoginService } from '../../../service/login.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-afiliado',
  templateUrl: './gestion-afiliado.component.html',
  styleUrls: ['./gestion-afiliado.component.css']
})
export class GestionAfiliadoComponent implements OnInit {

  listaAfiliados: Array<Afiliado>;
  showModAfiliado: boolean = false;
  afiliado: Afiliado;
  usuarioSocio:Usuario;
  buscarUsuario:boolean = false;
  buscarAfiliado:boolean = false;
  validarImagen:boolean = false;

  constructor(
    private _servAfiliado: AfiliadoService,
    private _servUsuario: UsuarioService,
    public _servLogin: LoginService,
    private _toastr:ToastrService
  ) { 

    this.listaAfiliados = new Array<Afiliado>();
    this.afiliado = new Afiliado();
    this.usuarioSocio = new Usuario();
    this.getAfiliados();

  }

  /*Obtener afiliados*/
  public getAfiliados(){
    this.listaAfiliados = new Array<Afiliado>();
    this._servAfiliado.obtenerAfiliados().subscribe(
      (res) => {
        res.forEach(element => {
          Object.assign(this.afiliado, element);
          this.listaAfiliados.push(this.afiliado);
          this.afiliado = new Afiliado();
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /*Crear afiliado*/
  public crearAfiliado(){
    this._servAfiliado.agregarAfiliado(this.afiliado).subscribe(
      (res) => {
        //console.log(res);
        this._toastr.success("Afiliado Creado","Exito");
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al crear afiliado","Error");
      }
    )
    this.getAfiliados();
  }


  /*Modificar afiliado*/
  public modificarAfiliado(){
    this._servAfiliado.actualizarAfiliado(this.afiliado).subscribe(
      (res) => {
        //console.log(res);
        this._toastr.info("Afiliado Modificado","Modificado");
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al modificar usuario","Error");
      }
    )
    this.cancelarModificar();
    this.getAfiliados();
  }
  public mostrarModificar(afiliadoMod: Afiliado){
    this.afiliado = afiliadoMod;
    this.showModAfiliado = true;
    this.validarImagen = true;
  }
  public cancelarModificar(){
    this.afiliado = new Afiliado();
    this.showModAfiliado = false;
    this.validarImagen = false;
  }

  /*Eliminar afiliado*/
  public eliminarAfiliado(id: string){
    this._servAfiliado.eliminarAfiliado(id).subscribe(
      (res) => {
        //console.log(res);
        this._toastr.error("Afiliado Eliminado","Eliminado");
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al crear usuario","Error");
      }
    )
    this.getAfiliados();
  }
  /*crear socio*/
  public crearSocio(afiliado:Afiliado){
    this.usuarioSocio.usuario = afiliado.email;
    this.usuarioSocio.password = Math.round(Math.random()*10000000000).toString();
    this.usuarioSocio.activo = true;
    this.usuarioSocio.perfil = "socio";
    this._servUsuario.crearUsuario(this.usuarioSocio).subscribe(
      (result) => {
        //console.log(result);
        this._toastr.success("Cuenta de usuario creada","Exito");
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al crear usuario","Error");
      }
    )
  }

  onFilesChanges(files){
    this.validarImagen = false;
    console.log("Datos del archivo", files);
    if(files[0].size > 45000)
      this._toastr.error("La imagen es muy grande","Error");
    else{
      this.validarImagen = true;
      this._toastr.success("Imagen correcta","Exito");
      this.afiliado.imagen = files[0].base64;
    }
  }

  /*Validaciones*/
  public validarNombreUsuario(){
    this._servUsuario.buscarUsuario(this.afiliado.email).subscribe(
      (result) => {
        //console.log(result)
        if(result.status == 2)
          this.buscarUsuario = true;
        else
          this.buscarUsuario = false;
      },
      (error) => {
        //console.log(error);
        this._toastr.error("Ha ocurrido un error al validar el nombre de usuario","Error");
      }
    )
    this.validarEmailAfiliado();
  }

  public validarEmailAfiliado(){
    this._servLogin.buscarAfiliadoEmail(this.afiliado.email).subscribe(
      (result) => {
        //console.log(result);
        if(result.status == 2)
          this.buscarAfiliado = true;
        else
          this.buscarAfiliado = false;
      },
      (error) => {
        this._toastr.error("Ha ocurrido un error al validar el emial de afiliado","Error");
      }
    )
  }

  ngOnInit(): void {
  }

}
