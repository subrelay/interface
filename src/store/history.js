import axios from 'axios';
import { pickBy } from 'lodash';

export default {
  namespaced: true,

  state: () => ({
    query: null,
    logs: [],
    loading: null,
  }),

  mutations: {
    saveQuery: (state, query) => (state.query = query),
    getLogs: (state, logs) => (state.logs = logs),
    setLoading: (state, isLoading) => (state.loading = isLoading),
  },

  actions: {
    async getLogs({ commit, state }) {
      commit('setLoading', true);
      try {
        // const logs = await API.Workflow.getLogs(state.query);
        const { data: logs } = await axios({
          url: 'mockData/workflow/logs.json',
          baseURL: 'http://127.0.0.1:5173',
          params: new URLSearchParams({ ...pickBy(state.query) }),
        });
        commit('getLogs', logs);
      } catch (error) {
        commit('getLogs', []);
        console.log('error', error);
      } finally {
        commit('setLoading', false);
      }
    },
  },
};
