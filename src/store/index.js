import Vue from 'vue'
import Vuex from 'vuex'

import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
/*
    modules: {
      example
    }
*/
	state:{
      arrayjugadors:[
        // {nom: "AA",  total: 0, posicio: null },
        // {nom: "BBB", total: 0, posicio: null },
        // {nom: "CCC", total: 0, posicio: null },
        // {nom: "DDD", total: 0, posicio: null },
      ],

      nouJugador: {},

      ultimaPartida: 0,

      camps:[
        {name: "posicio",   field: "posicio", label: "Pos",   align: "center" , style: "width: 15px"},
        {name: 'jugador', field: 'nom',   label: 'Jugador', align: 'left', style: "width: 200px;"},
        {name: "total",   field: "total", label: "Total",   align: "center" , style: "width: 50px"}
      ],

      
      ordrePuntuacio: 'ordreMenorPuntuacio'

	},

	


	actions:{

		// *****  ACCIONS DEL MENU *****

		actionSeleccionarOrdre: function (context, str_ordre) {
			//console.log("actionSeleccionarOrdre. str_ordre = " + str_ordre);
			context.commit('mutationSeleccionarOrdre', str_ordre);
		},

		actionEliminarPartides: function (context) {
			context.commit('mutationEliminarPartides_campsPartides');
			context.commit('mutationEliminarPartides_jugadorsPartides');
		},




		// *****  ACCIONS DEL LA PAGINA *****

		actionAfegirJugador: function(context, payload){
			context.commit('mutationAfegirJugador', payload);
		},

		
		actionEliminarJugador: function (context, str_nomJugador){
          console.log("actionEliminarJugador");
          
          for(var i = 0; i < context.state.arrayjugadors.length; i++){
            console.log("\tnom: " + context.state.arrayjugadors[i].nom);
            if(context.state.arrayjugadors[i].nom == str_nomJugador){
            	context.commit('mutationEliminarJugador', i);
            }
          }


		},


		actionGenerarNovaPartida: function (context) {
			//generacio nou camp - capçalera de columna
			context.commit('mutationGenerarNovaPartida_Camp');

			// generacio de nova partida per cada jugador
			context.commit('mutationGenerarNovaPartida_Jugadors');
		},

		actionSumatori: function (context, payload) {
			context.commit('mutationSumatori', payload);
		},


	    actionCalculaPosicio: function(context){

	      //console.log("*** actionCalculaPosicio ***");

	      var arrTotals = [];

	      for(var i=0; i<context.state.arrayjugadors.length; i++){
	        if(context.state.arrayjugadors[i].total != null){  // al crear el jugador el total es 'undefined'
	          arrTotals.push(context.state.arrayjugadors[i].total); 
	        }
	      }

	      //console.log("ordre posicio: " + context.state.ordrePuntuacio)
	      if (context.state.ordrePuntuacio == "ordreMenorPuntuacio"){
	        arrTotals.sort(function(a, b){return a-b});   // Sort numbers in an array in ascending order
	      }else{
	        arrTotals.sort(function(a, b){return b-a});   // Sort numbers in an array in descending order
	      }




	      // ---- treure valors duplicats -----
          for (var i = 1; i < arrTotals.length; ) {
            if (arrTotals[i-1] === arrTotals[i])
                arrTotals.splice(i,1);
            else
                i++;
	      }
	      // ---- FINAL treure valors duplicats -----
	

	      
	      for(var i=0; i<context.state.arrayjugadors.length; i++){
	        // context.state.arrayjugadors[i].posicio = null;
	        var posicio;
	        if (context.state.arrayjugadors[i].total != null){
	          //console.log("context.state.arrayjugadors["+i+"].total: " + context.state.arrayjugadors[i].total);
	          for(var j=0; j<arrTotals.length; j++){  
	            //console.log("\tarrTotals("+j+"):" + arrTotals[j]);
	            if ((context.state.arrayjugadors[i].total == arrTotals[j])) {
	              posicio = j + 1;
	              //console.log("\t\tposicio: " + posicio);
	            }
	            
	          }
	          
	          context.commit('mutationCalculPosicio', {
	          											numFila: i,
	          											posicio: posicio
	          										  });
	          //context.state.arrayjugadors[i].posicio = posicio;
	          //console.log("------------------------");
	        }
	      }

	    }

	},

	mutations:{
		
		// *****  MUTACIONS DEL MENU *****
		mutationSeleccionarOrdre: function(context, str_ordre){
			//console.log("mutationSeleccionarOrdre. str_ordre = " + str_ordre);
			context.ordrePuntuacio = str_ordre;
		},

		mutationEliminarPartides_campsPartides: function (context) {
			context.camps = context.camps.splice(0,3);
		},

		mutationEliminarPartides_jugadorsPartides: function (context) {
            for(var i = 0; i < context.arrayjugadors.length; i++){
                // posem a zero el valor de la propietat "total" i a null el valor de "posicio"
                context.arrayjugadors[i].total = 0;
                context.arrayjugadors[i].posicio = null;

                for (var propietat in context.arrayjugadors[i]){
                  
                  // per a la propietat que comenci per P i que el seu valor no sigui null
                  if (propietat.startsWith("P")){
                    delete context.arrayjugadors[i][propietat];
                  }
                }
            }
            context.ultimaPartida = 0;

		},


		// *****  MUTACIONS DE LA PAGINA *****


		mutationAfegirJugador: function(context, payload){

			// a context.nouJugador afegim les propietats basiques: nom, total i posicio
			console.log("--- mutation afegir jugador ---");

			//context.nouJugador.nom = payload.nomJugador;
			Vue.set(context.nouJugador, "nom", payload.nomJugador);
			//console.log("Vue.set NOM: ok");
			
			//context.nouJugador.total = 0;
			Vue.set(context.nouJugador, "total", 0);
			//console.log("Vue.set TOTAL: ok");
			
			//context.nouJugador.posicio = null;
			Vue.set(context.nouJugador, "posicio", null);
			//console.log("Vue.set POSICIO: ok");

			
			console.log("context.nouJugador.nom: " + context.nouJugador.nom);
			//console.log("payload: " + JSON.stringify(payload));
			//console.log("... fins abans d'afegir partides");
	        
	        // afegim tants camps com partides s'hagin fet
	        console.log("nº partides fetes: " + context.ultimaPartida);
	        for(var i = 1; i <= context.ultimaPartida; i++){
	        	//Vue.set(context.nouJugador, ["P" + i], {valor: null});
				//context.nouJugador["P" + i] = {valor: null};
				context.nouJugador["P" + i] = null;
	        	//Vue.set(context.nouJugador, ["P" + i], {});
				//console.log( "\tVue.set P" + i + ": ok");
	        	//context.nouJugador["P" + i] = {valor: null, edicio: false};
	        }

			console.log("context.nouJugador: " + JSON.stringify(context.nouJugador) + "\nFA EL PUSH");
				
			new Promise(function (resolve, reject){
				context.arrayjugadors.push(context.nouJugador);
				resolve("Success!");
			}).then(function(msgExit){
				console.log("esta en el THEN. Missatge de exit: " + msgExit);
				//context.nouJugador.nom = "";
		        context.nouJugador = {};

			});
				//console.log("nouJugador abans: " + JSON.stringify(context.nouJugador));
				


			//console.log("nouJugador despres: " + JSON.stringify(context.nouJugador));
		},

		mutationEliminarJugador: function (context, num){
          //console.log("mutationEliminarJugador. Num = " + num);
          var jugadorEliminat = context.arrayjugadors.splice(num,1);
          //console.log('jugador eliminat: ' + JSON.stringify(jugadorEliminat));			

		},

		mutationGenerarNovaPartida_Camp: function (context){
			
			context.ultimaPartida++;

			var nouCamp = {name: "Part" + context.ultimaPartida, field: "P" + context.ultimaPartida, label: "__  P" + context.ultimaPartida + "  __", align: "center", style: 'width: 15px'}
			
			if (context.ultimaPartida == 1){
				// afegim un camp mes a la taula que sera la corresponent a la 1ª nova partida
				context.camps.push(nouCamp);
			}else{  
				// la resta de partides noves s'inseriran despres del camp TOTAL (les antigues partides s'aniran desplaçant cap la dreta a la taula)
				context.camps.splice(3,0,nouCamp);
			}

		},

		mutationGenerarNovaPartida_Jugadors: function (context){
	      // Creacio de les dades dels jugadors del nou CAMP
	      // per cada jugador, 
	      for(var i = 0; i < context.arrayjugadors.length; i++){
	        // es crea l'objecte "partida" amb el nom Px 
	        //context.arrayjugadors[i] = Object.assign({}, context.arrayjugadors[i], {["P" + numPartida]:{ valor: null, edicio: false }});
	        //context.arrayjugadors[i]["P" + context.ultimaPartida] = {valor: null, edicio: false};

	        //context.arrayjugadors[i]["P" + context.ultimaPartida] = {valor: null};
	        context.arrayjugadors[i]["P" + context.ultimaPartida] = null;
	        console.log("arrayjugadors[" + i + "]: " + JSON.stringify(context.arrayjugadors[i]));
	        //Vue.set(context.arrayjugadors[i], "P" + context.ultimaPartida, null);
	      }
		},

		mutationSumatori: function (context, payload) {
			//console.log("mutationSumatori2. Suma = " + payload.suma);
			context.arrayjugadors[payload.numFila]["total"] = payload.suma;
		},

		mutationCalculPosicio: function (context, payload) {
			//console.log('mutationCalculPosicio. Posicio = ' + payload.posicio);
			context.arrayjugadors[payload.numFila].posicio = payload.posicio;
		}

	}





  })

  return Store
}
