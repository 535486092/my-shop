export default {
	namespaced: true,
	state() {
		return {
			address: JSON.parse(uni.getStorageSync('address') || null),
			token: null
			// address: null
		}
	},
	mutations: {
		updateAddress(state, address) {
			state.address = address
			this.commit('user/saveAddress')
		},
		saveAddress(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
	},
	getters: {
		addressStr(state) {
			if (!state.address) return ''
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}
