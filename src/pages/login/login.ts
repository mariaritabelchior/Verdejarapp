import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { NewaccountPage } from '../newaccount/newaccount';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { StorageProvider } from '../../providers/storage/storage';
import { IUsuario } from '../../interfaces/IUsuario';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	_customer: IUsuario = {
		email: '',
		password: '',
		token: ''
	};

	tmpToken = [];
	
	loading;
	
	constructor(public navCtrl: NavController, public navParams: NavParams,
		public menuCtrl: MenuController, public customerProvider: UsuarioProvider, 
		public storageProvider: StorageProvider,
		public toastController: ToastController,public loadingCtrl: LoadingController
		) {
			this.storageProvider.GetStorage('VerdejarUser').then(val => {
				if(val) {
					this.presentLoading();
					this.storageProvider.SetStorage('VerdejarUser', null);
					this.menuCtrl.enable(false, 'auth');
					this.menuCtrl.enable(true, 'unauth');
					this.dismissLoading();
					this.navCtrl.setRoot(LoginPage);
				}	
			})
	}

    ionViewDidLoad() {
	}

	registerLink(param) {
		this.navCtrl.push('NewaccountPage', { param });
	}

	login() {		
		this.presentLoading();
		this.customerProvider.loginCustomer(this._customer).subscribe(res => {
				this._customer = res;
				console.log(res);
				if(res){
					this.GetUserData(this._customer.token);	
				}	
				else{
					this.dismissLoading();
				}

			},
				erro => {
					this.dismissLoading();
					console.log(erro.text);
					this.presentToast(erro.error, 'middle');
			}
		)

	}


	GetUserData(token:string){
		this.customerProvider.UserData(token).subscribe(retorno => {
				//Salva os dados dentro do banco de dados
				this._customer = retorno;
				this._customer.token = token;
				this.storageProvider.SetStorage('VerdejarUser', this._customer);
				this.menuCtrl.enable(true, 'auth');
				this.menuCtrl.enable(false, 'unauth');
				this.dismissLoading();
				this.navCtrl.setRoot('HomePage');
			}
			,
			erro => {
				this.dismissLoading();
				this.presentToast(erro.error, 'middle');
			}
		
		);
	}

	presentToast(msg: string, pPosition: string) {
		let toast = this.toastController.create({
			message: msg,
			duration: 3000,
			position: pPosition
		});
		toast.present();
	}
	
	presentLoading() {
		if(!this.loading){
			this.loading = this.loadingCtrl.create();
			this.loading.present();
		}
	}

	dismissLoading(){
		if(this.loading){
			this.loading.dismiss();
			this.loading = null;
		}
	}
}
