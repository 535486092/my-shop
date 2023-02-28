export default {
	// 为当前模块开启命名空间
	namespaced: true,
	state() {
		return {
			// 购物车的数组，用来存储购物车中每个商品的信息对象
			// 每个商品的信息对象，都包含如下 6 个属性：
			// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
			cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
		}
	},
	mutations: {
		addGoodsToCart(state, goods) {

			const findGoods = state.cart.find(item => item.goods_id === goods.goods_id)
			// console.log(findGoods);
			if (findGoods) {
				//如果添加的商品已经存在，则修改商品数量
				findGoods.goods_count++
			} else {
				//如果添加的商品已不存在，则添加
				state.cart.push(goods)
			}
			this.commit('m_cart/saveToStorage')
		},
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		//修改商品选中状态
		updateGoodsState(state, goods) {
			state.cart.some(item => {
				if (item.goods_id === goods.goods_id) {
					item.goods_state = !goods.goods_state
					return true
				}
			})
			this.commit('m_cart/saveToStorage')
		},
		//修改商品的数量
		updateGoodsCount(state, goods) {
			state.cart.some(item => {
				if (item.goods_id === goods.goods_id) {
					item.goods_count = goods.goods_count
					this.commit('m_cart/saveToStorage')
					return true
				}
			})
		},
		//根据id删除商品
		delGoodsId(state, id) {
			const index = state.cart.findIndex(item => item.goods_id === id)
			state.cart.splice(index, 1)
			this.commit('m_cart/saveToStorage')
		},
		//全选
		updateCheckdeAll(state, goods_state) {
			state.cart.forEach(goods => goods.goods_state = goods_state)
			this.commit('m_cart/saveToStorage')
		}
	},
	getters: {
		//统计商品数量
		total(state) {
			return state.cart.reduce((sum, goods) => sum += goods.goods_count, 0)
		},
		//统计选中商品的数量
		checkedGoodsCount(state) {
			return state.cart.reduce((sum, goods) => {
				if (goods.goods_state) {
					return sum += goods.goods_count
				}
				return sum
			}, 0)
		},
		// 已勾选的商品的总价
		checkedGoodsAmount(state) {
			return state.cart.reduce((sum, goods) => {
				if (goods.goods_state) {
					return sum += goods.goods_price * goods.goods_count
				}
				return sum
			}, 0).toFixed(2)
		}
	}
}
