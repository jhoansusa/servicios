


$(function()
{

	var fecha = new Date();
	var hora = new Date();
	fecha =fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear();
	hora = hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds();	
	var fechaHora = fecha+" "+ hora;
	var cont = 1;
	var contador = 0;


	var img = sessionStorage.getItem('profileImageURL');	 

	sessionStorage.getItem('displayName');	
	$('#imagen').attr('src', sessionStorage.getItem('profileImageURL'));
	$('#usuarioLo').val(sessionStorage.getItem('displayName'));
	var cont =0;
	var objFireBase = new Firebase("https://chatucc2.firebaseio.com/");
	
	$('#btnEnviarMsj').click(clickEnvio);

	$('#btnLoginTwitter').click(clickAutenticarTwitter);

	$('#btnLoginFacebook').click(clickAutenticarFB);

	$('#btnIngresar').click(clickIngresar);	

	function clickAutenticarFB()
	{
		objFireBase.authWithOAuthPopup("facebook", function(error, authData) 
		{	
  			if(error) 
  			{
  				console.log("Login Failed!", error);
  			} 
  			else 
  				{
  					window.location.href="chat.html";
  					sessionStorage.setItem('token', authData.token);
					sessionStorage.setItem('profileImageURL', authData.facebook.profileImageURL);
					sessionStorage.setItem('displayName', authData.facebook.displayName);
					sessionStorage.setItem('username', authData.facebook.displayName);
  					
  				}
		});

	}



	function clickAutenticarTwitter()
	{
		objFireBase.authWithOAuthPopup("twitter", function(error, authData) 
		{	
  			if(error) 
  			{
  				console.log("Login Failed!", error);
  			} 
  			else 
  				{
  					 window.location.href="chat.html";
  					 sessionStorage.setItem('token', authData.token);
					 sessionStorage.setItem('profileImageURL', authData.twitter.profileImageURL);
					 sessionStorage.setItem('displayName', authData.twitter.displayName);
					 sessionStorage.setItem('username', authData.twitter.username);
  				}
		});

	}


	function clickEnvio()
	{
		var mensaje = $('#inMensaje').val();
		
		var autor = sessionStorage.getItem('displayName');	;		

		console.log("si");


		objFireBase.push(
			{
		 		autor: autor,	  		
		    	mensaje: mensaje,
		    	img: img,
		    	fechaHora: fechaHora
		    	
	  		}
	  	);
	  	console.log(mensaje);
	}

	objFireBase.on("child_added", function(data){
		var registro = data.val();
		$('#mensaje').prepend(getPlantilla(registro.autor, registro.mensaje,registro.img, registro.fechaHora));

		function getPlantilla(autor, mensaje, img, fechaHora)
		{
			if(contador=="0")
			{
				var plantilla = '<div class="caja1"><div id="div'+cont+'" class="avatar"><table><tr><td><figure><img src="'+img+'" alt=""></figure></td><td><textarea id="aut'+cont+'" disabled="disabled" rows="4" cols="20" class="autor">'+autor+'</textarea></td></tr></table></div><div><textarea  class="mensaje" id="men'+cont+'" rows="4" cols="71">'+ mensaje +'</textarea></div><table><tr><td><div class="hora"><label for="">'+fechaHora+'</label></div></td><td><div class="estrella"><a class="estrellita" href="#" onclick="favorito('+cont+')"></a></div></td></tr></table></div></div><br>';
				contador= 1;
				
			}
			else
			{
				var plantilla = '<div class="caja2"><div id="div'+cont+'" class="avatar"><table><tr><td><textarea disabled="disabled" id="aut'+cont+'" class="autor">'+autor+'</textarea></td><td><figure><img src="'+img+'" alt=""></figure></td></tr></table></div><div><textarea class="mensaje" id="men'+cont+'" rows="4" cols="71">'+ mensaje +'</textarea></div><table><tr><td><div class="hora"><label for="">'+fechaHora+'</label></div></td><td><div class="estrella"><a class="estrellita" href="#" onclick="favorito('+cont+')"></a></div></td></tr></table></div></div><br>';
				contador= 0;
				
			}
			cont ++;

			//$('.cont-mensajes-timeline').prepend(plantilla);
			$('#inMensaje').val(""); 
			return plantilla;

		}

	}

		)

	function clickIngresar(){	
		var txtUsuario = $("#txtUsuario").val();
		var txtContrasena = $("#txtContrasena").val();
		if(txtUsuario == ''){
			alert("Debe Ingresar un Usuario.");
			$("#txtUsuario").focus();
		}
		else if(txtContrasena == ''){
			alert("Debe Ingresar una Contraseña.");
			$("#txtContrasena").focus();
		}
		else{			
			window.location.href = "chat.html?txtUsuario="+txtUsuario; 
		}
		
		
	}

	

});


function favorito(id)
{
	var usuario = $("#aut"+id).val();
	var men = $("#men"+id).val();	
	var plantilla = '<br><div class="fav" id="favorito'+id+'"><div class="fav-usuario"><label>'+usuario+'</label></div><table><tr><td><div><label>'+men+'</label></div></td><td><div class="estrella2"><a class="estrellita" href="#" onclick="eliminarFavorito('+id+')"></a></div></td></div></tr></table><BR><BR>';
	$(".caja-favoritos").append(plantilla);

}

function eliminarFavorito (id) 
{
	$("#favorito"+id).remove();
}