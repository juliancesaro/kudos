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
      window.localStorage.setItem('stravaAccessToken', token)
      commit('storeToken', token)
    },
    removeToken({ commit }) {
      window.localStorage.removeItem('stravaAccessToken')
      commit('storeToken', null)
    },
  },
  getters: {
    accessToken: (state) => {
      return state.accessToken
    },
  },
})
