import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      accessToken: null,
    }
  },
  mutations: {
    storeToken(state, token) {
      state.accessToken = token
    },
  },
  actions: {
    storeToken({ commit }, token) {
      commit('storeToken', token)
    },
  },
  getters: {
    accessToken: (state) => {
      return state.accessToken
    },
  },
})
