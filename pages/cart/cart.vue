<template>
	<view class="cart-container">
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<uni-swipe-action>
			<!-- 商品列表区域 -->
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="delGoods(goods.goods_id)">
					<my-goods :goods="goods" showRadio @radio-change='radioChangeHandler' showNum
						@changNum='changHander'>
					</my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 结算区域 -->
		<my-settle></my-settle>
	</view>
</template>

<script>
	import badgeMixin from '../../mixinx/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		mixins: [badgeMixin],
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			};
		},
		computed: {
			// 将 m_cart 模块中的 cart 数组映射到当前页面中使用
			...mapState('m_cart', ['cart']),

		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'delGoodsId']),
			radioChangeHandler(goods) {
				console.log(goods);
				this.updateGoodsState(goods)
			},
			changHander(e) {
				this.updateGoodsCount(e)
			},
			delGoods(id) {
				this.delGoodsId(id)
			}
		},
		watch: {
			total(newTotal) {
				this.setBadge()
			}
		}

	}
</script>

<style lang="scss">
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			margin-left: 10px;
		}
	}

	.cart-container {
		padding-bottom: 50px;
	}
</style>
