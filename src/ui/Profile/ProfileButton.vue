<template>
  <div class="drawable-profile-button">
    <div>
      <button @click="onTogglePopover" v-if="$store.state.auth.authenticated">Welcome, {{
          $store.state.auth.user.name
        }}
      </button>
      <button v-if="!($store.state.auth.authenticated)" @click="onLogin">
        Login
      </button>
    </div>
    <div v-if="popover" class="drawable-profile-popover">
      <ul>
<!--        <li v-if="!($store.state.auth.user.verified)">Please verify your email</li>-->
        <li @click="onLogout">Logout</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ProfileButton",
  inject: ["controller"],
  data() {
    return {
      popover: false
    }
  },

  methods: {
    onTogglePopover() {
      this.popover = !this.popover;
    },

    onLogin() {
      this.controller.login();
    },

    onLogout() {
      this.popover = false;
      this.controller.logout();
    }
  }
}
</script>
