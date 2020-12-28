<template>
<!-- 
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
  </q-page>
 -->

    <q-page class="flex flex-start">

      <div class=" column q-my-lg">

          <div class=" row inline justify-left q-ma-lg">
            <div class="clInput">
                <q-input
                  v-model="inputjugador"
                  type="text"
                  float-label="nom jugador"
                  clearable
                />
            </div>
            <div class="q-ml-lg">
                  <q-btn
                    color="primary"
                    glossy
                    icon="person_add"
                    round
                    @click="afegirJugador"
                  />
            </div>
          </div>



        
          <q-table
          :columns="camps"
          :data="jugadors"
          :pagination.sync="pagination"
          row-key="name"
          hide-bottom
          class="shadow-5 colorTaula flex"
          separator="cell"
          
          >
            <template slot="top-left" slot-scope="props" class="column">
              <q-btn 
                color="positive" 
                round 
                icon="exposure_plus_1"
                label = "nova partida"
                align="center" 
                class="q-mr-md"
                @click="generarNovaPartida()" />

            </template>
            

          
            <q-tr slot="body" slot-scope="props" :props="props">

              
              <q-td key="posicio" :props="props">
                <span :class="{guanyador: props.row.posicio==1}">
                {{ props.row.posicio }}
                </span>
              </q-td>

              <q-td key="jugador" :props="props">
                <q-btn size="sm" round dense color="negative" icon="delete" @click="eliminarJugador(props.row.nom)" class="q-mr-md" />

                <span :class="{guanyador: props.row.posicio==1}">{{ props.row.nom }}</span>
              </q-td>

               
              <q-td key="total" :props="props" class="colTotal">
                <!-- <q-chip small square color="amber" text-color="gray"></q-chip> -->
                {{ props.row.total }}
              </q-td>


              <q-td v-for="col in props.cols" v-if="col.name.startsWith('Part')" :key="col.name" :props="props">
              <!-- v-touch-pan="col.value.edicio=true" -->

                <!-- <span v-if="col.value.edicio==false" class="clasInTd"> {{ col.value.valor }} </span>
                <q-chip small square color="light"> -->
        
                {{ col.value }}

                <q-popup-edit 
                  v-model="props.row[col.field]" 
                  title="punts" 
                  color="red-14"
                  buttons
                  label-set="Ok"
                  label-cancel="Cancelar"
                  >
                  <q-input 
                    v-model="props.row[col.field]"
                    type="number"
                    align="center"
                    hide-underline
                    class="bg-blue-1"
                    @input="sumatori(props.row);"
                  />
                </q-popup-edit>

    <!-- v-model="col.value.valor" -->


    <!-- 
                <q-field

                >  
                  <q-input 
                    v-model="col.value.valor"
                    type="number"
                    align="center"
                    hide-underline
                    class="clInput bg-positive"
                    @change="sumatori2(props.row)"
                    @blur="sumatori2(props.row)"
                  />
                </q-field> -->

                <!-- </q-chip> -->

              </q-td>

            </q-tr>
            
          </q-table>



      </div>




    </q-page>


</template>



<script>
export default {
  name: 'PageIndex',

  data () {
    return {

      inputjugador: null,
      
      
      pagination: {
        rowsPerPage: 0 
      } 
    }
  },

  methods:{
  	afegirJugador: function(){

      if (this.inputjugador != null && this.inputjugador.length != 0){
        
        this.$store.dispatch('actionAfegirJugador', {
          nomJugador: this.inputjugador, 
        });
        this.inputjugador = null;


        this.$nextTick(function () {
          console.log("s'ha executat nextTick a 'afegirJugador'"); // => 'updated'
        }) 

      }

  	},

    eliminarJugador: function (nomJugador){

      this.$q.dialog({
        title: 'Confirmar',
        message: "Eliminar el jugador '" + nomJugador + "' ?",
        ok: true,
        cancel: true
      }).then(() =>  {
          console.log("Ok");
          this.$store.dispatch('actionEliminarJugador', nomJugador)
          .then(() => {
            this.$store.dispatch('actionCalculaPosicio');

            this.$q.notify({
              message: nomJugador + " eliminat",
              timeout: 2000
            });
          });

          
      }).catch(() =>  {
        console.log("No");
        this.$q.notify({
              message: "Ok. No eliminem a " + nomJugador,
              timeout: 2000
            });
      })
    },


    generarNovaPartida: function(){
      if (this.jugadors.length == 0) {
        alert ("Falten jugadors")
        return
      }
      
      this.$store.dispatch('actionGenerarNovaPartida');
      //this.ultimaPartida = numPartida;
    },


    sumatori: function(objFila){
      console.log("***** INICI SUMATORI *****");

      var suma = 0;
      // fem recorregut per totes les propitats
      for (var propietat in objFila){
        //console.log(propietat + ": " + JSON.stringify(objFila[propietat]));
        
        // suma totes les propietats que comencin per P i que el seu valor no sigui null
        //console.log("propietat: " + propietat +
           //"\tobjFila[propietat].valor: " + objFila[propietat].valor);
        
        //if (propietat.startsWith("P") && (objFila[propietat].valor != null)){
        if (propietat.startsWith("P") && (objFila[propietat] != null)){
         //suma += parseInt(objFila[propietat].valor);
         suma += parseInt(objFila[propietat]);
        }
      }

      console.log("suma: " + suma);
      //objFila.total = suma; 
      this.$store.dispatch('actionSumatori', {numFila: objFila.__index, suma: suma})
      .then(() => {
        this.$store.dispatch('actionCalculaPosicio');
      });

      //console.log("objFila.total: " + objFila.total);
      //console.log("***** FINAL SUMATORI 2 *****");
      //this.calculaPosicio();
    },



    // saved: function(val, initialValue){
    //   console.log("GUARDAR PUNTUACIO amb nou valor");
    // },

    // canceled: function(val, initialValue){
    //   console.log("CANCELAR PUNTUACIO. Conserva antic valor");
    // }

  },

  computed: {
    jugadors: function(){
      return this.$store.state.arrayjugadors;
    },

    camps: function(){
      return this.$store.state.camps;
    },

    ultimaPartida: function(){
      return this.$store.state.ultimaPartida;
    }

  }


}
</script>

<style>

.clInput{
  width: 150px;
}

.colorTaula{
  background-color: #f5f5f0;
}
.colTotal{
  font-size: 20px;
  font-weight: bold;
  background-color: #ff9;
  border: 2px solid black;
  /*padding: 3px;*/
}

.q-table thead th {
    color: white;
    background-color: black;
    /*white-space: normal;*/
    font-size: 15px;
}

.q-table tbody td{
  font-size: 16px;
}




.guanyador {
  color: red;
  font-size: 20px;
  font-weight: bold;
}
/*
q.table th{
  width: 20px;
}
.clInput {
  widthNo: 50%; 
}
*/
</style>
