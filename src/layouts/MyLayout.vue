<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Punts
          <div slot="subtitle">última modificació: 28/06/2019</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-brown-1' : null"
    >
      <q-list
        separator
      >
        <q-list-header>Opcions</q-list-header>
<!-- 
        <q-item link to="/">
          <q-item-side icon="format_line_spacing" />
          <q-item-main label="Major puntuacio" />
        </q-item>
 -->
        <!-- <q-item-separator /> -->
        <q-item>
          <q-select
            v-model="ordrePuntuacio"
            stack-label="Ordre posicio"
            hide-underline
            :options="opcions_ordre_puntuacio"
            color="amber"
            inverted-light
            style="min-width: 100px"
            @input="accioSeleccionarOrdre"
          />
        </q-item>
        <!-- <q-item-separator /> -->
        <q-item >
          <q-btn color="negative"  icon="delete" label="eliminar partides" @click="eliminarPartides" />
        </q-item>
        <!-- <q-item-separator /> -->

      </q-list>
    </q-layout-drawer>

    <q-page-container style="padding-top: 5px">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      ordrePuntuacio: "ordreMenorPuntuacio",
      opcions_ordre_puntuacio: [
          { label: 'major puntuacio', value: 'ordreMajorPuntuacio' },
          { label: 'menor puntuacio', value: 'ordreMenorPuntuacio' }
        ],
    }
  },


  methods: {
    accioSeleccionarOrdre: function(){
      this.$store.dispatch('actionSeleccionarOrdre', this.ordrePuntuacio)
      .then(() => {
        this.$store.dispatch('actionCalculaPosicio');
        this.leftDrawerOpen = false;
      });
    },

    eliminarPartides: function(){
      this.$q.dialog({
        title: 'Confirmar',
        message: "Eliminar totes les partides?",
        ok: 'Ok',
        cancel: 'No'
      }).then(() => {
            
            this.$store.dispatch('actionEliminarPartides');

            this.leftDrawerOpen = false;
      
            this.$q.notify({
              message: "Partides eliminades !!",
              timeout: 2000
            });


      }).catch(() => {
        this.$q.notify({
              message: "no s'ha eliminat cap partida",
              timeout: 2000
            });
      })

    }
  }
}
</script>

<style>

.q-layout-page-container{
  padding-top: 5px;
}

</style>
