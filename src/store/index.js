import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      accessToken: null,
      user: null,
      recentActivities: null,
      activities: null,
      allActivities: null,
      mapData: null,
      userStats: null,
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
    storeUserStats(state, userStats) {
      state.userStats = userStats
    },
    storeAllActivities(state, allActivities) {
      state.allActivities = allActivities
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
    storeActivities({ commit }, activities) {
      commit('storeActivities', activities)
    },
    storeRecentActivities({ commit }, activities) {
      commit('storeRecentActivities', activities)
    },
    storeMapData({ commit }, mapData) {
      commit('storeMapData', mapData)
    },
    storeUserStats({ commit }, userStats) {
      commit('storeUserStats', userStats)
    },
    storeAllActivities({ commit }, allActivities) {
      commit('storeAllActivities', allActivities)
    },
  },
})
