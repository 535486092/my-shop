<template>
	<!-- 最外层的容器 -->
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="updateCheckde">
			<radio color="#C00000" :checked="isFullChecked" /><text>全选</text>
		</label>

		<!-- 合计区域 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>

		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedGoodsCount}})</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		data() {
			return {}
		},
		computed: {
			...mapGetters('m_cart', ['checkedGoodsCount', 'total', 'checkedGoodsAmount']),
			...mapGetters('user', ['addressStr']),
			...mapState('user', ['token']),
			//全选按钮的选中状态
			isFullChecked() {
				//选中商品的数量===所有商品的数量
				return this.checkedGoodsCount === this.total
			}
		},
		methods: {
			...mapMutations('m_cart', ['updateCheckdeAll']),
			updateCheckde() {
				this.updateCheckdeAll(!this.isFullChecked)
			},
			settlement() {
				//没有选中商品
				if (!this.checkedGoodsCount) return uni.$showMsg('请选择结算商品')
				//没有收货地址
				if (!this.addressStr) return uni.$showMsg('请选择收货地址')
				//没有登陆
				if (!this.token) return uni.$showMsg('请登录')
				uni.$showMsg('结算成功')
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		// 将背景色从 cyan 改为 white
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #c00000;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #c00000;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>
