import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      accessToken: null,
      user: null,
      activities: null,
      recentActivities: null,
      mapData: null,
    }
  },
  mutations: {
    storeToken(state, token) {
      state.accessToken = token
    },
    storeUser(state, user) {
      state.user = user
    },
    storeActivities(state, activities) {
      state.activities = activities
    },
    storeRecentActivities(state, activities) {
      state.recentActivities = activities
    },
    storeMapData(state, mapData) {
      state.mapData = mapData
    },
  },
  actions: {
    storeToken({ commit }, token) {
      commit('storeToken', token)
    },
    removeToken({ commit }) {
      commit('storeToken', null)
    },
    storeUser({ commit }, user) {
      commit('storeUser', user)
    },
    removeUser({ commit }) {
      commit('storeUser', null)
    },
    storeActivities({ commit }, activities) {
      commit('storeActivities', activities)
    },
    removeActivities({ commit }) {
      commit('storeActivities', null)
    },
    storeRecentActivities({ commit }, activities) {
      commit('storeRecentActivities', activities)
    },
    removeRecentActivities({ commit }) {
      commit('storeRecentActivities', null)
    },
    storeMapData({ commit }, mapData) {
      commit('storeMapData', mapData)
    },
  },
})
