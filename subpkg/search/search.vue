<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" cancel-button='none' :radius="100"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="kw.length!==0">
			<view class="sugg-item" v-for="(item, i) in serachList" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="right" size="18"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<view class="history-title">
				<view>搜索历史</view>
				<uni-icons type="trash" size="18" @click="del"></uni-icons>
			</view>
		</view>
		<view class="history-list">
			<uni-tag v-for="(item,i) in historyList" :key="i" :text="item" @click="gotoGoodlist(item)"></uni-tag>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				kw: '', //搜索框的内容
				serachList: [], //搜索结果
				timer: null, //记录定时器编号
				historyList: ['a', 'b', 'c']
			};
		},
		methods: {
			input(val) {
				//通过防抖限制请求发送频率
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = val
					if (val.length === 0) {
						return this.searchList = []
					}
					this.getSearchResult()
				}, 1000)
			},
			//获取搜索结果
			async getSearchResult() {
				const {
					data: res
				} = await uni.$http.get('/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				this.serachList = res.message
				this.saveSearchHistory()

			},
			gotoDetail(id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?good_id=' + id
				})
			},
			saveSearchHistory() {
				this.historyList.unshift(this.kw)
				const set = new Set(this.historyList)
				this.historyList = Array.from(set)
				//数据持久化处理
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			//点击删除历史数据
			del() {
				this.historyList = []
				uni.setStorageSync('kw', '')
			},
			gotoGoodlist(item) {
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?query=` + item
				})
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		}
	}
</script>

<style lang="scss">
	.search-box {
		background-color: #c00000;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
