<template>
	<view>
		<block v-for="(item,i) in goodslist" :key="i">
			<my-goods :goods='item' @click.native='gotoDetail(item.goods_id)'></my-goods>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				goodslist: [], //结果列表
				total: '', //商品总数
				// 是否正在请求数据
				isloading: false
			};
		},
		onLoad(options) {
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cat_id || ''
			this.getGoodslist()
		},
		methods: {
			async getGoodslist(cd) {
				// ** 打开节流阀
				this.isloading = true
				const {
					data: res
				} = await uni.$http.get('/goods/search', this.queryObj)
				if (res.meta.status !== 200) return uni.$showMsg()
				// this.goodslist = res.message.goods
				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.goodslist = [...this.goodslist, ...res.message.goods]
				this.total = res.message.total
				// ** 关闭节流阀
				this.isloading = false
				typeof cd === "function" && cd()
			},
			gotoDetail(id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
				})
			}
		},
		// 触底的事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if (this.isloading) return
			// 让页码值自增 +1
			this.queryObj.pagenum += 1
			// 重新获取列表数据
			this.getGoodslist()
		},
		// 下拉刷新的事件
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodslist = []

			// 2. 重新发起请求
			this.getGoodslist(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
